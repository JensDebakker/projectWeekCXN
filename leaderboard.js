/**
 * leaderboard.js
 * Handles fetching and displaying scores via Firebase.
 * Falls back to localStorage if Firebase is not configured.
 */

const LeaderboardManager = {
    db: null,
    isFirebase: false,
    currentFilter: 'Phishing',

    init: async function() {
        if (window.firebase && window.firebaseConfig && window.firebaseConfig.apiKey !== "YOUR_API_KEY") {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(window.firebaseConfig);
                }
                this.db = firebase.database();
                this.isFirebase = true;
                console.log("Firebase Leaderboard Initialized");
            } catch (e) {
                console.error("Firebase init failed, using local storage:", e);
            }
        }
        
        this.setupFilters();
        this.render();
    },

    setupFilters: function() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.getAttribute('data-filter');
                this.render();
            });
        });
    },

    // 1. Get scores
    getScores: function(callback) {
        if (this.isFirebase) {
            this.db.ref('scores').orderByChild('score').limitToLast(100).on('value', (snapshot) => {
                const data = snapshot.val();
                let scores = [];
                if (data) {
                    scores = Object.values(data);
                    scores.sort((a, b) => b.score - a.score);
                }
                callback(scores);
            });
        } else {
            const scores = localStorage.getItem('cxn_leaderboard');
            callback(scores ? JSON.parse(scores) : []);
        }
    },

    // 2. Save a new score
    saveScore: function(name, score, moduleName = "General") {
        const newEntry = {
            name: name,
            score: score,
            module: moduleName,
            date: new Date().toISOString()
        };

        if (this.isFirebase) {
            this.db.ref('scores').push(newEntry);
        } else {
            let scores = JSON.parse(localStorage.getItem('cxn_leaderboard') || '[]');
            scores.push(newEntry);
            scores.sort((a, b) => b.score - a.score);
            localStorage.setItem('cxn_leaderboard', JSON.stringify(scores.slice(0, 100)));
        }
    },

    // 3. Render the table
    render: function() {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return; // Not on leaderboard page

        const noDataMsg = document.getElementById('no-data-msg');
        const totalParticipantsEl = document.getElementById('total-participants');
        const topScoreEl = document.getElementById('top-score');

        this.getScores((allScores) => {
            // Filter scores if necessary
            let scores = allScores;
            if (this.currentFilter !== 'All') {
                scores = allScores.filter(s => s.module === this.currentFilter);
            }

            if (scores.length === 0) {
                tbody.innerHTML = '';
                noDataMsg.style.display = 'block';
                totalParticipantsEl.textContent = '0';
                topScoreEl.textContent = '0';
                return;
            }

            noDataMsg.style.display = 'none';
            tbody.innerHTML = scores.map((entry, index) => {
                const rank = index + 1;
                const rankClass = rank <= 3 ? `rank-${rank}` : '';
                
                return `
                    <tr class="row">
                        <td class="rank ${rankClass}">${rank}</td>
                        <td class="name">${this.escapeHtml(entry.name)}</td>
                        <td class="module" style="color: #64748b; font-size: 0.85rem;">${this.escapeHtml(entry.module || 'General')}</td>
                        <td class="score">${entry.score}</td>
                    </tr>
                `;
            }).join('');

            totalParticipantsEl.textContent = scores.length;
            topScoreEl.textContent = scores[0].score;
        });
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initial run
LeaderboardManager.init();
window.LeaderboardManager = LeaderboardManager;
