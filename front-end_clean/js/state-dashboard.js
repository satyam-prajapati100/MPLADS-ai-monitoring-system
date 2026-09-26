/* =========================================
   MPLADS — STATE DASHBOARD SCRIPT

   Page-specific JavaScript only.

   Common functionality is handled by:
   js/common.js
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initCounters();

        initFundChart();

        initRiskChart();

        initNavigation();

    }
);


/* =========================================
   KPI COUNTERS
========================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(
            ".kpi-value"
        );


    counters.forEach(counter => {

        const target =
            Number(
                counter.dataset.count
            );

        let current = 0;

        const duration = 1000;

        const start =
            performance.now();


        function animate(time) {

            const progress =
                Math.min(
                    (time - start) / duration,
                    1
                );


            current =
                Math.floor(
                    target * progress
                );


            counter.textContent =
                current.toLocaleString();


            if(progress < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                counter.textContent =
                    target.toLocaleString();

            }

        }


        requestAnimationFrame(
            animate
        );

    });

}


/* =========================================
   FUND UTILIZATION CHART
========================================= */

function initFundChart() {

    const canvas =
        document.getElementById(
            "fundChart"
        );


    if(!canvas) return;


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels: [
                    "Oct",
                    "Nov",
                    "Dec",
                    "Jan",
                    "Feb",
                    "Mar"
                ],

                datasets: [

                    {

                        label:
                            "Fund Utilization",

                        data: [
                            67,
                            71,
                            73,
                            76,
                            81,
                            78
                        ],

                        borderColor:
                            "#1769d2",

                        backgroundColor:
                            "rgba(23,105,210,0.10)",

                        borderWidth: 2,

                        fill: true,

                        tension: 0.4,

                        pointRadius: 3,

                        pointHoverRadius: 5

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },


                scales: {

                    y: {

                        min: 50,

                        max: 100,

                        ticks: {

                            font: {
                                size: 9
                            },

                            callback:
                                function(value) {

                                    return value + "%";

                                }

                        },

                        grid: {

                            color:
                                "#edf2f7"

                        }

                    },


                    x: {

                        ticks: {

                            font: {
                                size: 9
                            }

                        },

                        grid: {
                            display: false
                        }

                    }

                }

            }

        }
    );

}


/* =========================================
   RISK CHART
========================================= */

function initRiskChart() {

    const canvas =
        document.getElementById(
            "riskChart"
        );


    if(!canvas) return;


    new Chart(
        canvas,
        {

            type: "doughnut",

            data: {

                labels: [
                    "High Risk",
                    "Medium Risk",
                    "Low Risk"
                ],

                datasets: [

                    {

                        data: [
                            69,
                            143,
                            367
                        ],

                        backgroundColor: [
                            "#d92d20",
                            "#d98200",
                            "#16845b"
                        ],

                        borderWidth: 0

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "70%",

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        }
    );

}


/* =========================================
   NAVIGATION
========================================= */

function initNavigation() {

    const districtsBtn =
        document.getElementById(
            "districtsBtn"
        );


    const viewAllDistrictsBtn =
        document.getElementById(
            "viewAllDistrictsBtn"
        );


    const riskBtn =
        document.getElementById(
            "riskBtn"
        );


    const aiBtn =
        document.getElementById(
            "aiBtn"
        );


    const projectsBtn =
        document.getElementById(
            "projectsBtn"
        );


    if(districtsBtn) {

        districtsBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "projects.html";

            }
        );

    }


    if(viewAllDistrictsBtn) {

        viewAllDistrictsBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "projects.html";

            }
        );

    }


    if(riskBtn) {

        riskBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "risk-alerts.html";

            }
        );

    }


    if(aiBtn) {

        aiBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "ai-insights.html";

            }
        );

    }


    if(projectsBtn) {

        projectsBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "projects.html";

            }
        );

    }


    /* =====================================
       DISTRICT ACTION BUTTONS
    ====================================== */

    document
        .querySelectorAll(
            ".table-action[data-district]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const district =
                        button.dataset.district;


                    window.location.href =
                        "projects.html?district=" +
                        encodeURIComponent(
                            district
                        );

                }
            );

        });


    /* =====================================
       PROJECT ACTION BUTTONS
    ====================================== */

    document
        .querySelectorAll(
            ".project-view"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const projectId =
                        button.dataset.project;


                    window.location.href =
                        "project-details.html?id=" +
                        encodeURIComponent(
                            projectId
                        );

                }
            );

        });

}