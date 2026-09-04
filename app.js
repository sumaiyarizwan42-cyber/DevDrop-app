// 1. SUPABASE SETUP
const supabaseUrl = 'https://aptvcfimqfeasdbjocnq.supabase.co';
const supabaseKey = 'sb_publishable_GzGrKBR_dgucIW_9Sq1JYw_O65X0yoi';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// 2. INITIALIZATION
window.onload = () => {
    const savedUser = localStorage.getItem('devDropUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    }
};

function showApp() {
    const overlay = document.getElementById('welcomeOverlay');
    overlay.classList.remove('hidden'); // Show it
    
    setTimeout(() => {
        overlay.classList.add('hidden'); // Hide it after 3 seconds
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        renderNav();
        navigateTo('home');
    }, 3000);
}

// 3. LOGIN
async function handleLogin() {
    const role = document.getElementById('roleSelect').value;
    const name = role === 'student' ? 'John Student' : 'Company Admin';
    currentUser = { name, role, major: role === 'student' ? 'Computer Science' : 'HR' };
    localStorage.setItem('devDropUser', JSON.stringify(currentUser));
    await supabaseClient.from('Profiles').insert([{ name, role, major: currentUser.major }]);
    showApp();
}

// 4. UI FUNCTIONS (Ensure these are NOT inside other functions!)
function openModal() { document.getElementById('submitModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('submitModal').classList.add('hidden'); }
function openPostModal() { document.getElementById('postModal').classList.remove('hidden'); }

async function submitProject() {
    const link = document.getElementById('solutionLink').value;
    if (!link) { alert("Please paste a link first!"); return; }
    
    const { error } = await supabaseClient.from('Submissions').insert([{ 
        student_name: currentUser.name,
        project_title: "Predictive Maintenance AI",
        proposal_link: link,
        status: 'pending'
    }]);
    
    if (error) alert("Error: " + error.message);
    else { alert("Success!"); closeModal(); }
}

function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chatInput');
        const chat = document.getElementById('chatMessages');
        if (input.value.trim() !== "") {
            chat.innerHTML += `<div class="bg-blue-600 p-2 text-white rounded mb-2 w-max ml-auto">${input.value}</div>`;
            input.value = '';
        }
    }
}
function renderNav() {
    const nav = document.getElementById('navBar');
    nav.className = "bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm";
    nav.innerHTML = `
        <h1 class="font-bold text-2xl text-blue-600 tracking-tight">DevDrop</h1>
        <div class="flex items-center gap-6">
            <button class="nav-btn" onclick="navigateTo('home')">Dashboard</button>
            <button class="nav-btn" onclick="navigateTo('jobs')">Projects</button>
            <button class="nav-btn" onclick="navigateTo('drops')">Drops</button>
            <button class="nav-btn" onclick="navigateTo('messaging')">Chat</button>
            <button class="nav-btn" onclick="navigateTo('profile')">Profile</button>
            <button onclick="localStorage.clear(); location.reload()" class="text-red-500 font-bold text-sm">Logout</button>
        </div>
    `;
}

async function navigateTo(page, projectId = null) {
    const content = document.getElementById('pageContent');
    content.innerHTML = '';
    content.className = "max-w-6xl mx-auto p-6 animate-fade-in";

    // DEFINE THIS HERE SO EVERYONE CAN SEE IT
    const projects = [
        { id: 1, title: "Predictive Maintenance AI", company: "TechCorp Inc.", description: "Analyze sensor data to predict machine failure.", skills: "Python, AI" },
        { id: 2, title: "Green Energy Dashboard", company: "EcoVolt", description: "Design a dashboard to monitor solar energy usage.", skills: "React, Tailwind" }
    ];

    if (page === 'home') {
        const isInd = currentUser.role === 'industrialist';
        content.innerHTML = `
            <div class="flex gap-4 mb-8">
                ${isInd ? `<button onclick="openPostModal()" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">+ Post Challenge</button>` : `<button onclick="navigateTo('jobs')" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">View Projects</button>`}
                <button onclick="navigateTo('messaging')" class="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition">Check Messages</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="glass-card p-6 bg-white border"><h3 class="font-bold text-lg mb-4 text-slate-800">Upcoming Milestones</h3><div class="p-3 bg-gray-50 rounded-lg border">Predictive AI Proposal <span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Due in 2 days</span></div></div>
                <div class="glass-card p-6 bg-white border"><h3 class="font-bold text-lg mb-4 text-slate-800">Live Pulse</h3><div class="space-y-3 text-sm text-slate-600"><p>• TechCorp posted a new project</p></div></div>
            </div>`;
    } 
  
   else if (page === 'jobs') {
        if (projectId) {
            // DETAIL VIEW
            const p = projects.find(item => item.id == projectId);
            content.innerHTML = `
                <button onclick="navigateTo('jobs')" class="mb-4 text-blue-600 font-bold">&larr; Back</button>
                <div class="bg-white p-8 rounded-2xl shadow-sm border">
                    <h2 class="text-3xl font-bold">${p.title}</h2>
                    <p class="text-blue-600 font-semibold mb-6">${p.company}</p>
                    <p class="mb-6 text-slate-700">${p.description}</p>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-50 p-4 rounded-lg"><strong>Skills:</strong> ${p.skills}</div>
                    </div>
                    ${currentUser.role === 'student' ? 
                        `<button onclick="openModal()" class="w-full bg-blue-600 py-4 rounded-xl text-white font-bold">Submit Proposal / CV</button>` : 
                        `<p class="text-slate-500 italic">This is your active challenge posting.</p>`}
                </div>`;
        } else {
            // LIST VIEW (Uses the local 'projects' array defined at the top of navigateTo)
            content.innerHTML = `<div class="flex justify-between mb-6"><h2 class="text-2xl font-bold">Explore Challenges</h2>
                ${currentUser.role === 'industrialist' ? '<button onclick="openPostModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">+ Post</button>' : ''}
            </div>`;
            
            projects.forEach(p => {
                content.innerHTML += `
                    <div class="bg-white p-6 rounded-xl border mb-4 flex justify-between items-center">
                        <div>
                            <h3 class="font-bold text-xl">${p.title}</h3>
                            <p class="text-sm text-blue-600">${p.company}</p>
                        </div>
                        <button onclick="navigateTo('jobs', ${p.id})" class="bg-slate-900 px-6 py-3 rounded-xl text-white font-semibold">View</button>
                    </div>`;
            });
        }
    }
    else if (page === 'messaging') {
        const list = currentUser.role === 'industrialist' ? [{n: "John Student", r: "UET Student"}] : [{n: "TechCorp Mentor", r: "AI Engineer"}];
        content.innerHTML = `<div class="flex gap-6 h-[60vh]"><div class="w-1/3 bg-white p-4 rounded-xl border">${list.map(i => `<div class="p-3 bg-gray-50 mb-2 rounded-lg font-bold cursor-pointer hover:bg-blue-50">${i.n}<br/><span class="text-xs text-blue-600">${i.r}</span></div>`).join('')}</div><div class="w-2/3 bg-white p-4 rounded-xl border flex flex-col"><div id="chatMessages" class="flex-1 overflow-y-auto mb-4"></div><input type="text" id="chatInput" onkeypress="handleChat(event)" class="w-full border p-3 rounded-lg" placeholder="Type message..."></div></div>`;
    }
    else if (page === 'profile') {
        const isInd = currentUser.role === 'industrialist';
        content.innerHTML = `<div class="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-sm border text-center"><h2 class="text-3xl font-bold mb-8">${isInd ? 'Industrialist' : 'Student'} Profile</h2><div class="grid grid-cols-3 gap-4 mb-8"><div class="bg-blue-600 p-4 rounded-2xl text-white"><p class="text-xs opacity-75">${isInd ? 'Received' : 'Active'}</p><p class="text-xl font-bold">5</p></div><div class="bg-gray-100 p-4 rounded-2xl"><p class="text-xs text-slate-500">${isInd ? 'Selected' : 'Sent'}</p><p class="text-xl font-bold">2</p></div><div class="bg-gray-100 p-4 rounded-2xl"><p class="text-xs text-slate-500">Done</p><p class="text-xl font-bold">3</p></div></div><div class="space-y-4 text-left border-t pt-6 text-slate-700">${isInd ? `<p class="flex justify-between"><strong>Company Name:</strong> <span>TechCorp Solutions</span></p>` : `<p class="flex justify-between"><strong>Institute:</strong> <span>National University</span></p>`}</div></div>`;
    }
    else if (page === 'drops') {
        content.innerHTML = `
            <div class="flex justify-between mb-8">
                <h2 class="text-3xl font-bold">Industry Insights</h2>
                ${currentUser.role === 'industrialist' ? `<button onclick="alert('Insight Posted!')" class="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Insight</button>` : ''}
            </div>
            <div class="bg-white p-6 rounded-2xl border"><h3 class="font-bold text-lg text-blue-600">TechCorp Inc.</h3><p class="mt-2">"Understanding Python is a necessity."</p></div>`;
    }
}
async function submitProject() {
    const link = document.getElementById('solutionLink').value;
    if (!link) {
        alert("Please paste a link first!");
        return;
    }

    // Save to Supabase
    const { data, error } = await supabaseClient.from('Submissions').insert([{ 
        student_name: currentUser.name,
        project_title: "Predictive Maintenance AI", // Hardcoded for now, we'll make this dynamic next
        proposal_link: link,
        status: 'pending'
    }]);

    if (error) {
        alert("Failed to submit: " + error.message);
    } else {
        alert("Success! Your proposal has been sent to the industrialist.");
        closeModal();
        document.getElementById('solutionLink').value = '';
    }
}
async function postChallenge() {
    const title = document.getElementById('projTitle').value;
    const description = document.getElementById('projDesc').value;
    const skills = document.getElementById('projSkills').value;

    const { error } = await supabaseClient.from('Projects').insert([{
        title,
        description,
        skills,
        company: currentUser.name
    }]);

    if (error) {
        console.error(error);
        alert("Error: " + error.message);
    } else {
        alert("Challenge Posted!");
        document.getElementById('postModal').classList.add('hidden');
        navigateTo('jobs');
    }
}
