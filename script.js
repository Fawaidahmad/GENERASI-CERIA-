// ========================================
// ENHANCED KIDS-FRIENDLY DIGITAL WISDOM
// ========================================

// Global Variables
let currentPage = 'home';
let gameQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let currentGameLevel = 'easy';
let gameScore = 0;
let quizScore = 0;
let gameAnswered = false;
let quizAnswered = false;
let userProgress = {
    badges: {
        learner: false,
        gamer: false,
        genius: false,
        hero: false
    },
    completedLevels: [],
    totalScore: 0
};

// Character avatars for different scenarios
const characterAvatars = {
    student: '👦',
    girl: '👧',
    teacher: '👩‍🏫',
    parent: '👨‍💼',
    friend: '🧑‍🤝‍🧑'
};

const sceneryBackgrounds = {
    school: '🏫',
    home: '🏠',
    park: '🏞️',
    computer: '💻',
    phone: '📱'
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserProgress();
});

function initializeApp() {
    setupNavigation();
    setupAccordion();
    setupGameData();
    setupQuizData();
    setupEventListeners();
    setupIntersectionObserver();
    createFloatingElements();
    setupActivityNavigation();
    updateBadgeDisplay();
}

function setupEventListeners() {
    setupGameEventListeners();
    setupQuizEventListeners();
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// USER PROGRESS SYSTEM
// ========================================
function loadUserProgress() {
    // In a real app, this would load from localStorage
    // For now, we'll start fresh each session
    updateBadgeDisplay();
}

function updateBadgeDisplay() {
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach(badge => {
        const badgeType = badge.getAttribute('data-badge');
        if (userProgress.badges[badgeType]) {
            badge.classList.remove('locked');
            badge.classList.add('earned');
        }
    });
}

function earnBadge(badgeType) {
    if (!userProgress.badges[badgeType]) {
        userProgress.badges[badgeType] = true;
        updateBadgeDisplay();
        showBadgeEarned(badgeType);
        playSound('success');
        createConfetti();
    }
}

function showBadgeEarned(badgeType) {
    const badgeNames = {
        learner: 'Pembelajar Hebat',
        gamer: 'Master Game',
        genius: 'Jenius Kuis',
        hero: 'Pahlawan Digital'
    };
    
    const announcement = document.createElement('div');
    announcement.className = 'badge-announcement';
    announcement.innerHTML = `
        <div class="announcement-content">
            <div class="announcement-icon">🏅</div>
            <h3>Badge Baru!</h3>
            <p>Kamu mendapat badge "${badgeNames[badgeType]}"</p>
        </div>
    `;
    
    announcement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border: 3px solid #f59e0b;
        border-radius: 25px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: badgePopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 3000);
}

// ========================================
// NAVIGATION SYSTEM
// ========================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
            updateActiveNavLink(this);
        });
    });
}

function setupActivityNavigation() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                navigateToPage(targetPage);
                updateActiveNavLink(document.querySelector(`[data-page="${targetPage}"]`));
            }
        });
    });
}

function navigateToPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page with animation
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
            targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    currentPage = pageId;
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// ========================================
// ACCORDION FUNCTIONALITY
// ========================================
function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other accordions in the same container
            const parentAccordion = this.closest('.accordion');
            const allHeaders = parentAccordion.querySelectorAll('.accordion-header');
            const allPanels = parentAccordion.querySelectorAll('.accordion-panel');
            
            allHeaders.forEach(h => h.classList.remove('active'));
            allPanels.forEach(p => p.classList.remove('active'));
            
            // Toggle current accordion
            if (!isActive) {
                this.classList.add('active');
                panel.classList.add('active');
                playSound('correct');
                
                // Check if user has read some material (simple progress tracking)
                setTimeout(() => {
                    if (!userProgress.badges.learner && Math.random() > 0.7) {
                        earnBadge('learner');
                    }
                }, 2000);
                
                // Add scroll to view with offset
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    });
}

// ========================================
// ENHANCED GAME DATA & FUNCTIONALITY
// ========================================
function setupGameData() {
    gameQuestions = {
        easy: [
            // Digital Citizenship Questions
            {
                scenario: "Temanmu mengirim foto yang memalukan tentang teman lain di grup chat sekolah.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.school,
                thought: "Wah, ini foto yang memalukan. Aku harus bagaimana ya?",
                choices: [
                    { text: "Ikut menertawakan foto tersebut", correct: false, emoji: "😂" },
                    { text: "Meminta temanmu untuk menghapus foto itu", correct: true, emoji: "🛡️" },
                    { text: "Menyimpan foto itu untuk dirimu sendiri", correct: false, emoji: "📱" },
                    { text: "Mengabaikannya saja", correct: false, emoji: "🙈" }
                ],
                explanation: "Meminta menghapus foto yang memalukan adalah tindakan yang benar untuk melindungi privasi teman. Kamu sudah bertindak sebagai pahlawan digital! 🦸‍♂️",
                correctFeedback: "Hebat! Kamu melindungi privasi temanmu! 🌟",
                wrongFeedback: "Ups! Ingat, kita harus melindungi privasi teman kita ya! 💙"
            },
            {
                scenario: "Kamu mendapat pesan dari orang yang tidak kamu kenal yang meminta alamat rumahmu.",
                character: characterAvatars.girl,
                background: sceneryBackgrounds.phone,
                thought: "Siapa ya orang ini? Aman nggak ya kasih alamat?",
                choices: [
                    { text: "Memberikan alamat karena dia terlihat baik", correct: false, emoji: "🏠" },
                    { text: "Tidak memberikan dan memberitahu orang tua", correct: true, emoji: "🚨" },
                    { text: "Memberikan alamat sekolah saja", correct: false, emoji: "🏫" },
                    { text: "Membalas dengan foto rumah", correct: false, emoji: "📸" }
                ],
                explanation: "Jangan pernah berikan informasi pribadi kepada orang asing! Selalu beritahu orang tua jika ada yang meminta info pribadi. 👨‍👩‍👧‍👦",
                correctFeedback: "Pintar! Kamu menjaga keamanan diri dengan baik! 🛡️",
                wrongFeedback: "Hati-hati! Jangan berikan info pribadi ke orang asing ya! ⚠️"
            },
            {
                scenario: "Di grup kelas, ada teman yang sering diejek karena nilai jelek.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.school,
                thought: "Kasihan temanku diejek terus. Aku harus membantu!",
                choices: [
                    { text: "Ikut mengejek agar tidak dijauhi teman", correct: false, emoji: "😈" },
                    { text: "Membela dan menghibur teman yang diejek", correct: true, emoji: "🤝" },
                    { text: "Diam saja karena takut", correct: false, emoji: "🤐" },
                    { text: "Keluar dari grup kelas", correct: false, emoji: "🚪" }
                ],
                explanation: "Menjadi upstander yang membela teman adalah tindakan heroik! Kamu membuat perbedaan positif! ✨",
                correctFeedback: "Luar biasa! Kamu pahlawan sejati! 🦸‍♀️",
                wrongFeedback: "Ingat, kita harus berani membela yang benar! 💪"
            },
            // Healthy Lifestyle Questions
            {
                scenario: "Kamu bangun pagi dan merasa lapar. Ibu sudah menyiapkan sarapan dengan nasi, sayur bayam, telur, dan pisang.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.home,
                thought: "Wah, sarapannya lengkap banget! Tapi aku maunya makan roti dan permen saja...",
                choices: [
                    { text: "Makan sarapan lengkap yang disiapkan ibu", correct: true, emoji: "🍽️" },
                    { text: "Makan roti dan permen saja", correct: false, emoji: "🍞" },
                    { text: "Tidak sarapan karena terburu-buru", correct: false, emoji: "⏰" },
                    { text: "Minum susu saja", correct: false, emoji: "🥛" }
                ],
                explanation: "Sarapan dengan menu lengkap (nasi, sayur, lauk, buah) memberikan energi dan nutrisi yang dibutuhkan tubuh untuk aktivitas seharian! 🌟",
                correctFeedback: "Hebat! Kamu sudah makan sehat dan bergizi! 💪",
                wrongFeedback: "Ingat, tubuh butuh makanan bergizi untuk tumbuh kuat! 🥗"
            },
            {
                scenario: "Setelah bermain di taman, tanganmu kotor dan kamu mau makan camilan.",
                character: characterAvatars.girl,
                background: sceneryBackgrounds.park,
                thought: "Aku lapar nih... tapi tangan kotor. Gimana ya?",
                choices: [
                    { text: "Langsung makan saja, nanti cuci tangan", correct: false, emoji: "🍪" },
                    { text: "Cuci tangan dulu dengan 6 langkah yang benar", correct: true, emoji: "🧼" },
                    { text: "Lap tangan pakai tisu saja", correct: false, emoji: "🧻" },
                    { text: "Minta teman yang bersih untuk menyuapi", correct: false, emoji: "🤝" }
                ],
                explanation: "Cuci tangan dengan 6 langkah yang benar penting untuk mencegah kuman masuk ke tubuh! Jaga kebersihan untuk kesehatan! 🦠",
                correctFeedback: "Pintar! Kamu menjaga kebersihan dengan baik! ✨",
                wrongFeedback: "Jangan lupa cuci tangan dulu sebelum makan ya! 🚿"
            },
            {
                scenario: "Jam sudah menunjukkan pukul 21.00 malam, tapi kamu masih ingin bermain game di tablet.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.bedroom,
                thought: "Gamenya seru banget! Tapi aku juga ngantuk... tidur atau main ya?",
                choices: [
                    { text: "Tidur karena sudah waktunya istirahat", correct: true, emoji: "😴" },
                    { text: "Main game sampai larut malam", correct: false, emoji: "🎮" },
                    { text: "Tidur sambil pegang tablet", correct: false, emoji: "📱" },
                    { text: "Minta izin begadang ke orang tua", correct: false, emoji: "🙋‍♂️" }
                ],
                explanation: "Anak-anak butuh tidur 8-10 jam untuk pertumbuhan dan konsentrasi belajar. Tidur cukup = tubuh kuat dan otak cerdas! 🧠",
                correctFeedback: "Bagus! Kamu tahu pentingnya istirahat cukup! 🌙",
                wrongFeedback: "Tubuh butuh istirahat cukup untuk tumbuh kuat ya! 💤"
            }
        ],
        medium: [
            // Digital Citizenship Questions
            {
                scenario: "Kamu melihat berita heboh di media sosial tentang guru di sekolahmu yang katanya melakukan hal buruk.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.computer,
                thought: "Benarkah ini? Atau cuma gosip? Aku bingung...",
                choices: [
                    { text: "Langsung membagikan ke semua teman", correct: false, emoji: "📤" },
                    { text: "Mengecek kebenaran berita dan bertanya pada orang tua", correct: true, emoji: "🔍" },
                    { text: "Menambahkan komentar pedas", correct: false, emoji: "💢" },
                    { text: "Membuat berita versi sendiri yang lebih heboh", correct: false, emoji: "📝" }
                ],
                explanation: "Selalu cek kebenaran berita sebelum membagikannya! Hoaks bisa merugikan banyak orang dan merusak reputasi seseorang. 🕵️‍♂️",
                correctFeedback: "Hebat! Kamu jadi detektif hoaks yang handal! 🕵️",
                wrongFeedback: "Hati-hati dengan hoaks! Selalu cek dulu kebenarannya! 📋"
            },
            {
                scenario: "Ada teman sekelas yang foto dan video pribadinya tersebar di grup tanpa izin, dan dia menangis.",
                character: characterAvatars.girl,
                background: sceneryBackgrounds.school,
                thought: "Temanku pasti sedih banget... Aku harus bantu dia!",
                choices: [
                    { text: "Ikut melihat dan menyimpan foto tersebut", correct: false, emoji: "👀" },
                    { text: "Menghibur teman dan membantu melaporkan ke guru", correct: true, emoji: "🤗" },
                    { text: "Menertawakan karena itu lucu", correct: false, emoji: "😂" },
                    { text: "Mengabaikan karena bukan urusanku", correct: false, emoji: "🙄" }
                ],
                explanation: "Penyebaran foto/video tanpa izin adalah bentuk cyberbullying yang serius. Selalu bantu korban dan laporkan! 🚨",
                correctFeedback: "Kamu teman sejati yang peduli! 💕",
                wrongFeedback: "Ingat, kita harus membantu teman yang dalam masalah! 🫂"
            },
            {
                scenario: "Seseorang di internet mengancam akan datang ke sekolahmu dan menyakiti temanmu.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.phone,
                thought: "Ini ancaman serius! Aku harus cepat bertindak!",
                choices: [
                    { text: "Menantang balik orang tersebut", correct: false, emoji: "⚔️" },
                    { text: "Segera screenshot dan laporkan ke guru dan polisi", correct: true, emoji: "📸" },
                    { text: "Mencari tahu identitas orang tersebut sendiri", correct: false, emoji: "🔍" },
                    { text: "Memberitahu temanku untuk berhati-hati", correct: false, emoji: "⚠️" }
                ],
                explanation: "Ancaman kekerasan adalah hal serius yang harus dilaporkan segera ke pihak berwajib. Jangan tangani sendiri! 👮‍♂️",
                correctFeedback: "Tepat sekali! Kamu bertindak cepat dan tepat! 🎯",
                wrongFeedback: "Ancaman serius harus dilaporkan ke pihak berwajib! 🚨"
            },
            // Healthy Lifestyle Questions
            {
                scenario: "Di kantin sekolah, kamu punya uang untuk membeli minum. Ada air putih, jus buah, dan minuman bersoda.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.school,
                thought: "Haus banget nih... minuman mana ya yang paling baik buat tubuhku?",
                choices: [
                    { text: "Membeli minuman bersoda karena segar", correct: false, emoji: "🥤" },
                    { text: "Membeli air putih untuk memenuhi kebutuhan cairan", correct: true, emoji: "💧" },
                    { text: "Membeli jus buah dengan banyak gula tambahan", correct: false, emoji: "🧃" },
                    { text: "Tidak membeli apa-apa karena menghemat uang", correct: false, emoji: "💰" }
                ],
                explanation: "Air putih adalah minuman terbaik untuk tubuh! Kita butuh 6-8 gelas per hari untuk menjaga tubuh tetap sehat dan terhidrasi. 💦",
                correctFeedback: "Pilihan tepat! Air putih adalah yang terbaik! 👍",
                wrongFeedback: "Tubuh butuh air putih yang cukup setiap hari! 🚰"
            },
            {
                scenario: "Temanmu mengajak untuk bolos olahraga dan duduk-duduk saja di kantin.",
                character: characterAvatars.friend,
                background: sceneryBackgrounds.school,
                thought: "Olahraga memang capek... tapi kata guru penting untuk kesehatan...",
                choices: [
                    { text: "Ikut bolos karena olahraga capek", correct: false, emoji: "😓" },
                    { text: "Tetap ikut olahraga dan mengajak teman", correct: true, emoji: "🏃‍♂️" },
                    { text: "Bolos tapi olahraga sendiri di rumah nanti", correct: false, emoji: "🏠" },
                    { text: "Ikut bolos tapi duduk di lapangan", correct: false, emoji: "🪑" }
                ],
                explanation: "Olahraga seperti lari, lompat tali, dan bersepeda penting untuk menjaga tubuh tetap kuat dan sehat. Jangan malas berolahraga! 💪",
                correctFeedback: "Hebat! Kamu rajin berolahraga untuk kesehatan! 🏆",
                wrongFeedback: "Olahraga penting untuk tubuh yang kuat dan sehat! 🤸‍♀️"
            },
            {
                scenario: "Kamu merasa marah karena kalah main game, dan ingin membentak adikmu yang lewat.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.home,
                thought: "Kesel banget! Pengen marah-marah... tapi itu tidak baik ya?",
                choices: [
                    { text: "Membentak adik untuk melampiaskan kesal", correct: false, emoji: "😡" },
                    { text: "Menarik nafas dalam dan menenangkan diri", correct: true, emoji: "🧘‍♂️" },
                    { text: "Membanting controller game", correct: false, emoji: "🎮" },
                    { text: "Mengunci diri di kamar sambil berteriak", correct: false, emoji: "🚪" }
                ],
                explanation: "Mengelola emosi adalah bagian penting dari hidup sehat! Tenang saat marah dan sabar saat menunggu membuat hidup lebih bahagia. 😊",
                correctFeedback: "Luar biasa! Kamu bisa mengelola emosi dengan baik! 🌈",
                wrongFeedback: "Belajar tenang saat marah itu penting untuk hidup sehat! 🕯️"
            }
        ],
        hard: [
            {
                scenario: "Kamu sudah bermain gadget selama 4 jam berturut-turut, mata mulai perih, tapi game yang dimainkan sangat seru dan hampir menang.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.computer,
                thought: "Mata udah perih dan pusing... tapi bentar lagi menang nih! Gimana dong?",
                choices: [
                    { text: "Terus bermain sampai menang meski mata perih", correct: false, emoji: "😵" },
                    { text: "Berhenti sejenak, istirahat mata, dan batasi waktu bermain", correct: true, emoji: "⏰" },
                    { text: "Pakai kacamata anti radiasi dan lanjut main", correct: false, emoji: "👓" },
                    { text: "Bermain dengan mata setengah terpejam", correct: false, emoji: "😑" }
                ],
                explanation: "Membatasi waktu bermain gadget dan menonton TV sangat penting untuk kesehatan mata dan postur tubuh. Keseimbangan adalah kunci hidup sehat! ⚖️",
                correctFeedback: "Bijak sekali! Kamu tahu kapan harus berhenti! 🎯",
                wrongFeedback: "Kesehatan mata lebih penting dari game apapun! 👀"
            },
            {
                scenario: "Kamu ingin ikut tim basket sekolah, tapi harus bangun pagi untuk latihan dan mengatur waktu belajar dengan disiplin.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.school,
                thought: "Pengen banget masuk tim basket... tapi harus disiplin banget nih. Mampu nggak ya aku?",
                choices: [
                    { text: "Tidak ikut karena terlalu repot", correct: false, emoji: "😔" },
                    { text: "Ikut dan berkomitmen hidup disiplin", correct: true, emoji: "📅" },
                    { text: "Ikut tapi kalau malas ya tidak latihan", correct: false, emoji: "🤷‍♂️" },
                    { text: "Coba dulu seminggu, kalau capek berhenti", correct: false, emoji: "📆" }
                ],
                explanation: "Disiplin dalam berbagai hal adalah bagian penting dari perilaku positif dan hidup sehat. Komitmen dan konsistensi membentuk karakter kuat! 🏅",
                correctFeedback: "Mentalitas juara! Disiplin membuat impianmu tercapai! 🌟",
                wrongFeedback: "Disiplin adalah kunci mencapai tujuan hidup sehat! 🗝️"
            },
            {
                scenario: "Orang tuamu meminta bantuanmu membereskan rumah, tapi kamu lelah setelah belajar seharian dan ingin istirahat.",
                character: characterAvatars.student,
                background: sceneryBackgrounds.home,
                thought: "Capek banget... pengen istirahat. Tapi orang tua butuh bantuan nih...",
                choices: [
                    { text: "Menolak karena sudah capek belajar", correct: false, emoji: "😪" },
                    { text: "Membantu dengan senang hati sebagai bentuk tolong menolong", correct: true, emoji: "🤝" },
                    { text: "Pura-pura tidur agar tidak diminta bantuan", correct: false, emoji: "😴" },
                    { text: "Membantu sambil menggerutu dan malas-malasan", correct: false, emoji: "😤" }
                ],
                explanation: "Perilaku positif seperti tolong menolong, saling menghormati, dan tidak berkata kasar adalah bagian dari hidup sehat secara mental dan sosial! 💙",
                correctFeedback: "Hati yang baik! Tolong menolong membuat hidup indah! ✨",
                wrongFeedback: "Tolong menolong adalah perilaku positif yang menyehatkan jiwa! 🫶"
            }
        ]
    };
}

function setupGameEventListeners() {
    // Level selection
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            startGameLevel(level);
        });
    });
}

function startGameLevel(level) {
    currentGameLevel = level;
    currentQuestionIndex = 0;
    gameScore = 0;
    gameAnswered = false;
    
    const gameMenu = document.getElementById('game-menu');
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    if (gameMenu) gameMenu.classList.add('hidden');
    if (gameArea) gameArea.classList.remove('hidden');
    if (gameResult) gameResult.classList.add('hidden');
    
    displayGameQuestion();
}

function displayGameQuestion() {
    const questions = gameQuestions[currentGameLevel];
    if (currentQuestionIndex >= questions.length) {
        showGameResult();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update progress
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    const currentQ = document.getElementById('current-q');
    const totalQ = document.getElementById('total-q');
    if (currentQ) currentQ.textContent = currentQuestionIndex + 1;
    if (totalQ) totalQ.textContent = questions.length;
    
    // Update character and scenario
    const scenarioAvatar = document.getElementById('scenario-avatar');
    const characterThought = document.getElementById('character-thought');
    const scenarioBackground = document.getElementById('scenario-background');
    const gameSituation = document.getElementById('game-situation');
    
    if (scenarioAvatar) scenarioAvatar.textContent = question.character;
    if (characterThought) characterThought.textContent = question.thought;
    if (scenarioBackground) scenarioBackground.textContent = question.background;
    if (gameSituation) gameSituation.textContent = question.scenario;
    
    // Create choices
    const choicesEl = document.getElementById('game-choices');
    if (choicesEl) {
        choicesEl.innerHTML = '';
        
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'game-choice';
            button.innerHTML = `
                <span class="choice-emoji">${choice.emoji}</span>
                <span class="choice-text">${choice.text}</span>
            `;
            button.addEventListener('click', () => handleGameAnswer(index, question));
            choicesEl.appendChild(button);
        });
    }
    
    // Hide feedback
    const gameFeedback = document.getElementById('game-feedback');
    if (gameFeedback) gameFeedback.classList.add('hidden');
    gameAnswered = false;
    
    // Animate character
    setTimeout(() => {
        if (scenarioAvatar) {
            scenarioAvatar.style.animation = 'characterThink 2s ease-in-out infinite';
        }
    }, 500);
}

function handleGameAnswer(selectedIndex, question) {
    if (gameAnswered) return;
    
    gameAnswered = true;
    const choiceButtons = document.querySelectorAll('.game-choice');
    const isCorrect = question.choices[selectedIndex].correct;
    
    choiceButtons.forEach((btn, index) => {
        btn.style.pointerEvents = 'none';
        if (index === selectedIndex) {
            if (isCorrect) {
                btn.classList.add('correct');
                gameScore++;
                playSound('correct');
            } else {
                btn.classList.add('wrong');
                playSound('wrong');
            }
        }
        if (question.choices[index].correct && index !== selectedIndex) {
            btn.classList.add('correct');
        }
    });
    
    // Show feedback
    setTimeout(() => {
        showGameFeedback(question, isCorrect);
    }, 1500);
}

function showGameFeedback(question, isCorrect) {
    const feedback = document.getElementById('game-feedback');
    const feedbackEmoji = document.getElementById('feedback-emoji');
    const feedbackText = document.getElementById('feedback-text');
    const nextButton = document.getElementById('next-scenario');
    
    if (!feedback) return;
    
    if (feedbackEmoji) {
        feedbackEmoji.textContent = isCorrect ? '😊' : '😔';
    }
    
    if (feedbackText) {
        if (isCorrect) {
            feedbackText.innerHTML = `
                <div style="color: #059669; font-weight: 700; margin-bottom: 0.5rem;">
                    ${question.correctFeedback}
                </div>
                <div style="color: #374151;">
                    ${question.explanation}
                </div>
            `;
            feedback.style.borderColor = '#10b981';
        } else {
            feedbackText.innerHTML = `
                <div style="color: #dc2626; font-weight: 700; margin-bottom: 0.5rem;">
                    ${question.wrongFeedback}
                </div>
                <div style="color: #374151;">
                    ${question.explanation}
                </div>
            `;
            feedback.style.borderColor = '#ef4444';
        }
    }
    
    if (nextButton) {
        nextButton.textContent = currentQuestionIndex < gameQuestions[currentGameLevel].length - 1 
            ? 'Lanjut Petualangan! ➡️' 
            : 'Lihat Hasil! 🏆';
        
        // Update next button handler
        nextButton.onclick = () => {
            feedback.classList.add('hidden');
            nextGameQuestion();
        };
    }
    
    feedback.classList.remove('hidden');
}

function nextGameQuestion() {
    currentQuestionIndex++;
    displayGameQuestion();
}

function showGameResult() {
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    if (gameArea) gameArea.classList.add('hidden');
    if (!gameResult) return;
    
    gameResult.classList.remove('hidden');
    
    const totalQuestions = gameQuestions[currentGameLevel].length;
    const percentage = Math.round((gameScore / totalQuestions) * 100);
    
    let resultData = getGameResultData(percentage, currentGameLevel);
    
    gameResult.innerHTML = `
        <div class="result-hero">
            <div class="result-character">${resultData.character}</div>
            <div class="result-badge">${resultData.badge}</div>
        </div>
        <h3>${resultData.title}</h3>
        <div class="score-display">
            <div class="score-circle">
                <div class="score-number">${percentage}%</div>
                <div class="score-text">${gameScore}/${totalQuestions}</div>
            </div>
        </div>
        <p>${resultData.message}</p>
        <div class="result-actions">
            <button class="btn btn-success" onclick="restartGameLevel()">
                <span class="btn-icon">🔄</span>
                Main Lagi
            </button>
            <button class="btn btn-warning" onclick="showGameMenu()">
                <span class="btn-icon">🎯</span>
                Pilih Level Lain
            </button>
            <button class="btn btn-primary" onclick="navigateToPage('materi')">
                <span class="btn-icon">📚</span>
                Pelajari Materi
            </button>
        </div>
    `;
    
    // Check for badge earning
    checkGameBadges(percentage, currentGameLevel);
    
    // Add some confetti for good scores
    if (percentage >= 70) {
        setTimeout(createConfetti, 500);
    }
}

function getGameResultData(percentage, level) {
    const levelNames = {
        easy: 'Pemula',
        medium: 'Hebat', 
        hard: 'Master'
    };
    
    if (percentage >= 90) {
        return {
            character: '🏆',
            badge: '👑',
            title: `Pahlawan Digital ${levelNames[level]} Sempurna!`,
            message: `Luar biasa! Kamu menguasai etika digital dengan sempurna! Teruskan semangat menjadi pahlawan digital! ✨`
        };
    } else if (percentage >= 80) {
        return {
            character: '🌟',
            badge: '🎖️',
            title: `Pahlawan Digital ${levelNames[level]} Hebat!`,
            message: `Hebat sekali! Kamu sudah sangat paham tentang sikap digital yang benar. Sedikit lagi jadi sempurna! 🚀`
        };
    } else if (percentage >= 60) {
        return {
            character: '👍',
            badge: '🏅',
            title: `Pahlawan Digital ${levelNames[level]} yang Baik!`,
            message: `Bagus! Kamu di jalan yang benar. Terus belajar untuk menjadi pahlawan digital yang lebih hebat! 💪`
        };
    } else {
        return {
            character: '💪',
            badge: '🎯',
            title: `Calon Pahlawan Digital ${levelNames[level]}!`,
            message: `Jangan menyerah! Setiap pahlawan perlu latihan. Baca materi lagi dan coba lagi! Kamu pasti bisa! 🌟`
        };
    }
}

function checkGameBadges(percentage, level) {
    // Award badges based on performance
    if (percentage >= 80 && level === 'easy' && !userProgress.badges.gamer) {
        earnBadge('gamer');
    }
    
    if (percentage >= 90 && level === 'hard') {
        earnBadge('hero');
    }
    
    // Track completed levels
    if (!userProgress.completedLevels.includes(level)) {
        userProgress.completedLevels.push(level);
    }
}

function restartGameLevel() {
    startGameLevel(currentGameLevel);
}

function showGameMenu() {
    const gameMenu = document.getElementById('game-menu');
    const gameArea = document.getElementById('game-area');
    const gameResult = document.getElementById('game-result');
    
    if (gameArea) gameArea.classList.add('hidden');
    if (gameResult) gameResult.classList.add('hidden');
    if (gameMenu) gameMenu.classList.remove('hidden');
}

// ========================================
// QUIZ DATA AND FUNCTIONALITY - ENHANCED
// ========================================
function setupQuizData() {
    quizQuestions = [
        // Digital Citizenship Questions (from original)
        {
            question: "Apa kepanjangan dari THINK sebelum posting di media sosial?",
            choices: [
                "True, Helpful, Inspiring, Necessary, Kind",
                "Think, Help, Inspire, Nice, Keep",
                "Time, Happy, Internet, New, Knowledge",
                "Trust, Hope, Include, Never, Kindness"
            ],
            correct: 0,
            explanation: "THINK adalah: True (Benar), Helpful (Membantu), Inspiring (Menginspirasi), Necessary (Penting), Kind (Baik). Ini cara mudah mengingat sebelum posting! 📝",
            difficulty: "easy",
            category: "etika"
        },
        {
            question: "Apa yang sebaiknya kamu lakukan jika menerima pesan bullying di media sosial?",
            choices: [
                "Membalas dengan kata-kata yang lebih kasar",
                "Blokir dan laporkan akun pelaku",
                "Mengabaikan dan berharap akan berhenti sendiri",
                "Menangis dan menutup akun media sosial"
            ],
            correct: 1,
            explanation: "Blokir dan laporkan adalah cara terbaik mengatasi cyberbullying dengan aman dan efektif. Jangan biarkan bully menang! 🛡️",
            difficulty: "easy",
            category: "safety"
        },
        {
            question: "Informasi pribadi mana yang TIDAK boleh dibagikan di internet?",
            choices: [
                "Hobi dan minat",
                "Alamat rumah dan nomor telepon",
                "Makanan favorit",
                "Film yang disukai"
            ],
            correct: 1,
            explanation: "Alamat rumah dan nomor telepon adalah informasi pribadi yang bisa membahayakan keamananmu jika dibagikan ke orang asing! 🔒",
            difficulty: "easy",
            category: "privacy"
        },
        {
            question: "Apa yang dimaksud dengan hoaks?",
            choices: [
                "Berita yang sangat menarik",
                "Informasi atau berita bohong yang disebarkan",
                "Berita yang memiliki banyak gambar",
                "Informasi yang dibagikan oleh influencer"
            ],
            correct: 1,
            explanation: "Hoaks adalah informasi atau berita bohong yang sengaja disebarkan untuk menyesatkan orang. Jadi detektif hoaks yang handal! 🕵️‍♂️",
            difficulty: "easy",
            category: "literacy"
        },
        {
            question: "Sikap apa yang harus ditunjukkan saat melihat teman dibully?",
            choices: [
                "Ikut mem-bully agar tidak jadi target",
                "Menjadi upstander dan membela korban",
                "Mengabaikan karena bukan urusan kita",
                "Mentertawakan karena itu lucu"
            ],
            correct: 1,
            explanation: "Menjadi upstander berarti berani membela korban bullying dan melaporkan kejadian tersebut. Kamu bisa jadi pahlawan! 🦸‍♀️",
            difficulty: "medium",
            category: "anti-bullying"
        },
        {
            question: "Mengapa kita harus menghargai perbedaan di media sosial?",
            choices: [
                "Agar terlihat baik saja",
                "Karena perbedaan membuat dunia lebih berwarna dan kaya",
                "Supaya tidak dikucilkan",
                "Karena itu adalah aturan media sosial"
            ],
            correct: 1,
            explanation: "Menghargai perbedaan penting karena keberagaman membuat dunia lebih indah dan setiap orang berharga apa adanya! 🌈",
            difficulty: "medium",
            category: "empathy"
        },
        {
            question: "Bagaimana cara terbaik menghadapi konten negatif atau toxic di internet?",
            choices: [
                "Ikut membuat konten serupa",
                "Tidak berinteraksi dan laporkan jika perlu",
                "Membagikan ke teman-teman",
                "Memberikan komentar negatif balik"
            ],
            correct: 1,
            explanation: "Jangan beri perhatian pada konten toxic! Lebih baik fokus pada konten positif dan laporkan jika berbahaya. 🚫",
            difficulty: "medium",
            category: "wellbeing"
        },
        {
            question: "Apa yang harus dilakukan jika melihat teman share informasi yang salah (hoaks)?",
            choices: [
                "Ikut membagikan karena dari teman",
                "Mengoreksi dengan sopan dan berikan sumber yang benar",
                "Mengejek temanmu di depan orang lain",
                "Melaporkan temanmu ke guru"
            ],
            correct: 1,
            explanation: "Koreksi dengan sopan dan berikan informasi yang benar. Ini cara baik membantu teman dan melawan hoaks! 🤝",
            difficulty: "hard",
            category: "friendship"
        },
        
        // Healthy Lifestyle Questions (new based on PMM slides)
        {
            question: "Berapa jam tidur yang dibutuhkan anak-anak setiap malam untuk tumbuh sehat?",
            choices: [
                "5-6 jam",
                "8-10 jam",
                "11-12 jam",
                "6-7 jam"
            ],
            correct: 1,
            explanation: "Anak-anak membutuhkan tidur 8-10 jam setiap malam untuk pertumbuhan yang optimal dan konsentrasi belajar yang baik! 😴",
            difficulty: "easy",
            category: "kesehatan"
        },
        {
            question: "Berapa gelas air putih yang sebaiknya diminum setiap hari?",
            choices: [
                "3-4 gelas",
                "6-8 gelas",
                "10-12 gelas",
                "1-2 gelas"
            ],
            correct: 1,
            explanation: "Tubuh kita membutuhkan 6-8 gelas air putih setiap hari untuk menjaga tubuh tetap terhidrasi dan sehat! 💧",
            difficulty: "easy",
            category: "nutrisi"
        },
        {
            question: "Makanan apa saja yang termasuk dalam menu makanan sehat dan bergizi?",
            choices: [
                "Permen, cokelat, dan kue",
                "Nasi, sayur, lauk (ikan/telur/ayam), dan buah",
                "Fast food dan minuman bersoda",
                "Keripik dan biskuit"
            ],
            correct: 1,
            explanation: "Menu sehat terdiri dari nasi, sayur, lauk seperti ikan/telur/ayam, dan buah untuk memberikan nutrisi lengkap! 🍽️",
            difficulty: "easy",
            category: "nutrisi"
        },
        {
            question: "Mengapa kita harus rajin mencuci tangan dengan 6 langkah yang benar?",
            choices: [
                "Agar tangan terlihat bersih",
                "Untuk mencegah kuman masuk ke tubuh",
                "Supaya orang tua tidak marah",
                "Karena itu aturan sekolah"
            ],
            correct: 1,
            explanation: "Mencuci tangan dengan 6 langkah yang benar penting untuk mencegah kuman dan penyakit masuk ke tubuh kita! 🧼",
            difficulty: "easy",
            category: "kebersihan"
        },
        {
            question: "Apa saja contoh olahraga yang baik untuk menjaga kesehatan tubuh?",
            choices: [
                "Bermain game online seharian",
                "Lari, lompat tali, dan bersepeda",
                "Menonton TV sambil tiduran",
                "Duduk di depan komputer"
            ],
            correct: 1,
            explanation: "Olahraga seperti lari, lompat tali, dan bersepeda membantu menjaga tubuh tetap kuat, sehat, dan bugar! 🏃‍♂️",
            difficulty: "medium",
            category: "olahraga"
        },
        {
            question: "Bagaimana cara mengelola emosi yang baik saat merasa marah?",
            choices: [
                "Berteriak dan memukul benda di sekitar",
                "Menarik nafas dalam dan menenangkan diri",
                "Mengabaikan perasaan marah",
                "Menyalahkan orang lain"
            ],
            correct: 1,
            explanation: "Mengelola emosi dengan menarik nafas dalam dan menenangkan diri adalah perilaku positif yang menyehatkan mental! 🧘‍♂️",
            difficulty: "medium",
            category: "mental"
        },
        {
            question: "Mengapa penting membatasi waktu bermain gadget dan menonton TV?",
            choices: [
                "Karena orang tua melarang",
                "Untuk menjaga kesehatan mata dan postur tubuh",
                "Supaya tidak ketinggalan pelajaran",
                "Agar tidak bosan"
            ],
            correct: 1,
            explanation: "Membatasi waktu screen time penting untuk menjaga kesehatan mata, postur tubuh, dan keseimbangan aktivitas fisik! 👀",
            difficulty: "medium",
            category: "kebiasaan"
        },
        {
            question: "Apa yang termasuk perilaku positif dalam kehidupan sehari-hari?",
            choices: [
                "Saling menghormati, tolong menolong, dan berkata sopan",
                "Mementingkan diri sendiri saja",
                "Selalu menuntut dilayani orang lain",
                "Berkata kasar jika tidak dituruti"
            ],
            correct: 0,
            explanation: "Perilaku positif seperti saling menghormati, tolong menolong, dan tidak berkata kasar membuat hidup lebih bahagia dan sehat secara mental! 🤝",
            difficulty: "medium",
            category: "karakter"
        },
        {
            question: "Bagaimana cara menjaga kebersihan diri yang baik setiap hari?",
            choices: [
                "Mandi seminggu sekali",
                "Mandi dua kali sehari dan rajin mencuci tangan",
                "Hanya mencuci muka saja",
                "Mandi jika merasa kotor saja"
            ],
            correct: 1,
            explanation: "Menjaga kebersihan dengan mandi dua kali sehari dan rajin mencuci tangan sangat penting untuk kesehatan dan mencegah penyakit! 🚿",
            difficulty: "hard",
            category: "kebersihan"
        },
        {
            question: "Apa manfaat utama menerapkan pola hidup sehat secara konsisten?",
            choices: [
                "Agar terlihat keren di depan teman",
                "Supaya tidak mudah sakit, tubuh kuat, energi banyak, dan bisa belajar dengan semangat",
                "Untuk menghemat uang jajan",
                "Supaya dipuji guru dan orang tua"
            ],
            correct: 1,
            explanation: "Pola hidup sehat membuat kita tidak mudah sakit, tubuh tumbuh kuat dan cerdas, energi tetap banyak, dan bisa belajar serta bermain dengan semangat! 🌟",
            difficulty: "hard",
            category: "motivasi"
        }
    ];
}

function setupQuizEventListeners() {
    const startKuisBtn = document.getElementById('start-kuis-btn');
    if (startKuisBtn) {
        startKuisBtn.addEventListener('click', startQuiz);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    
    const kuisIntro = document.querySelector('.kuis-intro');
    const startBtn = document.getElementById('start-kuis-btn');
    const kuisArea = document.getElementById('kuis-area');
    const kuisResult = document.getElementById('kuis-result');
    
    if (kuisIntro) kuisIntro.classList.add('hidden');
    if (startBtn) startBtn.classList.add('hidden');
    if (kuisArea) kuisArea.classList.remove('hidden');
    if (kuisResult) kuisResult.classList.add('hidden');
    
    setupProgressDots();
    displayQuizQuestion();
}

function setupProgressDots() {
    const progressDots = document.querySelector('.progress-dots');
    if (progressDots) {
        progressDots.innerHTML = '';
        for (let i = 0; i < quizQuestions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) dot.classList.add('active');
            progressDots.appendChild(dot);
        }
    }
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index < currentQuestionIndex) {
            dot.classList.remove('active');
            dot.classList.add('completed');
        } else if (index === currentQuestionIndex) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
}

function displayQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    
    // Update question number
    const qNum = document.getElementById('q-num');
    if (qNum) qNum.textContent = currentQuestionIndex + 1;
    
    // Update progress dots
    updateProgressDots();
    
    // Display question
    const questionEl = document.getElementById('kuis-question');
    if (questionEl) questionEl.textContent = question.question;
    
    // Create choices
    const choicesEl = document.getElementById('kuis-choices');
    if (choicesEl) {
        choicesEl.innerHTML = '';
        
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice;
            button.addEventListener('click', () => handleQuizAnswer(index, question));
            choicesEl.appendChild(button);
        });
    }
    
    // Clear feedback
    const feedback = document.getElementById('kuis-feedback');
    if (feedback) {
        feedback.innerHTML = '';
        feedback.className = 'feedback';
    }
    
    quizAnswered = false;
}

function handleQuizAnswer(selectedIndex, question) {
    if (quizAnswered) return;
    
    quizAnswered = true;
    const choiceButtons = document.querySelectorAll('.choice-btn');
    const feedback = document.getElementById('kuis-feedback');
    const isCorrect = selectedIndex === question.correct;
    
    // Disable all buttons and show correct/wrong styling
    choiceButtons.forEach((btn, index) => {
        btn.style.pointerEvents = 'none';
        if (index === selectedIndex) {
            if (isCorrect) {
                btn.classList.add('correct');
                quizScore++;
                playSound('correct');
            } else {
                btn.classList.add('wrong');
                playSound('wrong');
            }
        }
        if (index === question.correct && index !== selectedIndex) {
            btn.classList.add('correct');
        }
    });
    
    // Show feedback
    if (feedback) {
        if (isCorrect) {
            feedback.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">🎉</div>
                    <p><strong>Benar sekali!</strong></p>
                    <p>${question.explanation}</p>
                </div>
            `;
            feedback.className = 'feedback positive';
        } else {
            feedback.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon">💡</div>
                    <p><strong>Ups, belum tepat!</strong></p>
                    <p>${question.explanation}</p>
                </div>
            `;
            feedback.className = 'feedback negative';
        }
    }
    
    // Show next button after delay
    setTimeout(() => {
        if (feedback) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-primary';
            nextBtn.innerHTML = currentQuestionIndex < quizQuestions.length - 1 
                ? '<span class="btn-icon">➡️</span> Pertanyaan Selanjutnya'
                : '<span class="btn-icon">🏆</span> Lihat Hasil';
            
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                displayQuizQuestion();
            });
            
            feedback.appendChild(nextBtn);
        }
    }, 1500);
}

function showQuizResult() {
    const kuisArea = document.getElementById('kuis-area');
    const kuisResult = document.getElementById('kuis-result');
    
    if (kuisArea) kuisArea.classList.add('hidden');
    if (!kuisResult) return;
    
    kuisResult.classList.remove('hidden');
    
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((quizScore / totalQuestions) * 100);
    
    let resultData = getQuizResultData(percentage);
    
    kuisResult.innerHTML = `
        <div class="result-hero">
            <div class="result-character">${resultData.character}</div>
            <div class="result-badge">${resultData.badge}</div>
        </div>
        <h3>${resultData.title}</h3>
        <div class="score-display">
            <div class="score-circle" style="background: conic-gradient(#10b981 ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg);">
                <div class="score-inner">
                    <div class="score-number">${percentage}%</div>
                    <div class="score-text">${quizScore}/${totalQuestions} Benar</div>
                </div>
            </div>
        </div>
        <p>${resultData.message}</p>
        <div class="result-actions">
            <button class="btn btn-success" onclick="restartQuiz()">
                <span class="btn-icon">🔄</span>
                Coba Lagi
            </button>
            <button class="btn btn-warning" onclick="navigateToPage('materi')">
                <span class="btn-icon">📚</span>
                Pelajari Materi
            </button>
            <button class="btn btn-primary" onclick="navigateToPage('game')">
                <span class="btn-icon">🎮</span>
                Main Game
            </button>
        </div>
    `;
    
    // Add CSS for score circle
    const style = document.createElement('style');
    style.textContent = `
        .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2rem auto;
            position: relative;
        }
        .score-inner {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .score-number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            line-height: 1;
        }
        .score-text {
            font-size: 0.9rem;
            color: var(--text-light);
            font-weight: 600;
        }
        .result-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
    `;
    document.head.appendChild(style);
    
    // Check for badge earning
    checkQuizBadges(percentage);
    
    // Add confetti for good scores
    if (percentage >= 80) {
        setTimeout(createConfetti, 500);
    }
}

function getQuizResultData(percentage) {
    if (percentage >= 90) {
        return {
            character: '🧠',
            badge: '👑',
            title: 'Jenius Digital Sejati!',
            message: 'Luar biasa! Kamu benar-benar menguasai etika digital! Kamu layak jadi mentor untuk teman-teman lainnya! ✨'
        };
    } else if (percentage >= 80) {
        return {
            character: '🌟',
            badge: '🎖️',
            title: 'Pakar Digital Muda!',
            message: 'Hebat sekali! Pengetahuan digitalmu sudah sangat baik. Terus pertahankan dan bagikan ilmumu! 🚀'
        };
    } else if (percentage >= 60) {
        return {
            character: '👍',
            badge: '🏅',
            title: 'Pembelajar Digital yang Baik!',
            message: 'Bagus! Kamu sudah paham banyak hal tentang dunia digital. Terus belajar untuk jadi lebih hebat! 💪'
        };
    } else {
        return {
            character: '📚',
            badge: '🎯',
            title: 'Calon Ahli Digital!',
            message: 'Tidak apa-apa! Setiap ahli pernah memulai dari nol. Baca materi lagi dan coba kembali. Kamu pasti bisa! 🌟'
        };
    }
}

function checkQuizBadges(percentage) {
    if (percentage >= 80 && !userProgress.badges.genius) {
        earnBadge('genius');
    }
}

function restartQuiz() {
    const kuisIntro = document.querySelector('.kuis-intro');
    const startBtn = document.getElementById('start-kuis-btn');
    const kuisArea = document.getElementById('kuis-area');
    const kuisResult = document.getElementById('kuis-result');
    
    if (kuisIntro) kuisIntro.classList.remove('hidden');
    if (startBtn) startBtn.classList.remove('hidden');
    if (kuisArea) kuisArea.classList.add('hidden');
    if (kuisResult) kuisResult.classList.add('hidden');
}

// ========================================
// SOUND SYSTEM
// ========================================
function playSound(type) {
    try {
        let audio;
        switch(type) {
            case 'correct':
                audio = document.getElementById('correct-sound');
                break;
            case 'wrong':
                audio = document.getElementById('wrong-sound');
                break;
            case 'success':
                audio = document.getElementById('success-sound');
                break;
        }
        
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Silently handle audio play errors
            });
        }
    } catch (error) {
        // Silently handle errors
    }
}

// ========================================
// VISUAL EFFECTS
// ========================================
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    
    for (let i = 0; i < 50; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        z-index: 10000;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { 
            transform: `translateY(0) rotate(0deg)`,
            opacity: 1
        },
        { 
            transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    };
}

function createFloatingElements() {
    const container = document.querySelector('.floating-shapes');
    if (!container) return;
    
    const shapes = ['⭐', '🌟', '✨', '💎', '🎈', '🦄', '🌙', '☁️'];
    
    shapes.forEach((shape, index) => {
        const element = document.createElement('div');
        element.className = `shape shape-${index + 1}`;
        element.textContent = shape;
        element.style.cssText = `
            position: absolute;
            font-size: 2rem;
            opacity: 0.8;
            animation: floatShape 6s ease-in-out infinite;
            animation-delay: ${index * 0.5}s;
        `;
        
        // Random positioning
        element.style.top = Math.random() * 80 + '%';
        element.style.left = Math.random() * 80 + '%';
        
        container.appendChild(element);
    });
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            } else {
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe animated elements
    document.querySelectorAll('.mission-card, .level-card, .badge-item').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================
document.addEventListener('keydown', function(e) {
    // Allow keyboard navigation for accessibility
    if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused && (focused.classList.contains('nav-link') || 
                       focused.classList.contains('choice-btn') || 
                       focused.classList.contains('game-choice') ||
                       focused.classList.contains('level-card'))) {
            e.preventDefault();
            focused.click();
        }
    }
    
    // Arrow key navigation for quiz and game choices
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const choices = document.querySelectorAll('.choice-btn:not([style*="pointer-events: none"]), .game-choice:not([style*="pointer-events: none"])');
        if (choices.length > 0) {
            e.preventDefault();
            const current = document.activeElement;
            let currentIndex = Array.from(choices).indexOf(current);
            
            if (e.key === 'ArrowUp') {
                currentIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
            } else {
                currentIndex = currentIndex >= choices.length - 1 ? 0 : currentIndex + 1;
            }
            
            choices[currentIndex].focus();
        }
    }
});

// ========================================
// RESPONSIVE BEHAVIOR
// ========================================
function handleResize() {
    // Adjust layout for mobile devices
    const isMobile = window.innerWidth <= 768;
    const nav = document.querySelector('nav');
    
    if (isMobile && nav) {
        nav.style.flexDirection = 'column';
        nav.style.gap = '0.5rem';
    } else if (nav) {
        nav.style.flexDirection = 'row';
        nav.style.gap = '0.8rem';
    }
}

window.addEventListener('resize', handleResize);

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced resize handler
const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // Could show user-friendly error message here
});

// ========================================
// FINAL INITIALIZATION
// ========================================
// Ensure all animations respect user preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-bounce', '0.1s ease');
    document.documentElement.style.setProperty('--transition-smooth', '0.1s ease');
    document.documentElement.style.setProperty('--transition-fun', '0.1s ease');
}

// Initialize on load
window.addEventListener('load', function() {
    // Add loaded class for enhanced animations
    document.body.classList.add('loaded');
    
    // Trigger initial resize handler
    handleResize();
    
    // Show welcome message after short delay
    setTimeout(() => {
        announceToScreenReader('Selamat datang di Cerdas di Dunia Digital! Gunakan Tab untuk navigasi dan Enter untuk memilih.');
    }, 1000);
});

// Export functions for global access (for onclick handlers in HTML)
window.restartGameLevel = restartGameLevel;
window.showGameMenu = showGameMenu;
window.navigateToPage = navigateToPage;
window.restartQuiz = restartQuiz;