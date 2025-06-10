document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
    setupEventListeners();
    checkDarkModePreference();
    setupThemeToggle(); // Adicionado nova função
});

// Carregar nome do usuário
function loadUserName() {
    // Simulação de dados do usuário - substitua por chamada real à API
    const mockUser = [{
        alNome: "João Silva",
        userName: "joaosilva",
        alPlano: "empreendedor"
    }];
    
    // Usando mock data temporariamente
    setTimeout(() => {
        const user = mockUser[0];
        if (user.alPlano && user.alPlano.toLowerCase() === 'empreendedor') {
            document.getElementById("user-name").textContent = user.alNome || user.userName || 'Aluno';
            loadUserEnrollments();
        } else {
            document.getElementById("user-name").textContent = 'Apenas para plano Empreendedor';
            // Desativa botões de inscrição se não for plano empreendedor
            document.querySelectorAll(".btn-primary").forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = "0.6";
                btn.style.cursor = "not-allowed";
            });
        }
    }, 800);
    
    // Comente ou remova o fetch original abaixo quando implementar a API real
    /*
    fetch('/userInfo')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const user = data[0];
                if (user.alPlano && user.alPlano.toLowerCase() === 'empreendedor') {
                    document.getElementById("user-name").textContent = user.alNome || user.userName || 'Aluno';
                    loadUserEnrollments();
                } else {
                    document.getElementById("user-name").textContent = 'Apenas para plano Empreendedor';
                }
            } else {
                document.getElementById("user-name").textContent = 'Usuário não encontrado';
            }
        })
        .catch(() => {
            document.getElementById("user-name").textContent = 'Erro ao carregar usuário';
        });
    */
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Modal de perfil
    const modal = document.getElementById("modal");
    const profileIcon = document.getElementById("profile-icon");
    const closeProfileModal = document.querySelector(".modal .close-modal");
    
    profileIcon.onclick = () => {
        modal.style.display = "flex";
        document.querySelector(".modal-content").classList.add("active");
    };
    
    if (closeProfileModal) {
        closeProfileModal.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Modal de inscrição
    const enrollmentModal = document.getElementById("enrollment-modal");
    const closeEnrollmentModal = document.querySelector(".enrollment-modal .close-modal");
    const cancelBtn = document.getElementById("cancel-enrollment");
    
    if (closeEnrollmentModal) {
        closeEnrollmentModal.onclick = () => {
            enrollmentModal.style.display = "none";
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            enrollmentModal.style.display = "none";
        };
    }

    window.onclick = (event) => {
        if (event.target === enrollmentModal) {
            enrollmentModal.style.display = "none";
        }
    };

    // Botões de inscrição
    document.querySelectorAll(".btn-primary").forEach(button => {
        if (button.textContent.includes("Inscrever") || button.textContent.includes("Ver")) {
            button.addEventListener("click", function(e) {
                e.preventDefault();
                const card = this.closest(".mentor-card, .event-card");
                if (card && card.classList.contains("enrolled")) {
                    showNotification("Você já está inscrito neste item.");
                    return;
                }
                
                const title = card.querySelector(".mentor-name, .event-title").textContent;
                const date = card.querySelector(".schedule-slot, .event-date")?.textContent || "";
                
                document.getElementById("modal-title").textContent = `Inscrever-se em ${title}`;
                document.getElementById("modal-message").textContent = 
                    `Deseja confirmar sua inscrição${date ? ` para ${date}` : ''}?`;
                
                const confirmBtn = document.getElementById("confirm-enrollment");
                confirmBtn.onclick = () => {
                    enrollUser(card, title, date);
                    enrollmentModal.style.display = "none";
                };
                
                enrollmentModal.style.display = "flex";
            });
        }
    });
}

// Configurar toggle do tema
function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
            updateThemeIcon(isDarkMode);
        });
    }
}

// Atualizar ícone do tema
function updateThemeIcon(isDarkMode) {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        const icon = themeToggle.querySelector("i");
        if (icon) {
            icon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
        }
    }
}

// Verificar preferência de dark mode
function checkDarkModePreference() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    
    if (prefersDark || darkModeEnabled) {
        document.body.classList.add("dark-mode");
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
}

// Inscrever usuário
function enrollUser(card, title, date) {
    if (!card) return;
    
    setTimeout(() => {
        card.classList.add("enrolled");
        
        const button = card.querySelector(".btn-primary");
        if (button) {
            button.disabled = true;
            button.textContent = "Inscrito";
            button.style.backgroundColor = "#4CAF50";
            button.style.cursor = "default";
        }
        
        showNotification(`Inscrição confirmada em ${title}${date ? ` para ${date}` : ''}`);
        
        // Atualiza localStorage
        const enrollments = JSON.parse(localStorage.getItem("userEnrollments") || "[]");
        enrollments.push({
            title: title,
            date: date,
            type: card.classList.contains("mentor-card") ? "mentoria" : "evento",
            timestamp: new Date().toISOString()
        });
        localStorage.setItem("userEnrollments", JSON.stringify(enrollments));
    }, 500);
}

// Carregar inscrições do usuário
function loadUserEnrollments() {
    const enrollments = JSON.parse(localStorage.getItem("userEnrollments") || "[]");
    
    document.querySelectorAll(".mentor-card, .event-card").forEach(card => {
        const title = card.querySelector(".mentor-name, .event-title").textContent;
        const isEnrolled = enrollments.some(item => item.title === title);
        
        if (isEnrolled) {
            card.classList.add("enrolled");
            const button = card.querySelector(".btn-primary");
            if (button) {
                button.disabled = true;
                button.textContent = "Inscrito";
                button.style.backgroundColor = "#4CAF50";
                button.style.cursor = "default";
            }
        }
    });
}

// Mostrar notificação
function showNotification(message) {
    const toast = document.getElementById("notification-toast");
    const messageEl = document.getElementById("notification-message");
    
    if (!toast || !messageEl) return;
    
    messageEl.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
