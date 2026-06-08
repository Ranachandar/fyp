// ===== THEME =====
let isDark = false;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  ['loginThemeBtn','dashThemeBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle('on', isDark);
  });
}

// ===== LOGIN =====
let selectedRole = 'admin';
function selectRole(role) {
  selectedRole = role;
  document.getElementById('role-admin').classList.toggle('active', role === 'admin');
  document.getElementById('role-teacher').classList.toggle('active', role === 'teacher');
}

function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass  = document.getElementById('loginPass').value;
  if (!email || !pass) { alert('Please enter email and password.'); return; }
  document.getElementById('login-view').classList.remove('active');
  document.getElementById('dashboard-view').classList.add('active');
  startAISimulation();
}

// ===== SIDEBAR =====
let sidebarCollapsed = false;
let mobileSidebarOpen = false;

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  if (window.innerWidth <= 768) {
    mobileSidebarOpen = !mobileSidebarOpen;
    sidebar.classList.toggle('mobile-open', mobileSidebarOpen);
    overlay.style.display = mobileSidebarOpen ? 'block' : 'none';
  } else {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
  }
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobileOverlay').style.display = 'none';
  mobileSidebarOpen = false;
}

// ===== NAVIGATION =====
const pageTitles = {
  dashboard: ['Dashboard', 'Home › Dashboard'],
  students: ['Students', 'Home › Students'],
  attendance: ['Attendance', 'Home › Attendance'],
  reports: ['Reports', 'Home › Reports'],
  ai: ['AI System', 'Home › AI System'],
  settings: ['Settings', 'Home › Settings'],
};

function showPage(page, el) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  el.classList.add('active');
  const [title, bread] = pageTitles[page] || [page, ''];
  document.getElementById('topbarTitle').textContent = title;
  document.getElementById('topbarBread').textContent = bread;
  if (window.innerWidth <= 768) closeMobileSidebar();
}

// ===== STUDENTS ADD FORM =====
function toggleAddForm() {
  document.getElementById('addForm').classList.toggle('show');
}

// ===== MODAL =====
function showModal() { document.getElementById('logoutModal').classList.add('show'); }
function hideModal() { document.getElementById('logoutModal').classList.remove('show'); }
function doLogout() {
  document.getElementById('logoutModal').classList.remove('show');
  document.getElementById('dashboard-view').classList.remove('active');
  document.getElementById('login-view').classList.add('active');
}

// ===== AI SIMULATION =====
const aiEvents = [
  { text: 'Hassan Ali — Face recognized, attendance marked ✔ (Confidence: 91.2%)', type: 'success' },
  { text: 'Nadia Bukhari — Face recognized, attendance marked ✔ (Confidence: 97.8%)', type: 'success' },
  { text: 'Multiple faces detected in frame — processing individually...', type: 'info' },
  { text: 'Unknown face detected — manual verification required', type: 'warning' },
  { text: 'Ali Hassan — Face recognized, attendance marked ✔ (Confidence: 93.4%)', type: 'success' },
  { text: 'Model recalibration applied — accuracy improved by 0.2%', type: 'info' },
];
let aiIdx = 0;

function startAISimulation() {
  setInterval(() => {
    const now = new Date();
    const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + ':' + now.getSeconds().toString().padStart(2,'0');
    const ev = aiEvents[aiIdx % aiEvents.length]; aiIdx++;

    const icons = { success: 'fas fa-check-circle', info: 'fas fa-brain', warning: 'fas fa-exclamation-triangle' };
    const colors = { success: 'var(--success)', info: 'var(--primary)', warning: 'var(--warning)' };

    const entry = `<div class="log-entry ${ev.type}"><i class="${icons[ev.type]}" style="color:${colors[ev.type]};flex-shrink:0;"></i><span>${ev.text}</span><span class="log-time-s">${time}</span></div>`;

    // Dashboard log
    const liveLog = document.getElementById('liveLog');
    if (liveLog) { liveLog.innerHTML = entry + liveLog.innerHTML; if (liveLog.children.length > 5) liveLog.removeChild(liveLog.lastChild); }

    // AI page log
    const aiStream = document.getElementById('aiLogStream');
    if (aiStream) { aiStream.innerHTML = entry + aiStream.innerHTML; if (aiStream.children.length > 8) aiStream.removeChild(aiStream.lastChild); }
  }, 4000);

  // Animate face confidence
  setInterval(() => {
    const conf = (95 + Math.random() * 4).toFixed(1) + '%';
    const el = document.getElementById('aiConf');
    if (el) el.textContent = conf;
    const fd = document.getElementById('faceStatus');
    if (fd) fd.textContent = Math.random() > 0.2 ? 'Yes' : 'Detecting...';
  }, 2500);
}

// Keyboard shortcut
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
