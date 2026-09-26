/* =========================================
   MPLADS — SUPABASE CLIENT + DATA HELPERS
   Shared by every page that reads live data.

   Load order in each page's <head>/<body>:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="supabase-client.js"></script>
     <script src="common.js"></script>
     <script src="projects.js"></script>  (or whichever page script)

   NOTE ON KEYS: SUPABASE_ANON_KEY below is the public/anon key —
   it is safe to ship in frontend JS *only* if Row Level Security
   (RLS) is turned on for these tables in Supabase, with a policy
   that allows SELECT for the anon role. If queries below return
   empty results or a permissions error, that's the first thing
   to check (Supabase → Authentication → Policies).
========================================= */

const SUPABASE_URL = "https://erpxfhlcyqtjbcvnzeww.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__Wuv4GfbZRRmPTGZWzFsFA_MCH_5ozC";

// `supabase` here is the global injected by the CDN script above.
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FASTAPI_BASE_URL = "https://mplad-project.onrender.com";

/* =========================================
   FORMATTING HELPERS
========================================= */

function formatRupeesLakhs(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  const lakhs = amount / 100000;
  if (lakhs >= 1) return "₹ " + lakhs.toFixed(1) + " L";
  return "₹ " + Number(amount).toLocaleString("en-IN");
}

/* Real work_status values (e.g. "Physical Inspection", "Sanction",
   "Work partially Completed") don't match the original mock pill
   labels 1:1, so this maps by keyword instead of exact string. */
function statusToPillClass(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("complet")) return "status-completed";
  if (s.includes("delay")) return "status-delayed";
  if (s.includes("pend") || s.includes("recommend")) return "status-pending";
  return "status-progress";
}

function statusToIcon(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("complet")) return "fa-circle-check";
  if (s.includes("delay")) return "fa-clock";
  if (s.includes("pend") || s.includes("recommend")) return "fa-hourglass-half";
  return "fa-spinner";
}

/* =========================================
   SUPABASE QUERIES — works_sanctioned
========================================= */

async function fetchDistinctStates() {
  const { data, error } = await db.from("works_sanctioned").select("state");
  if (error) {
    console.error("fetchDistinctStates:", error);
    return [];
  }
  return [...new Set(data.map((r) => r.state).filter(Boolean))].sort();
}

async function fetchDistinctStatuses() {
  const { data, error } = await db.from("works_sanctioned").select("work_status");
  if (error) {
    console.error("fetchDistinctStatuses:", error);
    return [];
  }
  return [...new Set(data.map((r) => r.work_status).filter(Boolean))].sort();
}

/**
 * Paged, filtered fetch from works_sanctioned.
 * Returns { rows, count } where count is the TOTAL matching rows
 * (not just the ones returned), for pagination / the "N PROJECTS" badge.
 */
async function fetchProjects({ search = "", state = "", status = "", district = "", limit = 25, offset = 0 } = {}) {
  let query = db
    .from("works_sanctioned")
    .select(
      "id, work_id, work, work_description, state, constituency, work_status, sanction_amount_rs",
      { count: "exact" }
    )
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (state) query = query.eq("state", state);
  if (status) query = query.eq("work_status", status);
  if (district) query = query.ilike("constituency", `%${district}%`);
  if (search) {
    query = query.or(
      `work_id.ilike.%${search}%,work_description.ilike.%${search}%,work.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("fetchProjects:", error);
    return { rows: [], count: 0 };
  }
  return { rows: data, count: count || 0 };
}

/* =========================================
   FASTAPI — live risk analysis
   /analyze/{work_id} is designed for one work at a
   time, so this is only ever called for the rows
   currently visible on screen, not the whole dataset.
========================================= */

async function analyzeWork(workId) {
  try {
    const res = await fetch(FASTAPI_BASE_URL + "/analyze/" + encodeURIComponent(workId));
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("analyzeWork failed for", workId, err);
    return null;
  }
}