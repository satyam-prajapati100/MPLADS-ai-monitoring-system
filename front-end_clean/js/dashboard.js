/* =========================================
   MPLADS — CENTRAL OFFICER DASHBOARD
   Connected to Demo FastAPI Backend
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadCentralDashboard();

    bindPageActions();
    
    initIndiaMap();

});


/* =========================================
   LOAD CENTRAL DASHBOARD DATA
========================================= */

async function loadCentralDashboard() {

    try {

        console.log("Loading Central Officer dashboard...");

        const result = await apiRequest(
            "/api/dashboard/central"
        );

        console.log("Dashboard API response:", result);

        if (!result.success) {
            throw new Error("Dashboard data could not be loaded");
        }

        const data = result.data;

        /*
         * Update KPI cards
         */

        animateValue(
            "totalProjects",
            data.totalProjects
        );

        animateValue(
            "highRiskProjects",
            data.highRiskProjects
        );

        animateValue(
            "delayedProjects",
            data.delayedProjects
        );

        animatePercentage(
            "fundUtilization",
            data.fundUtilization
        );


    } catch (error) {

        console.error(
            "Failed to load Central Dashboard:",
            error
        );

        showDashboardError();

    }

}


/* =========================================
   NUMBER ANIMATION
========================================= */

function animateValue(elementId, target) {

    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(
            `Element #${elementId} not found`
        );

        return;
    }

    target = Number(target);

    let current = 0;

    const duration = 1000;

    const startTime = performance.now();


    function update(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        current = Math.floor(
            progress * target
        );

        element.textContent =
            current.toLocaleString("en-IN");


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString("en-IN");

        }

    }


    requestAnimationFrame(update);

}


/* =========================================
   PERCENTAGE ANIMATION
========================================= */

function animatePercentage(elementId, target) {

    const element = document.getElementById(elementId);

    if (!element) return;

    target = Number(target);

    let current = 0;

    const duration = 1000;

    const startTime = performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        current =
            progress * target;

        element.textContent =
            current.toFixed(1) + "%";


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toFixed(1) + "%";

        }

    }


    requestAnimationFrame(update);

}


/* =========================================
   DASHBOARD ERROR
========================================= */

// function showDashboardError() {

//     const elements = [
//         "totalProjects",
//         "highRiskProjects",
//         "delayedProjects",
//         "fundUtilization"
//     ];

//     elements.forEach((id) => {

//         const element =
//             document.getElementById(id);

//         if (element) {

//             element.textContent = "500";

//         }

//     });

// }


/* =========================================
   PAGE BUTTON ACTIONS
========================================= */

function bindPageActions() {

    const bind = (id, handler) => {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "click",
                handler
            );

        }

    };


    bind(
        "viewMapBtn",
        viewMap
    );

    bind(
        "viewAIInsightsBtn",
        viewAIInsights
    );

    bind(
        "viewAllAlertsBtn",
        viewAllAlerts
    );

    bind(
        "statePerformanceBtn",
        statePerformance
    );


    document
        .querySelectorAll(
            ".review-btn[data-project-id]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    reviewProject(
                        button.dataset.projectId
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".quick-action[data-action]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    quickAction(
                        button.dataset.action
                    );

                }
            );

        });

}


/* =========================================
   BUTTON FUNCTIONS
========================================= */

function viewMap() {

    alert(
        "National Monitoring Map\n\n" +
        "Detailed state-level risk visualization " +
        "will open here."
    );

}


function viewAIInsights() {

    alert(
        "AI Monitoring Insights\n\n" +
        "Detailed anomaly detection, risk scoring " +
        "and predictive insights will open here."
    );

}


function viewAllAlerts() {

    window.location.href =
        "risk-alerts.html";

}


function reviewProject(projectId) {

    alert(
        "Opening Project Review\n\n" +
        "Project ID: " +
        projectId
    );

}


function statePerformance() {

    alert(
        "State Performance\n\n" +
        "Detailed state comparison will open here."
    );

}


function quickAction(action) {

    const routes = {

        risk: "risk-alerts.html",

        projects: "Projects.html",

        report: "reports.html",

        analytics: "analytics.html"

    };


    if (routes[action]) {

        window.location.href =
            routes[action];

    }

}


/* =========================================
   REAL INDIA MAP
========================================= */

function initIndiaMap() {

    const mapElement = document.getElementById("indiaMap");

    if (!mapElement) return;

    const map = L.map("indiaMap", {
        zoomControl: true,
        scrollWheelZoom: false
    });

    /*
     * India center
     */
    map.setView([22.5, 79,], 4.8);

    /*
     * OpenStreetMap
     */
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

}