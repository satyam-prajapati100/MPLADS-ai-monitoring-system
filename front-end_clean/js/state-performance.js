/* =========================================
   NIRIKSHAK — STATE PERFORMANCE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initStatePerformance();

});


function initStatePerformance() {

    animateCounters();

    animateRiskBars();

    createPerformanceChart();

}


/* =========================================
   KPI COUNTERS
========================================= */

function animateCounters() {

    const counters =
        document.querySelectorAll(".counter");


    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        let current = 0;

        const increment =
            target / 60;


        function update() {

            current += increment;


            if (current < target) {

                counter.textContent =
                    Math.floor(current)
                    .toLocaleString("en-IN");

                requestAnimationFrame(update);

            } else {

                counter.textContent =
                    target.toLocaleString("en-IN");

            }

        }


        update();

    });

}


/* =========================================
   RISK BAR ANIMATION
========================================= */

function animateRiskBars() {

    const bars =
        document.querySelectorAll(".risk-progress-bar");


    bars.forEach(bar => {

        const width =
            bar.dataset.width;


        setTimeout(() => {

            bar.style.width =
                width + "%";

        }, 300);

    });

}


/* =========================================
   PERFORMANCE TREND CHART
========================================= */

function createPerformanceChart() {

    const canvas =
        document.getElementById(
            "performanceTrendChart"
        );


    if (!canvas) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
                "Jan",
                "Feb",
                "Mar"
            ],

            datasets: [

                {
                    label: "Fund Utilization",

                    data: [
                        55,
                        57,
                        63,
                        65,
                        69,
                        67,
                        70,
                        72,
                        75,
                        73,
                        76,
                        78
                    ],

                    borderWidth: 2,

                    tension: 0.4,

                    pointRadius: 3,

                    fill: false
                },


                {
                    label: "Projects Completed",

                    data: [
                        40,
                        38,
                        43,
                        47,
                        49,
                        48,
                        50,
                        55,
                        57,
                        59,
                        61,
                        64
                    ],

                    borderWidth: 2,

                    tension: 0.4,

                    pointRadius: 3,

                    fill: false
                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },


            plugins: {

                legend: {

                    position: "top",

                    align: "end",

                    labels: {

                        usePointStyle: true,

                        boxWidth: 8,

                        padding: 12

                    }

                }

            },


            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    ticks: {

                        stepSize: 25

                    },

                    grid: {

                        color:
                            "rgba(20, 50, 90, 0.06)"

                    }

                },


                x: {

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}


/* =========================================
   STATE VIEW
========================================= */

function viewState(stateName) {

    alert(
        "State Performance\n\n" +
        "Selected State: " +
        stateName +
        "\n\nDetailed state-level analysis will open here."
    );

}