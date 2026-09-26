/* =========================================
   MPLADS — SITE MONITORING PAGE SCRIPT
   Same slider/zoom logic as the Central Dashboard —
   duplicated here as this page's own file per the
   project's one-js-per-page convention.
   Map markers, timeline and site details below are
   static demo data for now. Once a photo/imagery
   API exists, swap the hardcoded HTML for data
   fetched with apiRequest() from api.js.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  initCompareSlider(document.getElementById("satelliteSlider"));
  initMapZoom();
  bindCompareViewButton();
});


/* =========================================
   SATELLITE BEFORE/AFTER SLIDER
========================================= */

function initCompareSlider(slider) {

  if (!slider) return;

  const overlay = slider.querySelector(".compare-overlay");
  const overlayImg = overlay.querySelector(".compare-img");
  const range = slider.querySelector(".compare-range");

  function syncImageWidth() {
    overlayImg.style.setProperty("--overlay-img-width", slider.offsetWidth + "px");
    overlayImg.style.width = slider.offsetWidth + "px";
  }

  function update(value) {
    overlay.style.width = value + "%";
  }

  range.addEventListener("input", () => update(range.value));
  window.addEventListener("resize", syncImageWidth);

  syncImageWidth();
  update(range.value);
}

function bindCompareViewButton() {

  const btn = document.getElementById("compareViewBtn");
  const range = document.querySelector("#satelliteSlider .compare-range");

  if (!btn || !range) return;

  btn.addEventListener("click", () => {
    range.value = 50;
    range.dispatchEvent(new Event("input"));
  });
}


/* =========================================
   MAP ZOOM (visual only for now)
========================================= */

function initMapZoom() {

  const canvas = document.getElementById("mapCanvas");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");

  if (!canvas || !zoomInBtn || !zoomOutBtn) return;

  let scale = 1;

  const apply = () => {
    canvas.style.transform = `scale(${scale})`;
  };

  zoomInBtn.addEventListener("click", () => {
    scale = Math.min(1.6, scale + 0.15);
    apply();
  });

  zoomOutBtn.addEventListener("click", () => {
    scale = Math.max(1, scale - 0.15);
    apply();
  });
}


function initIndiaMap() {

    const mapElement = document.getElementById("indiaMap");

    if (!mapElement) {
        console.error("India map element not found");
        return;
    }

    const map = L.map("indiaMap", {
        zoomControl: true,
        scrollWheelZoom: false
    });

    // India center
    map.setView([22.5, 79.0], 5);

    // SAME MAP API used in your dashboard
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    // Project locations
    const projects = [
        {
            lat: 26.6333,
            lng: 92.7926,
            name: "Community Health Centre",
            location: "Tezpur, Assam",
            status: "Verified Match"
        },
        {
            lat: 23.2599,
            lng: 77.4126,
            name: "Community Project",
            location: "Bhopal, Madhya Pradesh",
            status: "Pending Review"
        },
        {
            lat: 19.0760,
            lng: 72.8777,
            name: "Infrastructure Project",
            location: "Mumbai, Maharashtra",
            status: "Discrepancy Found"
        }
    ];

    projects.forEach(project => {

        let markerColor = "#16a34a";

        if (project.status === "Discrepancy Found") {
            markerColor = "#dc2626";
        }

        if (project.status === "Pending Review") {
            markerColor = "#f59e0b";
        }

        const marker = L.circleMarker(
            [project.lat, project.lng],
            {
                radius: 8,
                fillColor: markerColor,
                color: "#ffffff",
                weight: 3,
                fillOpacity: 1
            }
        ).addTo(map);

        marker.bindPopup(`
            <strong>${project.name}</strong><br>
            ${project.location}<br>
            <b>Status:</b> ${project.status}
        `);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // your existing code
    initIndiaMap();

});