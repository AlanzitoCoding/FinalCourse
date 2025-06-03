document.addEventListener("DOMContentLoaded", () => {
    // Inicializa todas as funcionalidades
    initStartupPage();
});

function initStartupPage() {
    loadUserData();
    setupModalInteractions();
    setupEnrollmentSystem();
    checkDarkModePreference();
    setupNavigation();
}

// Carrega dados do usuário
function loadUserData() {
    // Simulação de carregamento de dados do usuário
    setTimeout(() => {
        const userName = localStorage.getItem('userName') || 'Empreendedor Startup';
        document.getElementById("user-name").textContent = userName;
        
        // Carrega inscrições existentes
        loadUserEnrollments();
    }, 800);
}

// Configura interações com modais
function setupModalInteractions() {
    // Modal de perfil
    const profileModal = document.getElementById("profile-modal");
    const profileIcon = document.getElementById("profile-icon");
    
    profileIcon.addEventListener('click', () => {
        profileModal.style.display = "flex";
        setTimeout(() => {
            profileModal.classList.add("active");
        }, 10);
    });
    
    // Fechar modal quando clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === profileModal) {
            closeModal(profileModal);
        }
    });
}

// Configura sistema de inscrições
function setupEnrollmentSystem() {
    const enrollmentModal = document.getElementById("enrollment-modal");
    const closeModalBtn = document.querySelector(".close-modal");
    const cancelBtn = document.getElementById("cancel-enrollment");
    
    // Fechar modal de inscrição
    closeModalBtn.addEventListener('click', () => closeModal(enrollmentModal));
    cancelBtn.addEventListener('click', () => closeModal(enrollmentModal));
    
    // Configurar botões de inscrição
    document.querySelectorAll(".btn-primary").forEach(button => {
        if (button.textContent.includes("Inscrever") || button.textContent.includes("Saiba Mais") || button.textContent.includes("Ver")) {
            button.addEventListener("click", function(e) {
                e.preventDefault();
                handleEnrollmentClick(this);
            });
        }
    });
    
    // Fechar modal quando clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === enrollmentModal) {
            closeModal(enrollmentModal);
        }
    });
}

// Manipula clique no botão de inscrição
function handleEnrollmentClick(button) {
    const card = button.closest(".mentor-card, .event-card, .benefit-card");
    
    if (card.classList.contains("enrolled")) {
        showNotification("Você já está inscrito neste item.");
        return;
    }
    
    const title = card.querySelector(".mentor-name, .event-title, .benefit-title")?.textContent || "Item Selecionado";
    const date = card.querySelector(".schedule-slot, .event-date")?.textContent || "";
    
    document.getElementById("modal-title").textContent = `Inscrever-se em ${title}`;
    document.getElementById("modal-message").textContent = 
        `Deseja confirmar sua inscrição${date ? ` para ${date}` : ''}?`;
    
    const confirmBtn = document.getElementById("confirm-enrollment");
    confirmBtn.onclick = () => {
        processEnrollment(card, title, date);
        closeModal(document.getElementById("enrollment-modal"));
    };
    
    openModal(document.getElementById("enrollment-modal"));
}

// Processa a inscrição do usuário
function processEnrollment(card, title, date) {
    // Simulação de chamada à API
    setTimeout(() => {
        card.classList.add("enrolled");
        
        // Atualiza o botão
        const button = card.querySelector(".btn-primary");
        if (button) {
            button.disabled = true;
            button.textContent = "Inscrito";
            button.style.backgroundColor = "var(--success-color)";
            button.style.cursor = "default";
        }
        
        showNotification(`Inscrição confirmada em ${title}${date ? ` para ${date}` : ''}`);
        
        // Salva no localStorage
        saveEnrollment({ title, date, type: getEnrollmentType(card) });
    }, 500);
}

// Retorna o tipo de inscrição baseado no card
function getEnrollmentType(card) {
    if (card.classList.contains("mentor-card")) return "mentoria";
    if (card.classList.contains("event-card")) return "evento";
    if (card.classList.contains("benefit-card")) return "beneficio";
    return "item";
}

// Salva inscrição no localStorage
function saveEnrollment(enrollment) {
    const enrollments = JSON.parse(localStorage.getItem("userEnrollments") || "[]");
    enrollments.push({
        ...enrollment,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem("userEnrollments", JSON.stringify(enrollments));
}

// Carrega inscrições do usuário
function loadUserEnrollments() {
    const enrollments = JSON.parse(localStorage.getItem("userEnrollments") || "[]");
    
    document.querySelectorAll(".mentor-card, .event-card, .benefit-card").forEach(card => {
        const title = card.querySelector(".mentor-name, .event-title, .benefit-title")?.textContent;
        if (!title) return;
        
        const isEnrolled = enrollments.some(item => item.title === title);
        if (isEnrolled) {
            card.classList.add("enrolled");
            const button = card.querySelector(".btn-primary");
            if (button) {
                button.disabled = true;
                button.textContent = "Inscrito";
                button.style.backgroundColor = "var(--success-color)";
                button.style.cursor = "default";
            }
        }
    });
}

// Mostra notificação
function showNotification(message) {
    const toast = document.getElementById("notification-toast");
    const messageEl = document.getElementById("notification-message");
    
    messageEl.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Verifica preferência de dark mode
function checkDarkModePreference() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark || localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
}

// Configura navegação
function setupNavigation() {
    // Botão de voltar
    document.querySelector(".back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        window.history.back();
    });
    
    // Links de navegação
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// Abre modal
function openModal(modal) {
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
}

// Fecha modal
function closeModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}