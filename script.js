// Generate background dollar signs
const bgContainer = document.querySelector('.dollar-bg-container');
for(let i=0; i<50; i++){
    const span = document.createElement('span');
    span.innerText = '$';
    span.style.left = Math.random()*100 + 'vw';
    span.style.animationDuration = 30 + Math.random()*60 + 's';
    span.style.fontSize = 20 + Math.random()*50 + 'px';
    bgContainer.appendChild(span);
}

// Sample matches data
const matchesData = [
    { league: "Premier League", home: "Arsenal", away: "Chelsea", score: "2-1", live: true, prob: { home: 0.45, draw: 0.25, away: 0.30 } },
    { league: "Premier League", home: "Liverpool", away: "Manchester United", score: "1-1", live: true, prob: { home: 0.40, draw: 0.30, away: 0.30 } },
    { league: "La Liga", home: "Barcelona", away: "Real Madrid", score: "3-2", live: false, prob: { home: 0.50, draw: 0.20, away: 0.30 } },
    { league: "Serie A", home: "Juventus", away: "Inter Milan", score: "0-0", live: false, prob: { home: 0.35, draw: 0.35, away: 0.30 } }
];

let currentTab = 'live';

function showTab(tabName){
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b=>b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
    currentTab = tabName;
    renderMatches();
}

function renderMatches(){
    const liveContainer = document.getElementById('live');
    const upcomingContainer = document.getElementById('upcoming');
    const historyContainer = document.getElementById('history');

    liveContainer.innerHTML = '';
    upcomingContainer.innerHTML = '';
    historyContainer.innerHTML = '';

    const teamName = document.getElementById("teamSearch").value.trim().toLowerCase();

    matchesData.forEach((match, index)=>{
        if(teamName && !(match.home.toLowerCase().includes(teamName) || match.away.toLowerCase().includes(teamName))) return;

        const cardHTML = `
        <div class="match-card">
            <h3>[${match.league}] ${match.home} vs ${match.away}</h3>

            <!-- Market graphic bars -->
            <div class="prob-bar">
                <div class="prob-fill" style="width:${match.prob.home*100}%;background:#28a745">Home ${Math.round(match.prob.home*100)}%</div>
            </div>
            <div class="prob-bar">
                <div class="prob-fill" style="width:${match.prob.draw*100}%;background:#ffc107">Draw ${Math.round(match.prob.draw*100)}%</div>
            </div>
            <div class="prob-bar">
                <div class="prob-fill" style="width:${match.prob.away*100}%;background:#dc3545">Away ${Math.round(match.prob.away*100)}%</div>
            </div>

            <p>Predicted Score: ${match.score}</p>

            <!-- Pie chart -->
            <canvas id="chart-${index}" width="200" height="200"></canvas>
        </div>
        `;

        if(match.live) liveContainer.innerHTML += cardHTML;
        else upcomingContainer.innerHTML += cardHTML;

        // Create pie chart after inserting card
        setTimeout(() => {
            const ctx = document.getElementById(`chart-${index}`).getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Home', 'Draw', 'Away'],
                    datasets: [{
                        data: [match.prob.home, match.prob.draw, match.prob.away],
                        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#fff' }
                        }
                    }
                }
            });
        }, 50);
    });

    // Load history
    let history = JSON.parse(localStorage.getItem("history")) || [];
    const output = history.map(h=>`${h.match} | Predicted: ${h.predicted} | Actual: ${h.actual} (${h.time})`).join('\n');
    historyContainer.innerText = output;
}

function searchTeamMatches(){
    renderMatches();
}

// Global function for button
window.searchTeamMatches = searchTeamMatches;

// Initialize
showTab('live');

// Optional: auto-refresh live matches every 10s
setInterval(()=>{ if(currentTab==='live') renderMatches(); }, 10000);