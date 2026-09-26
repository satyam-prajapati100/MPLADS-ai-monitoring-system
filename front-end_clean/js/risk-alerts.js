/* =========================================
   MPLADS — RISK ALERTS PAGE SCRIPT
   Connected to the live FastAPI risk-detection backend.

   The API only exposes GET /analyze/{work_id} — there's no
   bulk "list all risky works" endpoint yet. So this page
   loops over a known list of work IDs (WORK_IDS below) and
   calls /analyze/{work_id} for each one. Add more real work
   IDs to that array as you get them.
========================================= */

/* Add every work ID you want checked here. */
const WORK_IDS = [
  "WS/MP18036/2026-2027/300076",
  "WS/MP620/2024-2025/133166",
  "WS/MP418/2024-2025/133409",
  "WS/MP18263/2025-2026/173840"
];
/* Best-effort state name from the code embedded in a work ID
   (e.g. "WS/MP18036/..." -> "MP" -> "Madhya Pradesh").
   Falls back to the raw code if it isn't in this list. */
const STATE_CODE_MAP = {
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  UP: "Uttar Pradesh",
  RJ: "Rajasthan",
  GJ: "Gujarat",
  BR: "Bihar"
};

/* Reason/engine type -> human-readable risk type label. */
const RISK_TYPE_LABELS = {
  cost_anomaly: "Cost Anomaly",
  compliance_rule: "Compliance Issue",
  duplicate_pattern: "Duplicate Pattern",
  delay: "Project Delay",
  missing_expenditure: "Expenditure Pattern",
  duplicate_candidate: "Duplicate Pattern"
};

const REVIEWED_STORAGE_KEY = "mpladsReviewedWorkIds";


document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  bindPageActions();
  loadRiskAlerts();

  if (WORK_IDS.length) {
    loadRiskAssessment(WORK_IDS[0]);
  }
});


/* =========================================
   VARIABLES
========================================= */

let searchInput;
let stateFilter;
let riskFilter;
let alertTable;
let alertCount;

let allAlerts = [];


/* =========================================
   INITIALIZE FILTERS
========================================= */

function initFilters() {

  searchInput = document.getElementById("searchInput");
  stateFilter = document.getElementById("stateFilter");
  riskFilter = document.getElementById("riskFilter");

  alertTable = document.getElementById("alertTable");
  alertCount = document.querySelector(".alert-count");

  if (!searchInput || !stateFilter || !riskFilter) return;

  searchInput.addEventListener("input", filterAlerts);
  stateFilter.addEventListener("change", filterAlerts);
  riskFilter.addEventListener("change", filterAlerts);
}


/* =========================================
   NORMALIZE ONE /analyze/{work_id} RESPONSE
   into the shape the rest of this page expects.
========================================= */

function normalizeAnalysis(raw) {

  const workId = raw.work_id;
  const finalRisk = raw.final_risk || {};
  const riskReasons = raw.risk_reasons || {};
  const reasons = riskReasons.reasons || [];

  const topReason = reasons[0];

  const riskType = topReason
    ? (RISK_TYPE_LABELS[topReason.type] || RISK_TYPE_LABELS[topReason.engine] || "Pattern Anomaly")
    : "Pattern Anomaly";

  const stateCode = (workId.match(/\/([A-Z]{2})\d+\//) || [])[1];
  const state = stateCode ? (STATE_CODE_MAP[stateCode] || stateCode) : "—";

  return {
    workId,
    projectId: workId,
    projectName: workId,
    state,
    district: "—",
    riskScore: Math.round((finalRisk.final_risk_score || 0) * 10) / 10,
    riskLevel: finalRisk.risk_level || "LOW",
    riskType,
    summary: riskReasons.summary || "No summary available.",
    reasons
  };
}


/* =========================================
   LOAD ALERTS — loop over WORK_IDS
========================================= */

async function loadRiskAlerts() {

  showLoading();

  const settled = await Promise.allSettled(
    WORK_IDS.map((id) => apiRequest(`/analyze/${encodeURIComponent(id)}`))
  );

  const results = [];

  settled.forEach((outcome, index) => {

    if (outcome.status === "fulfilled" && outcome.value && outcome.value.success) {
      results.push(normalizeAnalysis(outcome.value));
    } else {
      console.error("Risk Alerts API Error for", WORK_IDS[index], outcome.reason);
    }

  });

  allAlerts = results;

  updateSummary(allAlerts);
  renderAlerts(allAlerts);
}


/* =========================================
   SUMMARY CARDS
========================================= */

function updateSummary(alerts) {

  const reviewed = getReviewedIds();

  const high = alerts.filter((a) => a.riskLevel === "HIGH").length;
  const critical = alerts.filter((a) => a.riskLevel === "CRITICAL").length;
  const medium = alerts.filter((a) => a.riskLevel === "MEDIUM").length;

  setText("totalHighRiskAlerts", (high + critical).toLocaleString("en-IN"));
  setText("criticalRisk", critical.toLocaleString("en-IN"));
  setText("mediumRisk", medium.toLocaleString("en-IN"));
  setText("alertsReviewed", reviewed.length.toLocaleString("en-IN"));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}


/* =========================================
   RENDER ALERTS
========================================= */

function renderAlerts(alerts) {

  if (!alertTable) return;

  alertTable.innerHTML = "";

  if (alerts.length === 0) {

    alertTable.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <i class="fa-solid fa-folder-open"></i>
          <span>No risk alerts found</span>
        </td>
      </tr>
    `;

    updateAlertCount(0);

    return;
  }

  alerts.forEach((alert) => {

    const row = document.createElement("tr");

    row.innerHTML = `

      <td>
        <div class="project-name">${alert.projectName}</div>
      </td>

      <td>${alert.state}</td>

      <td>${alert.riskType}</td>

      <td>${getRiskScoreHTML(alert.riskScore)}</td>

      <td>${getRiskLevelHTML(alert.riskLevel)}</td>

      <td>Recently detected</td>

      <td>
        <button class="review-btn" data-work-id="${alert.workId}">
          Review
        </button>
      </td>

    `;

    alertTable.appendChild(row);

  });

  updateAlertCount(alerts.length);

  bindReviewButtons();
}


/* =========================================
   RISK SCORE / LEVEL BADGES
========================================= */

function getRiskScoreHTML(score) {

  let className = "score-medium";

  if (score >= 80) className = "score-high";
  else if (score < 50) className = "score-low";

  return `
    <span class="risk-score ${className}">
      ${score} / 100
    </span>
  `;
}

function getRiskLevelHTML(level) {

  let className = "risk-normal";

  if (level === "HIGH" || level === "CRITICAL") className = "risk-high";
  else if (level === "MEDIUM") className = "risk-medium";

  return `
    <span class="risk-badge ${className}">
      <i class="fa-solid fa-circle"></i>
      ${level.charAt(0) + level.slice(1).toLowerCase()} Risk
    </span>
  `;
}


/* =========================================
   FILTER ALERTS
========================================= */

function filterAlerts() {

  const search = searchInput.value.trim().toLowerCase();
  const state = stateFilter.value.trim().toLowerCase();
  const risk = riskFilter.value.trim().toLowerCase();

  const filteredAlerts = allAlerts.filter((alert) => {

    const matchesSearch =
      !search || alert.workId.toLowerCase().includes(search);

    const matchesState =
      !state || alert.state.toLowerCase() === state;

    const matchesRisk =
      !risk || alert.riskLevel.toLowerCase() === risk;

    return matchesSearch && matchesState && matchesRisk;
  });

  renderAlerts(filteredAlerts);
}


/* =========================================
   RESET FILTERS
========================================= */

function resetFilters() {

  searchInput.value = "";
  stateFilter.value = "";
  riskFilter.value = "";

  renderAlerts(allAlerts);
}


/* =========================================
   PAGE ACTIONS
========================================= */

function bindPageActions() {

  const resetBtn = document.getElementById("resetFiltersBtn");

  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }
}


/* =========================================
   REVIEW BUTTONS
========================================= */

function bindReviewButtons() {

  document.querySelectorAll(".review-btn[data-work-id]").forEach((btn) => {

    btn.addEventListener("click", () => {
      markReviewed(btn.dataset.workId);
      loadRiskAssessment(btn.dataset.workId);

      document.querySelector(".ai-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

  });
}


/* =========================================
   REVIEWED TRACKING (localStorage — the API
   has no "reviewed" concept of its own)
========================================= */

function getReviewedIds() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWED_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function markReviewed(workId) {
  const reviewed = new Set(getReviewedIds());
  reviewed.add(workId);
  localStorage.setItem(REVIEWED_STORAGE_KEY, JSON.stringify([...reviewed]));
  setText("alertsReviewed", reviewed.size.toLocaleString("en-IN"));
}


/* =========================================
   ALERT COUNT
========================================= */

function updateAlertCount(count) {

  if (!alertCount) return;

  alertCount.innerText = `${count} ALERT${count === 1 ? "" : "S"} SHOWN`;
}


/* =========================================
   LOADING / ERROR STATES
========================================= */

function showLoading() {

  if (!alertTable) return;

  alertTable.innerHTML = `
    <tr>
      <td colspan="7" class="empty-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Loading risk alerts...</span>
      </td>
    </tr>
  `;

  if (alertCount) alertCount.innerText = "LOADING...";
}


/* =========================================
   SINGLE-PROJECT AI RISK ASSESSMENT
========================================= */

async function loadRiskAssessment(workId) {

  try {

    const result = await apiRequest(`/analyze/${encodeURIComponent(workId)}`);

    if (!result.success) {
      throw new Error("Failed to load risk assessment");
    }

    const alert = normalizeAnalysis(result);

    setText("aiRiskScore", alert.riskScore);
    setText("aiRiskLevel", `${alert.riskLevel.charAt(0) + alert.riskLevel.slice(1).toLowerCase()} Risk Project`);
    setText("aiProjectName", alert.projectName);
    setText("aiProjectId", alert.workId);
    setText("aiRecommendedAction", alert.summary);

    updateRiskCircle(alert.riskScore);

  } catch (error) {

    console.error("Risk Assessment Error:", error);

    setText("aiRiskScore", "--");
    setText("aiRiskLevel", "Assessment unavailable");
    setText("aiProjectName", "Unable to load project");
    setText("aiProjectId", "");
    setText("aiRecommendedAction", "Unable to load risk assessment. Please make sure the FastAPI server is running.");
  }
}

function updateRiskCircle(score) {

  const circle = document.getElementById("scoreCircle");

  if (!circle) return;

  const degrees = (score / 100) * 360;

  circle.style.background = `conic-gradient(var(--danger) ${degrees}deg, #edf1f6 ${degrees}deg)`;
}