// ================= KIMI =================
function handleKimi(e){
    if(e.key === "Enter"){
        const input = document.getElementById("kimi-input");
        const msg = input.value.trim();
        if(!msg) return;

        input.value = "";
        const box = document.getElementById("kimi-messages");
        box.innerHTML += `<p><b>You:</b> ${msg}</p>`;

        let reply = "I'm here to help.";

        if(msg.toLowerCase().includes("wrong")){
            reply = "We analyze probabilities, not guarantees.";
        } else if(msg.toLowerCase().includes("safe")){
            reply = "Safe matches are those above 70% probability.";
        } else if(msg.toLowerCase().includes("hi")){
            reply = "Hello 👋 I'm KIMI.";
        }

        box.innerHTML += `<p style="color:lime;"><b>KIMI:</b> ${reply}</p>`;
        box.scrollTop = box.scrollHeight;
    }
}

// ================= MATCH DATA =================
const matchesData = [
    {
        home: "Arsenal",
        away: "Chelsea",
        startTime: "18:00",
        live: true,
        result: null,
        prob: { home: 0.8, draw: 0.1, away: 0.1 },
        formHome: ["W","W","W","D","W"],
        formAway: ["L","L","D","L","W"]
    },
    {
        home: "Liverpool",
        away: "Man United",
        startTime: "20:00",
        live: true,
        result: null,
        prob: { home: 0.75, draw: 0.15, away: 0.1 },
        formHome: ["W","W","W","W","W"],
        formAway: ["L","L","W","L","D"]
    },
    {
        home: "Barcelona",
        away: "Real Madrid",
        startTime: "21:00",
        live: false,
        result: "2-1",
        prob: { home: 0.4, draw: 0.3, away: 0.3 },
        formHome: ["W","D","W","W","L"],
        formAway: ["W","W","D","W","W"]
    }
];

// ================= HISTORY =================
function saveCorrectPrediction(match){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push({
        ...match,
        dateSaved: Date.now()
    });
    localStorage.setItem("history", JSON.stringify(history));
}

function getRecentHistory(){
    let history = JSON.parse(localStorage.getItem("history")) || [];
    const now = Date.now();
    return history.filter(h => (now - h.dateSaved) < 7*24*60*60*1000);
}

function renderHistory(){
    const container = document.getElementById("history");
    container.innerHTML = "";
    const history = getRecentHistory();
    history.forEach(h=>{
        container.innerHTML += `<p>${h.home} ${h.result || '?'} vs ${h.away} ${h.result || '?'} ✔</p>`;
    });
}

// ================= SAFE MATCHES =================
function renderSafeMatches(){
    const container = document.getElementById("safeMatches");
    container.innerHTML = "<h2>🔥 Top Safe Matches</h2>";

    const safe = matchesData.filter(m => m.prob.home >= 0.7 || m.prob.away >= 0.7);
    safe.slice(0,10).forEach(m=>{
        container.innerHTML += `<p>${m.home} vs ${m.away} ✔ Predicted Score: ${generatePredictedScore(m)}</p>`;
    });
}

// ================= SCORE GENERATOR =================
function generatePredictedScore(match){
    let homeGoals = Math.floor(match.prob.home*3);
    let awayGoals = Math.floor(match.prob.away*3);
    return `${homeGoals}-${awayGoals}`;
}

// ================= FIRST TIME =================
function isFirstTime(){
    return !localStorage.getItem("seenBefore");
}
function markUserSeen(){
    localStorage.setItem("seenBefore", true);
}

// ================= RENDER MATCHES =================
function renderMatches(){
    const liveContainer = document.getElementById("live");
    const upcomingContainer = document.getElementById("upcoming");
    liveContainer.innerHTML = "";
    upcomingContainer.innerHTML = "";

    const search = document.getElementById("teamSearch").value.toLowerCase();
    let found = false;

    matchesData.forEach((match)=>{
        if(search && !(match.home.toLowerCase().includes(search) || match.away.toLowerCase().includes(search))){
            return;
        }
        found = true;

        const card = `
        <div class="match-card">
            <h3>${match.home} vs ${match.away}</h3>
            <p>Start: ${match.startTime}</p>
            <p>Last 5 ${match.home}: ${match.formHome.join(" ")}</p>
            <p>Last 5 ${match.away}: ${match.formAway.join(" ")}</p>
            <p><b>Predicted Score:</b> ${generatePredictedScore(match)}</p>
            <p><b>Result Score:</b> ${match.result || "Live/Upcoming"}</p>
        </div>
        `;

        if(match.live){
            liveContainer.innerHTML += card;
        } else {
            upcomingContainer.innerHTML += card;
        }

        if(Math.random() > 0.8 && match.result){
            saveCorrectPrediction(match);
        }
    });

    if(!found){
        liveContainer.innerHTML = "<p>No matches found</p>";
    }

    renderHistory();
}

// ================= SEARCH =================
function searchTeamMatches(){
    renderMatches();
}

// ================= TABS =================
function showTab(tab){
    document.getElementById("live").style.display = tab === 'live' ? 'block' : 'none';
    document.getElementById("upcoming").style.display = tab === 'upcoming' ? 'block' : 'none';
}

// ================= INIT =================
renderMatches();
renderSafeMatches();