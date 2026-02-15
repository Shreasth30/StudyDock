const studyData = {
    "niet": {
        "4": [
            {
                name: "Data Structures and Analysis",
                ppt: [
                    { name: "TREES", link: "https://docs.google.com/presentation/d/1LZ_4gE8IpQSt2h5PXFD6bStrs1bT1nZ7/edit?usp=drive_link&ouid=110804383741647495330&rtpof=true&sd=true" },
                    { name: "Graphs", link: "https://drive.google.com/file/d/1gu402ns3t4AtzvQHBrQAKsUL3lYX-40F/view?usp=sharing" }
                ],

                notes: [{ name: "Binary Trees", link: "PASTE_LINK_HERE" }],
                pyqs: [{ name: "Final 2024", link: "PASTE_LINK_HERE" }],
                other: []
            },
            {
                name: "Theory of Computation",
                ppt: [{ name: "Finite Automata", link: "PASTE_LINK_HERE" }],
                notes: [{ name: "Turing Machines", link: "PASTE_LINK_HERE" }],
                pyqs: [{ name: "Midterm 2023", link: "PASTE_LINK_HERE" }],
                other: []
            },
            {
                name: "Environment and Ecology",
                ppt: [{ name: "Eco-systems", link: "PASTE_LINK_HERE" }],
                notes: [{ name: "Natural Resources", link: "PASTE_LINK_HERE" }],
                pyqs: [],
                other: []
            },
            {
                name: "Database Management Systems",
                ppt: [{ name: "ER Diagrams", link: "PASTE_LINK_HERE" }],
                notes: [{ name: "SQL Queries", link: "PASTE_LINK_HERE" }],
                pyqs: [{ name: "Final 2023", link: "PASTE_LINK_HERE" }],
                other: []
            },
            {
                name: "Statistics and Probability",
                ppt: [{ name: "Distributions", link: "PASTE_LINK_HERE" }],
                notes: [{ name: "Testing of Hypothesis", link: "PASTE_LINK_HERE" }],
                pyqs: [],
                other: []
            },
            {
                name: "Soft Computing",
                ppt: [{ name: "Fuzzy Logic", link: "PASTE_LINK_HERE" }],
                notes: [{ name: "Neural Networks", link: "PASTE_LINK_HERE" }],
                pyqs: [],
                other: []
            }
        ]
    },
    // Subject data for other colleges removed as per request to focus "just in NIET"
    "gl-bajaj": {},
    "gniot": {}
};

const collegeSelect = document.getElementById('college-select');
const semGrid = document.getElementById('sem-grid');
const subjectsDisplay = document.getElementById('subjects-display');

let currentCollege = '';
let currentSem = '';

// Event Listeners
collegeSelect.addEventListener('change', (e) => {
    currentCollege = e.target.value;
    updateSubjects();
});

semGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('sem-btn')) {
        // Remove active class from others
        document.querySelectorAll('.sem-btn').forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked
        e.target.classList.add('active');
        currentSem = e.target.dataset.sem;
        updateSubjects();
    }
});

function updateSubjects() {
    if (!currentCollege || !currentSem) return;

    // Reset display
    subjectsDisplay.classList.remove('visible');

    setTimeout(() => {
        subjectsDisplay.innerHTML = '';
        const subjects = (studyData[currentCollege] && studyData[currentCollege][currentSem]) || [];

        if (subjects.length === 0) {
            subjectsDisplay.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No study materials available for this selection yet.</div>`;
        } else {
            subjects.forEach(subject => {
                const card = createSubjectCard(subject);
                subjectsDisplay.appendChild(card);
            });
        }

        subjectsDisplay.classList.add('visible');
    }, 300);
}

function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';

    // Create tabs header
    const tabData = ['ppt', 'notes', 'pyqs', 'other'];
    const tabLabels = { ppt: 'PPT', notes: 'Notes', pyqs: 'PYQs', other: 'Other' };

    let tabsHtml = tabData.map((tab, index) =>
        `<button class="tab-btn ${index === 0 ? 'active' : ''}" data-tab="${tab}">${tabLabels[tab]}</button>`
    ).join('');

    card.innerHTML = `
        <div class="subject-header">
            <h3>${subject.name}</h3>
        </div>
        <div class="tabs">
            ${tabsHtml}
        </div>
        <div class="content-list" id="content-${subject.name.replace(/\s+/g, '-').toLowerCase()}">
            ${renderResources(subject['ppt'])}
        </div>
    `;

    // Add tab switching logic
    const tabBtns = card.querySelectorAll('.tab-btn');
    const contentList = card.querySelector('.content-list');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            contentList.style.opacity = '0';
            setTimeout(() => {
                contentList.innerHTML = renderResources(subject[tabName]);
                contentList.style.opacity = '1';
            }, 150);
        });
    });

    return card;
}

function renderResources(resources) {
    if (!resources || resources.length === 0) {
        return `<div style="text-align: center; color: var(--text-secondary); padding: 2rem 0; font-size: 0.8rem;">No items found.</div>`;
    }

    return resources.map(res => `
        <a href="${res.link}" class="resource-item" target="_blank" rel="noopener noreferrer" title="Preview Material">
            <div class="resource-info">
                <div class="resource-icon">
                    <i class="fas ${getIcon(res.name)}"></i>
                </div>
                <span class="resource-name">${res.name}</span>
            </div>
            <div class="preview-icon">
                <i class="fas fa-eye"></i>
            </div>
        </a>
    `).join('');
}


// Modal Logic
const modal = document.getElementById('contribute-modal');
const openBtn = document.getElementById('open-contribute');
const closeBtn = document.querySelector('.close-modal');
const contributeForm = document.getElementById('contribute-form');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.getElementById('file-name');

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

// File Selection handling
dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
        showFile(e.target.files[0].name);
    }
};

// Drag and Drop
dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
};

dropZone.ondragleave = () => dropZone.classList.remove('dragover');

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        showFile(e.dataTransfer.files[0].name);
    }
};

function showFile(name) {
    fileNameDisplay.textContent = name;
    fileInfo.style.display = "block";
}

// Form Submission
contributeForm.onsubmit = (e) => {
    e.preventDefault();
    const btn = contributeForm.querySelector('.submit-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Form...';
    btn.disabled = true;

    // REPLACE THE URL BELOW WITH YOUR GOOGLE FORM LINK
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSenSt3Pxh4kcN9TFu0MkAzLtTiUEfEeWBwzxqlyJrK0L4xpUA/viewform?usp=publish-editor";

    setTimeout(() => {
        if (googleFormUrl === "PASTE_YOUR_GOOGLE_FORM_URL_HERE") {
            alert('Please paste your actual Google Form URL in script.js to enable the upload feature.');
            btn.innerHTML = 'Proceed to Upload';
            btn.disabled = false;
        } else {
            window.open(googleFormUrl, '_blank');
            modal.style.display = "none";
            contributeForm.reset();
            fileInfo.style.display = "none";
            btn.innerHTML = 'Proceed to Upload';
            btn.disabled = false;
        }
    }, 1000);
};

function getIcon(name) {
    name = name.toLowerCase();
    if (name.includes('final') || name.includes('exam') || name.includes('20')) return 'fa-file-invoice';
    if (name.includes('summary') || name.includes('notes')) return 'fa-file-alt';
    if (name.includes('overview') || name.includes('ppt')) return 'fa-file-powerpoint';
    return 'fa-file';
}

// Cursor Glow Tracking
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorGlow.classList.contains('visible')) {
        cursorGlow.classList.add('visible');
    }
});

function animateGlow() {
    // Smooth interpolation (lerp)
    const easing = 0.1;
    currentX += (mouseX - currentX) * easing;
    currentY += (mouseY - currentY) * easing;

    cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animateGlow);
}

animateGlow();
