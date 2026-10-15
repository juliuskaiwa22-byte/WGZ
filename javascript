const LEVELS_DATA = {
    T0: { price: 0, taskPay: 0, name: "Free Level (Locked until upgrade)" },
    T1: { price: 65000, taskPay: 330, name: "Level 1" },
    T2: { price: 150000, taskPay: 950, name: "Level 2" },
    T3: { price: 280000, taskPay: 1600, name: "Level 3" },
    T4: { price: 570000, taskPay: 3200, name: "Level 4" },
    T5: { price: 980000, taskPay: 5600, name: "Level 5" },
    T6: { price: 1750000, taskPay: 9500, name: "Level 6" },
    T7: { price: 2500000, taskPay: 13500, name: "Level 7" },
    T8: { price: 5000000, taskPay: 31000, name: "Level 8" },
    T9: { price: 8000000, taskPay: 48000, name: "Level 9" },
    T10: { price: 16000000, taskPay: 80000, name: "Level 10" },
    T11: { price: 35000000, taskPay: 220000, name: "Level 11" },
    T12: { price: 50000000, taskPay: 290000, name: "Level 12" }
};

let currentUser = JSON.parse(localStorage.getItem('wzg_current_user')) || null;
const MASTER_ADMIN = "0795140634";

let currentSlide = 0;
function initSlider() {
    const slides = document.querySelectorAll('.banner-slider img');
    if (slides.length === 0) return;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3500);
}
window.onload = initSlider;

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        event.target.classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('register-form').classList.add('active');
        event.target.classList.add('active');
    } else if (tab === 'forgot') {
        document.getElementById('forgot-form').classList.add('active');
        event.target.classList.add('active');
    }
}

function handleRegister() {
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();
    const invite = document.getElementById('reg-invite').value.trim();

    if (!phone || !pass || !invite) {
        alert("Please fill all fields and provide an invitation code.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('wzg_users')) || {};
    if (users[phone]) { alert("User already registered."); return; }

    users[phone] = {
        phone: phone,
        password: pass,
        inviteCode: invite,
        currentLevel: 'T0',
        earnWallet: 0,
        mainWallet: 0,
        teamSize: { r1: 0, r2: 0, r3: 0 }
    };

    localStorage.setItem('wzg_users', JSON.stringify(users));
    alert("Registration successful! WhatsApp OTP verification sent.");
    switchAuthTab('login');
}

function handleLogin() {
    const phone = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    let users = JSON.parse(localStorage.getItem('wzg_users')) || {};

    if (phone === MASTER_ADMIN && pass === "admin123") {
        currentUser = { phone: MASTER_ADMIN, currentLevel: 'T12', earnWallet: 9999999, mainWallet: 9999999, teamSize: {r1:15, r2:8, r3:4} };
    } else if (users[phone] && users[phone].password === pass) {
        currentUser = users[phone];
    } else {
        alert("Invalid login credentials.");
        return;
    }

    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    loadDashboard();
}

function handleLogout() {
    localStorage.removeItem('wzg_current_user');
    currentUser = null;
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('auth-view').classList.add('active');
}

function loadDashboard() {
    document.getElementById('auth-view').classList.remove('active');
    document.getElementById('dashboard-view').classList.add('active');

    document.getElementById('earn-wallet-balance').innerText = `UGX ${currentUser.earnWallet.toLocaleString()}`;
    document.getElementById('main-wallet-balance').innerText = `UGX ${currentUser.mainWallet.toLocaleString()}`;

    if (currentUser.phone === MASTER_ADMIN) {
        document.getElementById('admin-tab-btn').style.display = 'block';
    }
    switchTab('tasks');
}

function switchTab(tabName) {
    const area = document.getElementById('tab-content');
    if (tabName === 'tasks') renderTasksView(area);
    else if (tabName === 'levels') renderLevelsView(area);
    else if (tabName === 'wallet-actions') renderWalletView(area);
    else if (tabName === 'team') renderTeamView(area);
    else if (tabName === 'turntable') renderTurntable(area);
    else if (tabName === 'salaries') renderSalariesView(area);
    else if (tabName === 'marketplace') renderMarketplace(area);
    else if (tabName === 'admin' && currentUser.phone === MASTER_ADMIN) renderAdminView(area);
}

function renderTasksView(container) {
    const lvl = LEVELS_DATA[currentUser.currentLevel];
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-video"></i> TikTok Skit Tasks (${currentUser.currentLevel})</h3>
            <p>Task Payout: <strong>UGX ${lvl.taskPay}</strong> (7 tasks daily)</p>
            <div style="background:#000; height:160px; display:flex; align-items:center; justify-content:center; margin:10px 0;">
                <video width="100%" height="100%" controls muted>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                </video>
            </div>
            <p>Select the best comment among 4 options:</p>
            <button class="gold-btn" style="margin-top:8px;" onclick="submitTask(true)">A) Outstanding skit across Uganda districts!</button>
            <button class="gold-btn" style="margin-top:5px; background:#222; color:#fff;" onclick="submitTask(false)">B) Average comment</button>
        </div>
    `;
}

function submitTask(isCorrect) {
    if (!isCorrect) { alert("Incorrect comment selection. Try again."); return; }
    const pay = LEVELS_DATA[currentUser.currentLevel].taskPay;
    currentUser.earnWallet += pay;
    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    alert(`Task completed successfully! UGX ${pay} credited immediately.`);
    loadDashboard();
}

function renderLevelsView(container) {
    let html = `<h3><i class="fas fa-layer-group"></i> Membership Levels & Gold Coins Rain</h3>
        <div class="gold-border" style="border-color:var(--gold); margin-bottom:15px;">
            <h4>🌧️ Gold Coins Rain</h4>
            <p>Automatic reward for upgraded leaders & active referrers.</p>
            <button class="gold-btn" style="margin-top:8px;" onclick="claimGoldRain()">Claim Rain Reward</button>
        </div><div style="display:flex;flex-direction:column;gap:10px;">`;
    for (let key in LEVELS_DATA) {
        let l = LEVELS_DATA[key];
        html += `<div class="gold-border"><h4>${key}: ${l.name}</h4><p>Fee: UGX ${l.price.toLocaleString()}</p><button class="gold-btn" style="margin-top:5px;" onclick="upgradeLevel('${key}')">Activate Level</button></div>`;
    }
    container.innerHTML = html + `</div>`;
}

function claimGoldRain() {
    currentUser.earnWallet += 20000;
    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    alert("Gold Coins Rain collected! UGX 20,000 credited to Earn Wallet.");
    loadDashboard();
}

function upgradeLevel(key) {
    currentUser.currentLevel = key;
    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    alert(`Successfully upgraded to ${key}! Previous level fees refunded.`);
    loadDashboard();
}

function renderWalletView(container) {
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-wallet"></i> ObPay & Marz Innovations Gateway</h3>
            <p>Configured for Kaiwa Julius (0795140634)</p>
            <input type="number" id="tx-amt" placeholder="Enter Amount (UGX)" style="margin:10px 0;">
            <select id="tx-type" style="margin-bottom:10px;">
                <option value="airtel">Airtel Money (Instant PIN Prompt)</option>
                <option value="mtn">MTN Mobile Money (Instant PIN Prompt)</option>
                <option value="bank">Bank Transfer</option>
            </select>
            <button class="gold-btn" onclick="alert('Transaction submitted to gateway.')">Deposit Funds</button>
            <button class="gold-btn" style="margin-top:8px; background:#441111; color:#FFD700;" onclick="alert('Withdrawal request sent for admin approval.')">Withdraw Funds</button>
        </div>
    `;
}

function renderTeamView(container) {
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-users"></i> Team & Commissions</h3>
            <p>Referral Link: https://wzg.ug/ref?code=${currentUser.phone}</p>
            <p style="margin-top:10px;">R1 (18%), R2 (5%), R3 (1%)</p>
        </div>
    `;
}

function renderTurntable(container) {
    container.innerHTML = `
        <div class="gold-border" style="text-align:center;">
            <h3><i class="fas fa-dharmachakra"></i> Lucky Turntable (12 Segments)</h3>
            <p>Win Cash or Physical Prizes!</p>
            <div style="background:#222; border:2px dashed var(--gold); border-radius:50%; width:180px; height:180px; margin:15px auto; display:flex; align-items:center; justify-content:center;">
                <span style="color:var(--gold); font-weight:bold;">WZG WHEEL</span>
            </div>
            <button class="gold-btn" onclick="spinWheel()">Spin Wheel Now</button>
        </div>
    `;
}

function spinWheel() {
    currentUser.earnWallet += 15000;
    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    alert("Congratulations! You won UGX 15,000 credited to your Earn Wallet.");
    loadDashboard();
}

function renderSalariesView(container) {
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-award"></i> Team Leader Salaries</h3>
            <p>Rank 1 to Rank 5 Salaries based on R1, R2, R3 team size.</p>
            <div style="background:#222; padding:10px; margin-top:10px; border-radius:6px;">
                <p><strong>Assigned Monthly Salary:</strong> UGX 350,000</p>
                <button class="gold-btn" style="margin-top:10px;" onclick="alert('Monthly salary credited to Earn Wallet.')">Claim Salary</button>
            </div>
        </div>
    `;
}

function renderMarketplace(container) {
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-store"></i> Marketplace Advertising</h3>
            <p>Advertise businesses via text, photos, or videos.</p>
            <button class="gold-btn" style="margin-top:10px;" onclick="alert('Ad submitted successfully.')">Post Ad</button>
        </div>
    `;
}

function renderAdminView(container) {
    container.innerHTML = `
        <div class="gold-border" style="border:2px solid red;">
            <h3><i class="fas fa-shield-alt"></i> Master Admin Dashboard (0795140634)</h3>
            <p>Full control over ObPay/Marz API keys, user balances, password resets, suspension, gold coins rain grading tables, and turntable prizes.</p>
            <button class="gold-btn" style="margin-top:10px; background:red; color:#fff;" onclick="alert('Admin changes saved successfully.')">Save Admin Configurations</button>
        </div>
    `;
        }
