let currentUser = null;

window.onload = () => {
    const savedUser = localStorage.getItem('devDropUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    }
};

function showApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    renderNav();
    navigateTo('home');
}

function handleLogin() {
    const role = document.getElementById('roleSelect').value;
    currentUser = { name: 'User', role: role, major: 'CS' };
    localStorage.setItem('devDropUser', JSON.stringify(currentUser));
    showApp();
}

function renderNav() {
    const nav = document.getElementById('navBar');
    nav.innerHTML = `
        <h1 class="font-bold text-2xl text-blue-600">DevDrop</h1>
        <div class="flex gap-6">
            <button onclick="navigateTo('home')">Dashboard</button>
            <button onclick="navigateTo('jobs')">Projects</button>
            <button onclick="localStorage.clear(); location.reload()" class="text-red-500 font-bold">Logout</button>
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
        content.innerHTML = `<h1 class="text-4xl font-bold">Welcome to DevDrop</h1><p>Bridging university ambition with industry innovation.</p>`;
    } else if (page === 'jobs') {
        if (projectId) {
            const p = projects.find(item => item.id == projectId);
            content.innerHTML = `<button onclick="navigateTo('jobs')" class="text-blue-600 font-bold">&larr; Back</button>
                <div class="bg-white p-6 rounded-xl border mt-4">
                    <h2 class="text-3xl font-bold">${p.title}</h2>
                    <p class="mb-4 text-blue-600">${p.company}</p>
                    <p class="mb-4">${p.description}</p>
                    <button onclick="alert('Submitted!')" class="w-full bg-blue-600 py-3 rounded-lg text-white font-bold">Submit Proposal</button>
                </div>`;
        } else {
            content.innerHTML = `<h2 class="text-2xl font-bold">Explore Challenges</h2>`;
            projects.forEach(p => {
                content.innerHTML += `<div class="bg-white p-6 mt-4 rounded-xl border flex justify-between">
                    <div><h3 class="font-bold text-xl">${p.title}</h3><p class="text-blue-600">${p.company}</p></div>
                    <button onclick="navigateTo('jobs', ${p.id})" class="bg-slate-900 text-white px-6 py-2 rounded-xl">View</button>
                </div>`;
            });
        }
    }
}
