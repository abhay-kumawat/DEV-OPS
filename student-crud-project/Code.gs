/**
 * SPSU UDAIPUR CHAMPIONSHIP • DAY 9 – CRUD WAR ARENA
 * Student Placement Tracker – Google Apps Script Backend (Code.gs)
 * 
 * INSTRUCTIONS:
 * 1. Create a Google Sheet named "Student Placement Tracker".
 * 2. Rename the first tab to: Students
 * 3. Copy the Spreadsheet ID from your URL:
 *    https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
 * 4. Paste your SPREADSHEET_ID below.
 * 5. Click "Deploy" -> "New deployment" -> Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click Deploy, Authorize access, and copy the Web App URL.
 * 9. Paste the Web App URL into script.js (or configure it directly in the UI).
 */

const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Students";

// Required headers in Row 1 of the "Students" sheet
const HEADERS = ["ID", "Name", "Email", "Domain", "Status", "Created At"];

/**
 * Handle GET requests (e.g. Read all records or health check)
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "read";
    return handleRequest(action, e ? e.parameter : {});
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || "Failed to process GET request"
    });
  }
}

/**
 * Handle POST requests (Create, Update, Delete)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No request payload provided.");
    }
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    return handleRequest(action, data);
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message || "Failed to process POST request"
    });
  }
}

/**
 * Main request router for CRUD operations
 */
function handleRequest(action, data) {
  try {
    const sheet = getSheet();

    switch (action) {
      case "create": {
        if (!data.name || !data.email) {
          throw new Error("Student Name and Email are required.");
        }
        const id = new Date().getTime().toString();
        const createdAt = new Date().toLocaleString();
        
        sheet.appendRow([
          id,
          data.name,
          data.email,
          data.domain || "N/A",
          data.status || "Learning",
          createdAt
        ]);

        return jsonResponse({
          success: true,
          message: "Student record created successfully!",
          id: id
        });
      }

      case "read": {
        const values = sheet.getDataRange().getValues();
        
        // If sheet is empty or only has headers
        if (values.length <= 1) {
          return jsonResponse({
            success: true,
            data: []
          });
        }

        // Shift headers row out
        const headers = values.shift();
        
        // Map remaining rows to student objects
        const students = values
          .filter(row => row[0] !== "" && row[0] !== undefined) // filter blank rows
          .map(row => ({
            id: String(row[0]),
            name: String(row[1] || ""),
            email: String(row[2] || ""),
            domain: String(row[3] || ""),
            status: String(row[4] || "Learning"),
            createdAt: row[5] ? String(row[5]) : ""
          }));

        return jsonResponse({
          success: true,
          data: students
        });
      }

      case "update": {
        if (!data.id) {
          throw new Error("Student ID is required for update.");
        }
        const updateRow = findRowById(sheet, data.id);
        if (updateRow === -1) {
          throw new Error("Student record not found for update.");
        }

        // Columns: 2=Name, 3=Email, 4=Domain, 5=Status
        sheet.getRange(updateRow, 2, 1, 4).setValues([[
          data.name,
          data.email,
          data.domain,
          data.status
        ]]);

        return jsonResponse({
          success: true,
          message: "Student record updated successfully!"
        });
      }

      case "delete": {
        if (!data.id) {
          throw new Error("Student ID is required for deletion.");
        }
        const deleteRow = findRowById(sheet, data.id);
        if (deleteRow === -1) {
          throw new Error("Student record not found for deletion.");
        }

        sheet.deleteRow(deleteRow);

        return jsonResponse({
          success: true,
          message: "Student record deleted successfully!"
        });
      }

      default:
        throw new Error("Invalid action specified: " + action);
    }
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}

/**
 * Access the Google Sheet and initialize headers if it's new
 */
function getSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_YOUR_SPREADSHEET_ID_HERE") {
    throw new Error("Please set your SPREADSHEET_ID in Code.gs before deploying.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  // If sheet tab does not exist, create it
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  // If sheet is empty, automatically add headers in Row 1
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    // Format headers with styling
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#b71c1c");
    headerRange.setFontColor("#ffffff");
  }

  return sheet;
}

/**
 * Find the 1-based row index for a student ID in Column A
 */
function findRowById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  const ids = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .getValues()
    .flat();

  const index = ids.findIndex(value => String(value) === String(id));
  return index === -1 ? -1 : index + 2;
}

/**
 * Format response as JSON with proper Content-Type
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

