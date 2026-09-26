// /* =========================================
//    MPLADS — PROJECTS PAGE SCRIPT
//    Connected to Demo FastAPI Backend
// ========================================= */

// document.addEventListener("DOMContentLoaded", () => {
//   initFilters();
//   bindPageActions();
//   loadProjects();
// });

// /* =========================================
//    VARIABLES
// ========================================= */

// let searchInput;
// let stateFilter;
// let statusFilter;
// let riskFilter;
// let districtFilter;

// let projectTable;
// let projectCount;

// let allProjects = [];


// /* =========================================
//    FILTER INITIALIZATION
// ========================================= */

// function initFilters() {

//   searchInput = document.getElementById("searchInput");
//   stateFilter = document.getElementById("stateFilter");
//   statusFilter = document.getElementById("statusFilter");
//   riskFilter = document.getElementById("riskFilter");
//   districtFilter = document.getElementById("districtFilter");

//   projectTable = document.getElementById("projectTable");
//   projectCount = document.getElementById("projectCount");

//   if (!projectTable) return;

//   searchInput.addEventListener("input", filterProjects);
//   stateFilter.addEventListener("change", filterProjects);
//   statusFilter.addEventListener("change", filterProjects);
//   riskFilter.addEventListener("change", filterProjects);
//   districtFilter.addEventListener("input", filterProjects);
// }


// /* =========================================
//    LOAD PROJECTS FROM FASTAPI
// ========================================= */

// async function loadProjects() {

//   try {

//     showLoading();

//     const result = await apiRequest("/api/projects");

//     if (!result.success) {
//       throw new Error("Unable to load projects");
//     }

//     allProjects = result.data || [];

//     renderProjects(allProjects);

//   } catch (error) {

//     console.error("Projects API Error:", error);

//     showError();

//   }
// }


// /* =========================================
//    RENDER PROJECTS
// ========================================= */

// function renderProjects(projects) {

//   if (!projectTable) return;

//   projectTable.innerHTML = "";

//   if (projects.length === 0) {

//     projectTable.innerHTML = `
//       <tr>
//         <td colspan="7" class="empty-state">
//           <i class="fa-solid fa-folder-open"></i>
//           <span>No projects found</span>
//         </td>
//       </tr>
//     `;

//     projectCount.innerText = "0 PROJECTS";

//     return;
//   }


//   projects.forEach((project) => {

//     const row = document.createElement("tr");

//     row.innerHTML = `
//       <td>
//         <div class="project-name">
//           ${project.projectName}
//         </div>

//         <div class="project-id">
//           ${project.projectId}
//         </div>
//       </td>


//       <td>
//         ${project.district}, ${project.state}
//       </td>


//       <td>
//         ${getStatusHTML(project.status)}
//       </td>


//       <td>

//         <div class="progress-container">

//           <div class="progress-text">
//             <span>${project.progress}%</span>
//           </div>

//           <div class="progress">

//             <div
//               class="progress-bar"
//               style="width:${project.progress}%">
//             </div>

//           </div>

//         </div>

//       </td>


//       <td>
//         ₹ ${(project.expenditure / 100000).toFixed(1)} L
//       </td>


//       <td>
//         ${getRiskHTML(project.riskLevel)}
//       </td>


//       <td>

//         <button
//           class="view-btn"
//           data-project-id="${project.projectId}">

//           View

//         </button>

//       </td>
//     `;

//     projectTable.appendChild(row);

//   });


//   projectCount.innerText =
//     `${projects.length} PROJECTS`;

//   bindViewButtons();

// }


// /* =========================================
//    STATUS HTML
// ========================================= */

// function getStatusHTML(status) {

//   const statusMap = {

//     "Completed": {
//       className: "status-completed",
//       icon: "fa-circle-check"
//     },

//     "In Progress": {
//       className: "status-progress",
//       icon: "fa-spinner"
//     },

//     "Delayed": {
//       className: "status-delayed",
//       icon: "fa-clock"
//     },

//     "Pending": {
//       className: "status-pending",
//       icon: "fa-hourglass-half"
//     }

//   };


//   const config = statusMap[status] || {
//     className: "status-progress",
//     icon: "fa-circle"
//   };


//   return `
//     <span class="status ${config.className}">
//       <i class="fa-solid ${config.icon}"></i>
//       ${status}
//     </span>
//   `;
// }


// /* =========================================
//    RISK HTML
// ========================================= */

// function getRiskHTML(risk) {

//   const riskMap = {

//     "High": "risk-high",
//     "Medium": "risk-medium",
//     "Low": "risk-low"

//   };


//   const className =
//     riskMap[risk] || "risk-medium";


//   return `
//     <span class="risk ${className}">
//       <i class="fa-solid fa-circle"></i>
//       ${risk}
//     </span>
//   `;
// }


// /* =========================================
//    FILTER PROJECTS
// ========================================= */

// function filterProjects() {

//   const search =
//     searchInput.value.trim().toLowerCase();

//   const state =
//     stateFilter.value.trim().toLowerCase();

//   const status =
//     statusFilter.value.trim().toLowerCase();

//   const risk =
//     riskFilter.value.trim().toLowerCase();

//   const district =
//     districtFilter.value.trim().toLowerCase();


//   const filteredProjects = allProjects.filter((project) => {

//     const matchesSearch =
//       !search ||
//       project.projectName.toLowerCase().includes(search) ||
//       project.projectId.toLowerCase().includes(search);


//     const matchesState =
//       !state ||
//       project.state.toLowerCase() === state;


//     const matchesStatus =
//       !status ||
//       project.status.toLowerCase() === status;


//     const matchesRisk =
//       !risk ||
//       project.riskLevel.toLowerCase() === risk;


//     const matchesDistrict =
//       !district ||
//       project.district.toLowerCase().includes(district);


//     return (
//       matchesSearch &&
//       matchesState &&
//       matchesStatus &&
//       matchesRisk &&
//       matchesDistrict
//     );

//   });


//   renderProjects(filteredProjects);

// }


// /* =========================================
//    RESET FILTERS
// ========================================= */

// function resetFilters() {

//   searchInput.value = "";
//   stateFilter.value = "";
//   statusFilter.value = "";
//   riskFilter.value = "";
//   districtFilter.value = "";

//   renderProjects(allProjects);
// }


// /* =========================================
//    PAGE BUTTONS
// ========================================= */

// function bindPageActions() {

//   const resetBtn =
//     document.getElementById("resetFiltersBtn");

//   if (resetBtn) {

//     resetBtn.addEventListener(
//       "click",
//       resetFilters
//     );

//   }

// }


// /* =========================================
//    VIEW PROJECT BUTTONS
// ========================================= */

// function bindViewButtons() {

//   document
//     .querySelectorAll(".view-btn[data-project-id]")
//     .forEach((btn) => {

//       btn.addEventListener("click", () => {

//         viewProject(
//           btn.dataset.projectId
//         );

//       });

//     });

// }


// /* =========================================
//    VIEW PROJECT
// ========================================= */

// function viewProject(projectId) {

//   window.location.href =
//     "project-details.html?id=" +
//     encodeURIComponent(projectId);

// }


// /* =========================================
//    LOADING STATE
// ========================================= */

// function showLoading() {

//   if (!projectTable) return;

//   projectTable.innerHTML = `
//     <tr>
//       <td colspan="7" class="empty-state">
//         <i class="fa-solid fa-spinner fa-spin"></i>
//         <span>Loading projects...</span>
//       </td>
//     </tr>
//   `;

//   projectCount.innerText =
//     "LOADING...";
// }


// /* =========================================
//    ERROR STATE
// ========================================= */

// function showError() {

//   if (!projectTable) return;

//   projectTable.innerHTML = `
//     <tr>
//       <td colspan="7" class="empty-state">
//         <i class="fa-solid fa-circle-exclamation"></i>
//         <span>
//           Unable to load projects.
//           Please make sure the FastAPI server is running.
//         </span>
//       </td>
//     </tr>
//   `;

//   projectCount.innerText =
//     "ERROR";
// }



/* =========================================
   MPLADS — PROJECTS PAGE SCRIPT
   Loaded after common.js AND supabase-client.js.
   Fetches real rows from Supabase, renders the
   table, wires the filter bar to server-side
   queries, and runs a live risk check (via
   FastAPI) for each row currently on screen.
========================================= */

const PAGE_SIZE = 25;
let currentOffset = 0;
let currentFilters = { search: "", state: "", status: "", district: "" };

let searchInput, stateFilter, statusFilter, districtFilter;
let projectTableBody, projectCountEl, loadMoreBtn;

document.addEventListener("DOMContentLoaded", () => {
  cacheEls();
  populateFilterOptions();
  loadProjects({ reset: true });
  bindFilterEvents();
  bindPageActions();
});

function cacheEls() {
  searchInput = document.getElementById("searchInput");
  stateFilter = document.getElementById("stateFilter");
  statusFilter = document.getElementById("statusFilter");
  districtFilter = document.getElementById("districtFilter");
  projectTableBody = document.getElementById("projectTable");
  projectCountEl = document.getElementById("projectCount");
  loadMoreBtn = document.getElementById("loadMoreBtn");
}

/* State/Status dropdown options are populated from the real
   distinct values in the database, not hardcoded — the original
   mock list (Madhya Pradesh/Maharashtra/...) didn't match the
   actual states in works_sanctioned. */
async function populateFilterOptions() {
  const [states, statuses] = await Promise.all([fetchDistinctStates(), fetchDistinctStatuses()]);

  stateFilter.innerHTML =
    '<option value="">All States</option>' +
    states.map((s) => `<option value="${s}">${s}</option>`).join("");

  statusFilter.innerHTML =
    '<option value="">All Status</option>' +
    statuses.map((s) => `<option value="${s}">${s}</option>`).join("");
}

async function loadProjects({ reset = false } = {}) {
  if (reset) {
    currentOffset = 0;
    projectTableBody.innerHTML = loadingRow("Loading projects…");
  }

  const { rows, count } = await fetchProjects({
    ...currentFilters,
    limit: PAGE_SIZE,
    offset: currentOffset,
  });

  if (reset) {
    projectTableBody.innerHTML = rows.length === 0 ? loadingRow("No projects match these filters.") : "";
  }

  rows.forEach(renderProjectRow);

  currentOffset += rows.length;
  projectCountEl.innerText = count + " PROJECTS";

  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentOffset < count ? "" : "none";
  }
}

function loadingRow(message) {
  return `<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--muted);">${message}</td></tr>`;
}

function renderProjectRow(project) {
  const tr = document.createElement("tr");

  const location = [project.constituency, project.state].filter(Boolean).join(", ") || "—";

  // TODO: re-enable once we confirm the real disbursement column name
  // in works_sanctioned (fund_disbursed_rs doesn't exist there).
  const progressPct = 0;

  tr.innerHTML = `
    <td>
      <div class="project-name">${escapeHtml(project.work_description || project.work || "Untitled Work")}</div>
      <div class="project-id">${escapeHtml(project.work_id)}</div>
    </td>
    <td>${escapeHtml(location)}</td>
    <td>
      <span class="status ${statusToPillClass(project.work_status)}">
        <i class="fa-solid ${statusToIcon(project.work_status)}"></i>
        ${escapeHtml(project.work_status || "Unknown")}
      </span>
    </td>
    <td>
      <div class="progress-container">
        <div class="progress-text"><span>${progressPct}%</span></div>
        <div class="progress"><div class="progress-bar" style="width:${progressPct}%"></div></div>
      </div>
    </td>
    <td>${formatRupeesLakhs(project.sanction_amount_rs)}</td>
    <td class="risk-cell">
      <span class="risk risk-pending"><i class="fa-solid fa-circle-notch fa-spin"></i>Checking…</span>
    </td>
    <td><button class="view-btn" data-project-id="${escapeHtml(project.work_id)}">View</button></td>
  `;

  projectTableBody.appendChild(tr);

  // Live risk check, scoped to this one visible row — /analyze is
  // built for one work_id at a time, not for scoring the whole table.
  loadRiskForRow(project.work_id, tr.querySelector(".risk-cell"));
}

async function loadRiskForRow(workId, cell) {
  const result = await analyzeWork(workId);

  if (!result || !result.final_risk) {
    cell.innerHTML = `<span class="risk risk-pending"><i class="fa-solid fa-circle-question"></i>N/A</span>`;
    return;
  }

  const level = (result.final_risk.risk_level || "LOW").toLowerCase();
  const riskClass = level === "high" ? "risk-high" : level === "medium" ? "risk-medium" : "risk-low";
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  cell.innerHTML = `<span class="risk ${riskClass}"><i class="fa-solid fa-circle"></i>${label}</span>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* =========================================
   FILTERS
   Search/State/Status/District all query Supabase
   directly (server-side), so filtering works across
   the full dataset, not just the current page.
========================================= */

function bindFilterEvents() {
  let debounceTimer;
  const debouncedReload = (applyValue) => {
    applyValue();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => loadProjects({ reset: true }), 350);
  };

  searchInput.addEventListener("input", () =>
    debouncedReload(() => (currentFilters.search = searchInput.value.trim()))
  );

  districtFilter.addEventListener("input", () =>
    debouncedReload(() => (currentFilters.district = districtFilter.value.trim()))
  );

  stateFilter.addEventListener("change", () => {
    currentFilters.state = stateFilter.value;
    loadProjects({ reset: true });
  });

  statusFilter.addEventListener("change", () => {
    currentFilters.status = statusFilter.value;
    loadProjects({ reset: true });
  });

  // Note: the "Risk" filter in the UI isn't wired yet — real risk
  // scores only exist per-row, live from FastAPI, once a row is on
  // screen. Filtering by risk server-side needs risk_results to be
  // populated in Supabase, which it isn't yet.
}

function bindPageActions() {
  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      stateFilter.value = "";
      statusFilter.value = "";
      districtFilter.value = "";
      currentFilters = { search: "", state: "", status: "", district: "" };
      loadProjects({ reset: true });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => loadProjects({ reset: false }));
  }

  // Rows are rendered dynamically, so the View button listener is
  // delegated on the table body rather than bound per-button.
  projectTableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn[data-project-id]");
    if (btn) viewProject(btn.dataset.projectId);
  });
}

function viewProject(projectId) {
  // Later connect this to: project-details.html?id=PROJECT_ID
  window.location.href = "project-details.html?id=" + encodeURIComponent(projectId);
}