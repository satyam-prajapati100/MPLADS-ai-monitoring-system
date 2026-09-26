/* =========================================
   MPLADS — COMMON LAYOUT SCRIPT
   Renders the sidebar, top-bar actions, and footer
   from ONE place, so every page always shares the
   same nav links (no more Admin.html vs
   central-dashboard.html style drift).

   Each page only needs:
     <body data-page="dashboard">   <!-- matches a NAV item's "page" key -->
       <div id="app-shell"></div>
       <header class="topbar">
         <div class="top-left">
           <button class="menu-btn" id="menuBtn"><i class="fa-solid fa-bars"></i></button>
           <div class="page-title"><h1>...</h1><p>...</p></div>
         </div>
         <div id="top-actions-root"></div>
       </header>
       <section class="content">
         ...page content...
         <div id="footer-root"></div>
       </section>
     <script src="common.js"></script>
     <script src="dashboard.js"></script> (or whichever page script)
========================================= */

/* Single source of truth for every nav link. Add a page here once,
   and it's correct and clickable from every page in the app. */
const NAV_SECTIONS = [
  {
    title: "Main Menu",
    items: [
      { page: "dashboard", href: "Admin.html", icon: "fa-solid fa-chart-pie", label: "Dashboard" },
      { page: "risk-alerts", href: "risk-alerts.html", icon: "fa-solid fa-triangle-exclamation", label: "Risk Alerts", badge: 18 },
      { page: "projects", href: "projects.html", icon: "fa-solid fa-building", label: "Projects" },
      { page: "analytics", href: "analytics.html", icon: "fa-solid fa-chart-line", label: "Analytics" },
      { page: "state-performance", href: "state-performance.html", icon: "fa-solid fa-map-location-dot", label: "State Performance" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { page: "Sitellite-Monitoring", href: "site_monitoring.html", icon: "fa-solid fa-satellite", label: "Sitellite-Monitoring" },
      { page: "ai-insights", href: "ai-insights.html", icon: "fa-solid fa-brain", label: "AI Insights" },
      { page: "reports", href: "reports.html", icon: "fa-solid fa-file-lines", label: "Reports" },
      { page: "audit", href: "audit.html", icon: "fa-solid fa-magnifying-glass-chart", label: "Audit & Review" },
    ],
  },
  {
    title: "System",
    items: [
      { page: "settings", href: "settings.html", icon: "fa-solid fa-gear", label: "Settings" },
      { page: "help", href: "help.html", icon: "fa-regular fa-circle-question", label: "Help & Support" },
    ],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  renderAppShell();
  renderTopActions();
  renderFooter();
  initMobileSidebar();
  bindCommonActions();
});

/* =========================================
   SIDEBAR + OVERLAY
========================================= */

function renderAppShell() {
  const root = document.getElementById("app-shell");
  if (!root) return;

  const activePage = document.body.dataset.page || "";

  const sectionsHtml = NAV_SECTIONS.map((section, i) => {
    const titleClass = i === 0 ? "nav-title" : "nav-title spaced";
    const itemsHtml = section.items
      .map((item) => {
        const isActive = item.page === activePage;
        const badgeHtml = item.badge ? `<span class="nav-badge">${item.badge}</span>` : "";
        return `
          <a class="nav-item${isActive ? " active" : ""}" href="${item.href}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
            ${badgeHtml}
          </a>`;
      })
      .join("");

    return `<div class="${titleClass}">${section.title}</div>${itemsHtml}`;
  }).join("");

  root.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="brand">
        <img class="brand-logo" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India Emblem">
        <div class="brand-text">
          <h2>Nirikshak</h2>
          <p>AI Monitoring System</p>
        </div>
      </div>

      <div class="nav-section">
        ${sectionsHtml}
      </div>

      <div class="sidebar-bottom">
        <div class="profile-mini">
          <div class="profile-avatar"><i class="fa-solid fa-user-shield"></i></div>
          <div class="profile-info">
            <strong>Central Officer</strong>
            <span>MoSPI / MPLADS</span>
          </div>
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="overlay"></div>
  `;
}

function initMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  if (!sidebar || !menuBtn || !overlay) return;

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
}

/* =========================================
   TOP-BAR ACTIONS (demo badge, bell, logout)
========================================= */

function renderTopActions() {
  const root = document.getElementById("top-actions-root");
  if (!root) return;

  root.innerHTML = `
    <span class="demo-badge">DEMO DATA</span>
    <button class="icon-btn" id="notificationsBtn" aria-label="Notifications">
      <i class="fa-regular fa-bell"></i>
      <span class="notification-dot"></span>
    </button>
    <button class="icon-btn" id="logoutBtn" aria-label="Logout">
      <i class="fa-solid fa-right-from-bracket"></i>
    </button>
  `;
}

/* =========================================
   FOOTER
========================================= */

function renderFooter() {
  const root = document.getElementById("footer-root");
  if (!root) return;

  root.outerHTML = `
    <div class="footer">
      Ministry of Statistics & Programme Implementation | MPLADS AI Monitoring System
      <br>
      Prototype for Smart India Hackathon 2026
    </div>
  `;
}

/* =========================================
   COMMON BUTTON BINDINGS
========================================= */

function bindCommonActions() {
  const bind = (id, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  };

  bind("notificationsBtn", showNotifications);
  bind("logoutBtn", logout);
}

function showNotifications() {
  alert(
    "Notifications\n\n" +
      "18 high-priority projects require review.\n\n" +
      "27 projects have delay risk."
  );
}

function logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem("mpladsUser");
    window.location.href = "login.html";
  }
}