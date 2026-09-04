let currentUser = null;

// Initialization
window.onload = () => {
    const savedUser = localStorage.getItem('devDropUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    }
};

function showApp() {
    const overlay = document.getElementById('welcomeOverlay');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('hidden');
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        renderNav();
        navigateTo('home');
    }, 3000);
}

function handleLogin() {
    const role = document.getElementById('roleSelect').value;
    const name = role === 'student' ? 'John Student' : 'Company Admin';
    currentUser = { name, role, major: role === 'student' ? 'Computer Science' : 'HR' };
    localStorage.setItem('devDropUser', JSON.stringify(currentUser));
    showApp();
}

function renderNav() {
    const nav = document.getElementById('navBar');
    nav.innerHTML = `
        <h1 class="font-bold text-2xl text-blue-600">DevDrop</h1>
        <div class="flex items-center gap-6">
            <button class="hover:text-blue-400" onclick="navigateTo('home')">Dashboard</button>
            <button class="hover:text-blue-400" onclick="navigateTo('jobs')">Projects</button>
            <button class="hover:text-blue-400" onclick="navigateTo('drops')">Drops</button>
            <button class="hover:text-blue-400" onclick="navigateTo('messaging')">Chat</button>
            <button class="hover:text-blue-400" onclick="navigateTo('profile')">Profile</button>
            <button onclick="localStorage.clear(); location.reload()" class="text-red-400 font-bold">Logout</button>
        </div>
    `;
}

function navigateTo(page, projectId = null) {
    const content = document.getElementById('pageContent');
    content.innerHTML = '';
    const projects = [
        { id: 1, title: "Predictive Maintenance AI", company: "TechCorp Inc.", description: "Analyze sensor data to predict machine failure.", skills: "Python, AI" },
        { id: 2, title: "Green Energy Dashboard", company: "EcoVolt", description: "Design a dashboard to monitor solar energy usage.", skills: "React, Tailwind" }
    ];

    if (page === 'home') {
        const isInd = currentUser.role === 'industrialist';
        content.innerHTML = `
            <div class="text-center pt-10 animate-fade-in">
                <h1 class="text-5xl font-black mb-4">DevDrop</h1>
                <p class="text-xl italic mb-10">"Bridging the gap between university ambition and industrial innovation."</p>
                <div class="flex gap-4 justify-center">
                    ${isInd ? `<button onclick="openPostModal()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">+ Post Challenge</button>` : `<button onclick="navigateTo('jobs')" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">View Projects</button>`}
                </div>
            </div>`;
    } 
    else if (page === 'jobs') {
        if (projectId) {
            const p = projects.find(item => item.id == projectId);
            content.innerHTML = `<button onclick="navigateTo('jobs')" class="text-blue-600 font-bold">&larr; Back</button>
                <div class="bg-white p-8 rounded-2xl border mt-4">
                    <h2 class="text-3xl font-bold">${p.title}</h2>
                    <p class="text-blue-600 font-semibold mb-6">${p.company}</p>
                    <p class="mb-6">${p.description}</p>
                    <div class="bg-gray-50 p-4 rounded-lg mb-6"><strong>Skills:</strong> ${p.skills}</div>
                    ${currentUser.role === 'student' ? `<button onclick="openModal()" class="w-full bg-blue-600 py-4 rounded-xl text-white font-bold">Submit Proposal / CV</button>` : `<p class="italic">This is your posted challenge.</p>`}
                </div>`;
        } else {
            content.innerHTML = `<div class="flex justify-between"><h2 class="text-2xl font-bold">Explore Challenges</h2>
                ${currentUser.role === 'industrialist' ? '<button onclick="openPostModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">+ Post</button>' : ''}
            </div>`;
            projects.forEach(p => content.innerHTML += `<div class="bg-white p-6 mt-4 rounded-xl border flex justify-between"><div><h3 class="font-bold text-xl">${p.title}</h3><p class="text-blue-600">${p.company}</p></div><button onclick="navigateTo('jobs', ${p.id})" class="bg-slate-900 text-white px-6 py-2 rounded-xl">View</button></div>`);
        }
    }
    else if (page === 'messaging') {
        const list = currentUser.role === 'industrialist' ? [{n: "John Student", r: "UET Student"}] : [{n: "TechCorp Mentor", r: "AI Engineer"}];
        content.innerHTML = `<div class="flex gap-6 h-[60vh]"><div class="w-1/3 bg-white p-4 rounded-xl border">${list.map(i => `<div class="p-3 bg-gray-50 mb-2 rounded-lg font-bold cursor-pointer hover:bg-blue-50">${i.n}<br/><span class="text-xs text-blue-600">${i.r}</span></div>`).join('')}</div><div class="w-2/3 bg-white p-4 rounded-xl border flex flex-col"><div id="chatMessages" class="flex-1 overflow-y-auto mb-4"></div><input type="text" id="chatInput" onkeypress="handleChat(event)" class="w-full border p-3 rounded-lg" placeholder="Type message..."></div></div>`;
    }
    else if (page === 'profile') {
        const isInd = currentUser.role === 'industrialist';
        content.innerHTML = `<div class="max-w-xl mx-auto bg-white p-10 rounded-3xl border text-center"><h2 class="text-3xl font-bold mb-8">${isInd ? 'Industrialist' : 'Student'} Profile</h2><div class="grid grid-cols-3 gap-4 mb-8"><div class="bg-blue-600 p-4 rounded-2xl text-white"><p class="text-xs opacity-75">${isInd ? 'Received' : 'Active'}</p><p class="text-xl font-bold">5</p></div><div class="bg-gray-100 p-4 rounded-2xl"><p class="text-xs text-slate-500">${isInd ? 'Selected' : 'Sent'}</p><p class="text-xl font-bold">2</p></div><div class="bg-gray-100 p-4 rounded-2xl"><p class="text-xs text-slate-500">Done</p><p class="text-xl font-bold">3</p></div></div><div class="space-y-4 text-left border-t pt-6 text-slate-700">${isInd ? `<p class="flex justify-between"><strong>Company:</strong> <span>TechCorp Solutions</span></p>` : `<p class="flex justify-between"><strong>Institute:</strong> <span>National University</span></p>`}</div></div>`;
    }
    else if (page === 'drops') {
        content.innerHTML = `<div class="flex justify-between mb-8"><h2 class="text-3xl font-bold">Industry Insights</h2>${currentUser.role === 'industrialist' ? '<button onclick="alert(\'Insight Posted!\')" class="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Insight</button>' : ''}</div><div class="bg-white p-6 rounded-2xl border"><h3 class="font-bold text-lg text-blue-600">TechCorp Inc.</h3><p class="mt-2 text-slate-700">"Understanding Python is a necessity for all engineers."</p></div>`;
    }
}

function openModal() { document.getElementById('submitModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('submitModal').classList.add('hidden'); }
function openPostModal() { document.getElementById('postModal').classList.remove('hidden'); }
function submitProject() { alert("Success!"); closeModal(); }
function postChallenge() { alert("Posted!"); document.getElementById('postModal').classList.add('hidden'); }
function handleChat(event) { if (event.key === 'Enter') { document.getElementById('chatMessages').innerHTML += `<div class="bg-blue-600 p-2 text-white rounded mb-2 w-max ml-auto">${event.target.value}</div>`; event.target.value = ''; } }
