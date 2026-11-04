/**
 * ==========================================================================
 * SPSU UDAIPUR CHAMPIONSHIP • DAY 9 – CRUD WAR ARENA
 * Complete Placement-Ready CRUD Client Script (script.js v2.0 Enhanced)
 * 
 * Tech Stack: HTML5 • CSS3 • JavaScript (ES6+) • Google Sheets • Apps Script
 * Framework: SarlaYash Learning Experience Framework • SPSU Udaipur
 * ==========================================================================
 */

// 1. CONFIGURATION
// Paste your deployed Google Apps Script Web App URL below:
const API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Check if user has overridden the URL in localStorage
let activeApiUrl = localStorage.getItem("spsu_api_url") || API_URL;
let isDemoMode = localStorage.getItem("spsu_use_demo_mode") === "true" || 
                 !activeApiUrl || 
                 activeApiUrl.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT");

// In-memory data store for students & sorting state
let students = [];
let pendingDeleteId = null;
let currentSortField = "createdAt";
let currentSortOrder = "desc"; // "asc" or "desc"
let activeChipFilter = "ALL";

// Initial sample dataset for Local Demo Mode
const SEED_STUDENTS = [
  {
    id: "1730000001",
    name: "Aarav Sharma",
    email: "aarav.sharma@spsu.ac.in",
    domain: "Java Full Stack",
    status: "Placed",
    createdAt: "02/11/2026, 10:15:00"
  },
  {
    id: "1730000002",
    name: "Priya Rathore",
    email: "priya.rathore@spsu.ac.in",
    domain: "Data Analytics",
    status: "Interview Ready",
    createdAt: "03/11/2026, 11:30:20"
  },
  {
    id: "1730000003",
    name: "Vikramaditya Singh",
    email: "vikram.singh@spsu.ac.in",
    domain: "Python",
    status: "Placed",
    createdAt: "03/11/2026, 14:05:10"
  },
  {
    id: "1730000004",
    name: "Ananya Mehta",
    email: "ananya.mehta@spsu.ac.in",
    domain: "Cloud",
    status: "Learning",
    createdAt: "04/11/2026, 09:20:45"
  },
  {
    id: "1730000005",
    name: "Karan Joshi",
    email: "karan.joshi@spsu.ac.in",
    domain: "UI/UX",
    status: "Interview Ready",
    createdAt: "04/11/2026, 10:00:15"
  }
];

// DOM Element References
const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const domainSelect = document.getElementById("domain");
const statusSelect = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");
const formIcon = document.getElementById("formIcon");
const formTitle = document.getElementById("formTitle");
const formModeTag = document.getElementById("formModeTag");
const formCard = document.querySelector(".form-card");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const message = document.getElementById("message");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const filterDomain = document.getElementById("filterDomain");
const filterStatus = document.getElementById("filterStatus");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const recordCountText = document.getElementById("recordCountText");
const refreshBtn = document.getElementById("refreshBtn");
const refreshIcon = document.getElementById("refreshIcon");

// KPI Metric Elements
const statTotal = document.getElementById("statTotal");
const statLearning = document.getElementById("statLearning");
const statInterview = document.getElementById("statInterview");
const statPlaced = document.getElementById("statPlaced");
const statRate = document.getElementById("statRate");
const statProgressBar = document.getElementById("statProgressBar");

// Mode & Modal Elements
const apiStatusBadge = document.getElementById("apiStatusBadge");
const apiStatusText = document.getElementById("apiStatusText");
const btnOpenApiModal = document.getElementById("btnOpenApiModal");
const btnToggleDemoMode = document.getElementById("btnToggleDemoMode");
const apiModal = document.getElementById("apiModal");
const apiUrlInput = document.getElementById("apiUrlInput");
const chkUseLocalStorage = document.getElementById("chkUseLocalStorage");
const btnCloseApiModal = document.getElementById("btnCloseApiModal");
const btnSaveApiConfig = document.getElementById("btnSaveApiConfig");

// Delete Confirmation Modal Elements
const deleteModal = document.getElementById("deleteModal");
const deleteModalMessage = document.getElementById("deleteModalMessage");
const btnCancelDelete = document.getElementById("btnCancelDelete");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

// Candidate Dossier Modal Elements
const dossierModal = document.getElementById("dossierModal");
const dossierAvatar = document.getElementById("dossierAvatar");
const dossierName = document.getElementById("dossierName");
const dossierEmail = document.getElementById("dossierEmail");
const dossierDomain = document.getElementById("dossierDomain");
const dossierStatus = document.getElementById("dossierStatus");
const dossierId = document.getElementById("dossierId");
const dossierDate = document.getElementById("dossierDate");
const btnEditFromDossier = document.getElementById("btnEditFromDossier");

// Theme Switcher Elements
const btnThemeToggle = document.getElementById("btnThemeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// ==========================================================================
// 2. INITIALIZATION & THEME SETUP
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLocalStorage();
  updateApiStatusUI();
  loadStudents();
  initEventListeners();
});

function initTheme() {
  const savedTheme = localStorage.getItem("spsu_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeUI(savedTheme);
}

function updateThemeUI(theme) {
  if (theme === "dark") {
    themeIcon.className = "ri-sun-line";
    themeText.innerText = "Light";
  } else {
    themeIcon.className = "ri-moon-line";
    themeText.innerText = "Dark";
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("spsu_theme", newTheme);
  updateThemeUI(newTheme);
  showToast(`Switched to ${newTheme} mode!`, "info", 1800);
}

function initLocalStorage() {
  if (!localStorage.getItem("spsu_local_students")) {
    localStorage.setItem("spsu_local_students", JSON.stringify(SEED_STUDENTS));
  }
}

function initEventListeners() {
  // Form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = studentIdInput.value.trim();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const domain = domainSelect.value;
    const status = statusSelect.value;

    if (!name || !email || !domain || !status) {
      showMessage("Please fill in all required fields.", "error");
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const payload = {
      action: id ? "update" : "create",
      id: id || undefined,
      name: name,
      email: email,
      domain: domain,
      status: status
    };

    setButtonLoading(true);

    try {
      showMessage("Processing...", "success");
      let result;

      if (isDemoMode) {
        result = await mockLocalRequest(payload);
      } else {
        result = await sendRequest(payload);
      }

      if (!result.success) {
        throw new Error(result.message);
      }

      if (status === "Placed") {
        triggerConfetti();
      }

      showMessage(result.message, "success");
      showToast(result.message, "success");
      resetForm();
      await loadStudents();

    } catch (error) {
      showMessage(error.message, "error");
      showToast(error.message, "error");
    } finally {
      setButtonLoading(false);
    }
  });

  // Modal open/close & theme events
  btnOpenApiModal.addEventListener("click", openApiModal);
  btnCloseApiModal.addEventListener("click", closeApiModal);
  btnSaveApiConfig.addEventListener("click", saveApiConfig);
  btnToggleDemoMode.addEventListener("click", toggleDemoModeQuick);
  btnThemeToggle.addEventListener("click", toggleTheme);

  // Delete modal actions
  btnCancelDelete.addEventListener("click", closeDeleteModal);
  btnConfirmDelete.addEventListener("click", executePendingDelete);

  // Close modals on clicking overlay backdrop
  [apiModal, deleteModal, dossierModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    }
  });

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      apiModal.classList.remove("active");
      deleteModal.classList.remove("active");
      if (dossierModal) dossierModal.classList.remove("active");
    }
  });
}

function updateApiStatusUI() {
  if (isDemoMode) {
    apiStatusBadge.classList.remove("live");
    apiStatusBadge.innerHTML = `<i class="ri-hard-drive-2-line"></i> Local Demo Mode`;
    showMessage("Operating in Local Demo Mode. Records persist in browser storage.", "success");
  } else {
    apiStatusBadge.classList.add("live");
    apiStatusBadge.innerHTML = `<i class="ri-cloud-line"></i> Live Google Sheets`;
    message.style.display = "none";
  }
}

// ==========================================================================
// 3. CRUD: READ
// ==========================================================================
async function loadStudents() {
  renderSkeletonLoader();
  spinRefreshIcon(true);

  try {
    let fetchedStudents = [];

    if (isDemoMode) {
      await new Promise(res => setTimeout(res, 220));
      const localData = localStorage.getItem("spsu_local_students");
      fetchedStudents = localData ? JSON.parse(localData) : [];
    } else {
      const response = await fetch(`${activeApiUrl}?action=read`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      fetchedStudents = result.data || [];
    }

    students = fetchedStudents;
    updateKPIDashboard();
    updateChipCounts();
    renderTable();

  } catch (error) {
    console.error("Load students error:", error);
    showMessage("Unable to load data: " + error.message, "error");
    showToast("Unable to load data: " + error.message, "error");

    if (!isDemoMode) {
      renderErrorEmptyState(error.message);
    }
  } finally {
    spinRefreshIcon(false);
  }
}

// ==========================================================================
// 4. CRUD: UPDATE (PREFILL FORM)
// ==========================================================================
function editStudent(id) {
  const student = students.find(item => String(item.id) === String(id));
  if (!student) return;

  studentIdInput.value = student.id;
  nameInput.value = student.name;
  emailInput.value = student.email;
  domainSelect.value = student.domain;
  statusSelect.value = student.status;

  formTitle.innerText = "Update Student";
  submitBtnText.innerText = "Update Student";
  formIcon.className = "ri-edit-line";
  formModeTag.innerText = "Edit Mode";
  formModeTag.className = "badge badge-edit-mode";
  formCard.classList.add("edit-active");

  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  nameInput.focus();
  showToast(`Editing: ${student.name}`, "info", 2000);
}

function resetForm() {
  form.reset();
  studentIdInput.value = "";
  formTitle.innerText = "Add Student";
  submitBtnText.innerText = "Create Student";
  formIcon.className = "ri-user-add-line";
  formModeTag.innerText = "Create Mode";
  formModeTag.className = "badge badge-neutral";
  formCard.classList.remove("edit-active");
}

// ==========================================================================
// 5. CRUD: DELETE
// ==========================================================================
async function deleteStudent(id) {
  const student = students.find(item => String(item.id) === String(id));
  const studentName = student ? student.name : "this student";

  pendingDeleteId = id;
  deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>${escapeHtml(studentName)}</strong>? This action cannot be undone.`;
  deleteModal.classList.add("active");
}

function closeDeleteModal() {
  deleteModal.classList.remove("active");
  pendingDeleteId = null;
}

async function executePendingDelete() {
  if (!pendingDeleteId) return;
  const idToDelete = pendingDeleteId;
  closeDeleteModal();

  try {
    let result;
    if (isDemoMode) {
      result = await mockLocalRequest({ action: "delete", id: idToDelete });
    } else {
      result = await sendRequest({ action: "delete", id: idToDelete });
    }

    if (!result.success) {
      throw new Error(result.message);
    }

    showMessage(result.message, "success");
    showToast(result.message, "success");
    loadStudents();

  } catch (error) {
    showMessage(error.message, "error");
    showToast(error.message, "error");
  }
}

// ==========================================================================
// 6. API COMMUNICATION (sendRequest)
// ==========================================================================
async function sendRequest(payload) {
  const response = await fetch(activeApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

// ==========================================================================
// 7. LOCAL STORAGE MOCK ENGINE
// ==========================================================================
async function mockLocalRequest(payload) {
  await new Promise(res => setTimeout(res, 200));
  let localStudents = JSON.parse(localStorage.getItem("spsu_local_students") || "[]");

  switch (payload.action) {
    case "create": {
      const newId = new Date().getTime().toString();
      const newRecord = {
        id: newId,
        name: payload.name,
        email: payload.email,
        domain: payload.domain,
        status: payload.status,
        createdAt: new Date().toLocaleString()
      };
      localStudents.unshift(newRecord);
      localStorage.setItem("spsu_local_students", JSON.stringify(localStudents));
      return { success: true, message: "Student created successfully" };
    }

    case "update": {
      const index = localStudents.findIndex(s => String(s.id) === String(payload.id));
      if (index === -1) {
        throw new Error("Student record not found");
      }
      localStudents[index] = {
        ...localStudents[index],
        name: payload.name,
        email: payload.email,
        domain: payload.domain,
        status: payload.status
      };
      localStorage.setItem("spsu_local_students", JSON.stringify(localStudents));
      return { success: true, message: "Student updated successfully" };
    }

    case "delete": {
      const filtered = localStudents.filter(s => String(s.id) !== String(payload.id));
      if (filtered.length === localStudents.length) {
        throw new Error("Student record not found");
      }
      localStorage.setItem("spsu_local_students", JSON.stringify(filtered));
      return { success: true, message: "Student deleted successfully" };
    }

    default:
      throw new Error("Invalid action");
  }
}

// ==========================================================================
// 8. TABLE RENDERING, SEARCH & SORTING
// ==========================================================================
function renderTable() {
  const searchTerm = (searchInput.value || "").toLowerCase().trim();
  const selectedDomain = filterDomain.value;
  const selectedStatus = filterStatus.value;

  // Filter records
  let filtered = students.filter(student => {
    const matchesSearch = 
      (student.name || "").toLowerCase().includes(searchTerm) ||
      (student.email || "").toLowerCase().includes(searchTerm);

    const matchesDomain = (selectedDomain === "ALL") || (student.domain === selectedDomain);
    const matchesStatus = (selectedStatus === "ALL") || (student.status === selectedStatus);
    const matchesChip = (activeChipFilter === "ALL") || (student.status === activeChipFilter);

    return matchesSearch && matchesDomain && matchesStatus && matchesChip;
  });

  // Sort records
  filtered.sort((a, b) => {
    let valA = (a[currentSortField] || "").toLowerCase();
    let valB = (b[currentSortField] || "").toLowerCase();
    if (valA < valB) return currentSortOrder === "asc" ? -1 : 1;
    if (valA > valB) return currentSortOrder === "asc" ? 1 : -1;
    return 0;
  });

  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    renderEmptyState(searchTerm || selectedDomain !== "ALL" || selectedStatus !== "ALL" || activeChipFilter !== "ALL");
    recordCountText.innerText = `Showing 0 of ${students.length} students`;
    return;
  }

  filtered.forEach(student => {
    const row = document.createElement("tr");
    const statusClass = (student.status || "").toLowerCase().replace(/\s+/g, "-");
    const initials = getInitials(student.name);

    row.innerHTML = `
      <td>
        <div class="candidate-cell" onclick="viewDossier('${student.id}')">
          <div class="candidate-avatar">${initials}</div>
          <div class="candidate-meta">
            <span class="candidate-name">${escapeHtml(student.name)}</span>
            <span class="candidate-email">${escapeHtml(student.email)}</span>
          </div>
        </div>
      </td>
      <td onclick="viewDossier('${student.id}')">
        <span class="domain-badge">
          ${getDomainIcon(student.domain)} ${escapeHtml(student.domain)}
        </span>
      </td>
      <td onclick="viewDossier('${student.id}')">
        <span class="status-pill ${statusClass}">
          <span class="status-dot"></span>
          ${escapeHtml(student.status)}
        </span>
      </td>
      <td onclick="viewDossier('${student.id}')">
        <span class="date-text">${formatDate(student.createdAt)}</span>
      </td>
      <td class="text-right">
        <div class="action-buttons">
          <button class="btn-icon-action btn-icon-view" 
                  title="View Candidate Dossier" 
                  onclick="event.stopPropagation(); viewDossier('${student.id}')">
            <i class="ri-eye-line"></i>
          </button>
          <button class="btn-icon-action btn-icon-edit" 
                  title="Edit student record" 
                  onclick="event.stopPropagation(); editStudent('${student.id}')">
            <i class="ri-edit-line"></i>
          </button>
          <button class="btn-icon-action btn-icon-delete" 
                  title="Delete student record" 
                  onclick="event.stopPropagation(); deleteStudent('${student.id}')">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  recordCountText.innerText = `Showing ${filtered.length} of ${students.length} students`;
}

function handleSearch() {
  const value = searchInput.value;
  clearSearchBtn.style.display = value ? "inline-flex" : "none";
  renderTable();
}

function clearSearch() {
  searchInput.value = "";
  clearSearchBtn.style.display = "none";
  renderTable();
}

function handleFilter() {
  renderTable();
}

function setChipFilter(status) {
  activeChipFilter = status;
  document.querySelectorAll(".status-chips-bar .chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.filter === status);
  });
  renderTable();
}

function updateChipCounts() {
  const total = students.length;
  const learning = students.filter(s => s.status === "Learning").length;
  const interview = students.filter(s => s.status === "Interview Ready").length;
  const placed = students.filter(s => s.status === "Placed").length;

  const countAll = document.getElementById("chipCountAll");
  const countLearning = document.getElementById("chipCountLearning");
  const countInterview = document.getElementById("chipCountInterview");
  const countPlaced = document.getElementById("chipCountPlaced");

  if (countAll) countAll.innerText = total;
  if (countLearning) countLearning.innerText = learning;
  if (countInterview) countInterview.innerText = interview;
  if (countPlaced) countPlaced.innerText = placed;
}

function toggleSort(field) {
  if (currentSortField === field) {
    currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
  } else {
    currentSortField = field;
    currentSortOrder = "asc";
  }

  // Update sort icons
  ["Name", "Email", "Domain", "Status"].forEach(f => {
    const icon = document.getElementById(`sortIcon${f}`);
    const th = icon?.parentElement;
    if (icon) {
      if (f.toLowerCase() === field.toLowerCase()) {
        icon.className = currentSortOrder === "asc" ? "ri-sort-asc" : "ri-sort-desc";
        th?.classList.add("active-sort");
      } else {
        icon.className = "ri-arrow-up-down-line sort-icon";
        th?.classList.remove("active-sort");
      }
    }
  });

  renderTable();
}

// ==========================================================================
// 9. CANDIDATE DOSSIER (QUICK VIEW)
// ==========================================================================
function viewDossier(id) {
  const student = students.find(s => String(s.id) === String(id));
  if (!student || !dossierModal) return;

  const statusClass = (student.status || "").toLowerCase().replace(/\s+/g, "-");

  dossierAvatar.innerText = getInitials(student.name);
  dossierName.innerText = student.name;
  dossierEmail.innerText = student.email;
  dossierDomain.innerHTML = `${getDomainIcon(student.domain)} ${escapeHtml(student.domain)}`;
  dossierStatus.innerHTML = `<span class="status-dot"></span> ${escapeHtml(student.status)}`;
  dossierStatus.className = `status-pill ${statusClass}`;
  dossierId.innerText = student.id;
  dossierDate.innerText = student.createdAt || "Recent";

  btnEditFromDossier.onclick = () => {
    closeDossierModal();
    editStudent(student.id);
  };

  dossierModal.classList.add("active");
}

function closeDossierModal() {
  if (dossierModal) dossierModal.classList.remove("active");
}

// Skeleton Loader when fetching
function renderSkeletonLoader() {
  tableBody.innerHTML = `
    <tr class="skeleton-row">
      <td><div class="skeleton-box" style="width: 70%"></div></td>
      <td><div class="skeleton-box" style="width: 50%"></div></td>
      <td><div class="skeleton-box" style="width: 60%"></div></td>
      <td><div class="skeleton-box" style="width: 40%"></div></td>
      <td><div class="skeleton-box" style="width: 50px; margin-left: auto;"></div></td>
    </tr>
    <tr class="skeleton-row">
      <td><div class="skeleton-box" style="width: 65%"></div></td>
      <td><div class="skeleton-box" style="width: 45%"></div></td>
      <td><div class="skeleton-box" style="width: 55%"></div></td>
      <td><div class="skeleton-box" style="width: 35%"></div></td>
      <td><div class="skeleton-box" style="width: 50px; margin-left: auto;"></div></td>
    </tr>
  `;
}

// Empty state UI
function renderEmptyState(isFiltered) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state-cell">
        <div class="empty-state-wrap">
          <div class="empty-icon">
            <i class="ri-folder-user-line"></i>
          </div>
          <h4>${isFiltered ? "No Matching Records Found" : "No Student Records Yet"}</h4>
          <p>${isFiltered 
              ? "Try adjusting your search criteria or resetting filters." 
              : "Start tracking candidates by adding your first student above."}
          </p>
        </div>
      </td>
    </tr>
  `;
}

function renderErrorEmptyState(errorMessage) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state-cell">
        <div class="empty-state-wrap">
          <div class="empty-icon" style="color: #dc2626; background: rgba(220, 38, 38, 0.1);">
            <i class="ri-error-warning-line"></i>
          </div>
          <h4>Unable to connect to Google Sheets</h4>
          <p>${escapeHtml(errorMessage)}</p>
          <button class="btn-primary-small" style="margin-top: 10px;" onclick="switchToDemoMode()">
            <i class="ri-play-circle-line"></i> Switch to Instant Demo Mode
          </button>
        </div>
      </td>
    </tr>
  `;
}

// ==========================================================================
// 10. KPI METRICS DASHBOARD
// ==========================================================================
function updateKPIDashboard() {
  const total = students.length;
  const learningCount = students.filter(s => s.status === "Learning").length;
  const interviewCount = students.filter(s => s.status === "Interview Ready").length;
  const placedCount = students.filter(s => s.status === "Placed").length;
  const rate = total > 0 ? Math.round((placedCount / total) * 100) : 0;

  animateCounter(statTotal, total);
  animateCounter(statLearning, learningCount);
  animateCounter(statInterview, interviewCount);
  animateCounter(statPlaced, placedCount);

  statRate.innerText = `${rate}%`;
  statProgressBar.style.width = `${rate}%`;
}

function animateCounter(element, target) {
  if (!element) return;
  const current = parseInt(element.innerText) || 0;
  if (current === target) return;

  const duration = 400;
  const startTime = performance.now();

  function updateCount(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(current + (target - current) * progress);
    element.innerText = value;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.innerText = target;
    }
  }

  requestAnimationFrame(updateCount);
}

// ==========================================================================
// 11. EXPORT TO CSV
// ==========================================================================
function exportToCSV() {
  if (students.length === 0) {
    showToast("No student records to export.", "info");
    return;
  }

  const headers = ["ID", "Name", "Email", "Domain", "Status", "Registered At"];
  const rows = students.map(s => [
    `"${s.id || ''}"`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.domain || '').replace(/"/g, '""')}"`,
    `"${(s.status || '').replace(/"/g, '""')}"`,
    `"${(s.createdAt || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + 
    [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SPSU_Placement_Tracker_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Placement dataset exported as CSV!", "success");
}

// ==========================================================================
// 12. API CONFIGURATION MODAL & MODE SWITCH
// ==========================================================================
function openApiModal() {
  apiUrlInput.value = isDemoMode ? "" : activeApiUrl;
  if (chkUseLocalStorage) chkUseLocalStorage.checked = isDemoMode;
  apiModal.classList.add("active");
}

function closeApiModal() {
  apiModal.classList.remove("active");
}

function saveApiConfig() {
  const url = apiUrlInput.value.trim();
  const useDemo = chkUseLocalStorage ? chkUseLocalStorage.checked : false;

  if (useDemo || !url) {
    isDemoMode = true;
    localStorage.setItem("spsu_use_demo_mode", "true");
    showToast("Switched to Local Demo Mode.", "info");
  } else {
    isDemoMode = false;
    activeApiUrl = url;
    localStorage.setItem("spsu_api_url", url);
    localStorage.setItem("spsu_use_demo_mode", "false");
    showToast("Connected to live Google Apps Script API!", "success");
  }

  closeApiModal();
  updateApiStatusUI();
  loadStudents();
}

function toggleDemoModeQuick() {
  if (isDemoMode) {
    openApiModal();
  } else {
    switchToDemoMode();
  }
}

function switchToDemoMode() {
  isDemoMode = true;
  localStorage.setItem("spsu_use_demo_mode", "true");
  updateApiStatusUI();
  showToast("Operating in Local Demo Mode.", "info");
  loadStudents();
}

// ==========================================================================
// 13. TOAST NOTIFICATIONS SYSTEM & STATUS MESSAGE
// ==========================================================================
function showMessage(text, type) {
  if (!message) return;
  message.innerText = text;
  message.className = `message-banner ${type}`;
  message.style.display = "flex";
}

function showToast(text, type = "info", duration = 3200) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconClass = type === "success" 
    ? "ri-checkbox-circle-fill" 
    : type === "error" 
    ? "ri-error-warning-fill" 
    : "ri-information-fill";

  const titleText = type === "success" 
    ? "Success" 
    : type === "error" 
    ? "Notice" 
    : "Information";

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${titleText}</div>
      <div class="toast-message">${escapeHtml(text)}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="ri-close-line"></i>
    </button>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="animation-duration: ${duration}ms"></div>
    </div>
  `;

  container.appendChild(toast);

  const timeoutId = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeoutId);
    toast.remove();
  });
}

// ==========================================================================
// 14. CELEBRATION CONFETTI ENGINE (Pure Vanilla JS Canvas)
// ==========================================================================
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const numberOfPieces = 80;
  const colors = ["#b71c1c", "#e11d48", "#22c55e", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"];

  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      gravity: 0.35,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationId;
  const startTime = performance.now();

  function renderConfetti(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activePieces = 0;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      p.opacity -= 0.009;

      if (p.opacity > 0) {
        activePieces++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (activePieces > 0 && time - startTime < 3500) {
      animationId = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
    }
  }

  requestAnimationFrame(renderConfetti);
}

// ==========================================================================
// 15. UTILITIES & HELPERS
// ==========================================================================
function setButtonLoading(isLoading) {
  if (isLoading) {
    submitBtn.classList.add("loading");
  } else {
    submitBtn.classList.remove("loading");
  }
}

function spinRefreshIcon(isSpinning) {
  if (!refreshIcon) return;
  if (isSpinning) {
    refreshIcon.classList.add("spinning");
  } else {
    refreshIcon.classList.remove("spinning");
  }
}

function getInitials(name) {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getDomainIcon(domain) {
  switch (domain) {
    case "Java Full Stack": return "☕";
    case "Data Analytics": return "📊";
    case "Python": return "🐍";
    case "Cloud": return "☁️";
    case "UI/UX": return "🎨";
    case "AI & Machine Learning": return "🤖";
    default: return "💻";
  }
}

function formatDate(dateString) {
  if (!dateString) return "Just now";
  return dateString;
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
