/* =========================================
   ANALYTICS PAGE SCRIPT
   Sidebar toggle, logout and notifications are
   handled by common.js. This file only covers
   the charts and the filter bar on this page.
========================================= */

/* ---------- CHART DEFAULTS ---------- */

Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.font.size = 10;
Chart.defaults.color = "#718096";

/* ---------- STATUS CHART ---------- */

new Chart(document.getElementById("statusChart"), {
  type: "doughnut",
  data: {
    labels: ["Completed", "In Progress", "Delayed", "Pending"],
    datasets: [{
      data: [8921, 3002, 527, 292],
      backgroundColor: ["#15966a", "#287be5", "#e3483f", "#e69a17"],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 17, font: { size: 9 } }
      }
    }
  }
});

/* ---------- COMPLETION TREND ---------- */

new Chart(document.getElementById("completionChart"), {
  type: "line",
  data: {
    labels: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
    datasets: [{
      label: "Completed Projects",
      data: [420, 515, 580, 625, 710, 765, 820, 890, 940, 1010, 1085, 1160],
      borderColor: "#287be5",
      backgroundColor: "rgba(40,123,229,0.08)",
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#edf2f7" } },
      x: { grid: { display: false } }
    }
  }
});

/* ---------- FUND CHART ---------- */

new Chart(document.getElementById("fundChart"), {
  type: "bar",
  data: {
    labels: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
    datasets: [
      {
        label: "Funds Released",
        data: [420, 450, 470, 490, 510, 530, 550, 570, 590, 610, 630, 650],
        backgroundColor: "#b9d8fa",
        borderRadius: 5
      },
      {
        label: "Expenditure",
        data: [310, 350, 365, 390, 410, 425, 450, 465, 490, 515, 535, 560],
        backgroundColor: "#287be5",
        borderRadius: 5
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 15, font: { size: 9 } }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#edf2f7" } },
      x: { grid: { display: false } }
    }
  }
});

/* ---------- STATE UTILIZATION ---------- */

new Chart(document.getElementById("stateChart"), {
  type: "doughnut",
  data: {
    labels: ["Gujarat", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Rajasthan", "Bihar"],
    datasets: [{
      data: [86.2, 84.7, 82.4, 74.1, 69.8, 67.5],
      backgroundColor: ["#287be5", "#15966a", "#7c5bd6", "#e69a17", "#e3483f", "#64748b"],
      borderWidth: 0,
      hoverOffset: 7
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "66%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 12, font: { size: 8 } }
      }
    }
  }
});

/* ---------- RISK CHART ---------- */

new Chart(document.getElementById("riskChart"), {
  type: "doughnut",
  data: {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [{
      data: [61.8, 25.5, 12.7],
      backgroundColor: ["#15966a", "#e69a17", "#e3483f"],
      borderWidth: 0,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "67%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 17, font: { size: 9 } }
      }
    }
  }
});

/* ---------- ANOMALY CHART ---------- */

new Chart(document.getElementById("anomalyChart"), {
  type: "bar",
  data: {
    labels: ["Delayed Progress", "Cost Overrun", "Expenditure Deviation", "Duplicate Work", "Unusual Payment"],
    datasets: [{
      label: "Detected",
      data: [214, 128, 165, 74, 92],
      backgroundColor: "#287be5",
      borderRadius: 5
    }]
  },
  options: {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: "#edf2f7" } },
      y: { grid: { display: false } }
    }
  }
});

/* ---------- AI RISK TREND ---------- */

new Chart(document.getElementById("aiRiskChart"), {
  type: "line",
  data: {
    labels: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
    datasets: [{
      label: "High Risk Projects",
      data: [8.5, 9.1, 9.7, 10.2, 10.8, 11.1, 11.8, 12.0, 12.4, 12.1, 12.5, 12.7],
      borderColor: "#e3483f",
      backgroundColor: "rgba(227,72,63,0.06)",
      borderWidth: 2,
      pointRadius: 3,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 15, font: { size: 9 } }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#edf2f7" },
        title: { display: true, text: "High-Risk Percentage", font: { size: 9 } }
      },
      x: { grid: { display: false } }
    }
  }
});

/* ---------- FILTER BAR ---------- */

const searchInput = document.getElementById("searchInput");
const stateFilter = document.getElementById("stateFilter");
const yearFilter = document.getElementById("yearFilter");
const riskFilter = document.getElementById("riskFilter");

function applyFilters() {
  const filters = {
    search: searchInput.value,
    state: stateFilter.value,
    year: yearFilter.value,
    risk: riskFilter.value
  };

  /* Backend/API integration can later replace this demo filtering logic. */

  if (filters.state !== "all") {
    alert("Showing analytics for " + filters.state);
  }
}

stateFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("change", applyFilters);
riskFilter.addEventListener("change", applyFilters);

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") applyFilters();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  searchInput.value = "";
  stateFilter.value = "all";
  yearFilter.value = "2026–27";
  riskFilter.value = "all";
});