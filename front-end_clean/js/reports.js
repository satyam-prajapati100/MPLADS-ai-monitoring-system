/* =========================================
   REPORTS PAGE SCRIPT
   Sidebar toggle, logout, notifications and active
   nav highlighting are handled by common.js. This
   file only covers report-generation behavior.
========================================= */

/* ---------- COUNTER ANIMATION ---------- */

document.querySelectorAll(".stat-value").forEach((counter) => {
  const target = Number(counter.dataset.count);
  let current = 0;

  const duration = 900;
  const step = Math.max(1, Math.ceil(target / (duration / 20)));

  const timer = setInterval(() => {
    current += step;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    counter.textContent = current.toLocaleString();
  }, 20);
});

/* ---------- SELECT REPORT ---------- */

function selectReport(type) {
  document.getElementById("reportType").value = type;

  document.querySelector(".generator").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ---------- GENERATE REPORT ---------- */

function generateReport() {
  const type = document.getElementById("reportType").value;

  if (!type) {
    alert("Please select a Report Type.");
    return;
  }

  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const dateRange = document.getElementById("dateRange").value;
  const status = document.getElementById("projectStatus").value;
  const risk = document.getElementById("riskLevel").value;

  alert(
    "Report generation started.\n\n" +
    "Report: " + type +
    "\nState: " + state +
    "\nDistrict: " + district +
    "\nDate Range: " + dateRange +
    "\nStatus: " + status +
    "\nRisk: " + risk +
    "\n\nThis is a frontend demo. " +
    "Backend/API integration will generate the actual report."
  );
}

/* ---------- VIEW REPORT ---------- */

function viewReport(name) {
  alert(
    "Opening report:\n\n" + name +
    "\n\nReport viewer will be connected to the backend later."
  );
}

/* ---------- DOWNLOAD ---------- */

function downloadReport(name) {
  alert(
    "Preparing download:\n\n" + name +
    "\n\nPDF/Excel generation will be connected to the backend later."
  );
}

/* ---------- DELETE ---------- */

function deleteReport(button) {
  const row = button.closest("tr");
  const name = row.querySelector(".report-name").innerText.trim();

  if (confirm("Delete this report?\n\n" + name)) {
    row.remove();
  }
}

/* ---------- VIEW ALL ---------- */

function viewAllReports() {
  alert("All Reports page will be connected to the reports database later.");
}