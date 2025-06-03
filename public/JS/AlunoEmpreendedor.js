// Substitua todo o conteúdo do arquivo JS por este código atualizado
document.addEventListener("DOMContentLoaded", () => {
    loadUserName();
    setupEventListeners();
    checkDarkModePreference();
});

// Carregar nome do usuário
function loadUserName() {
    // Busca informações do usuário via API
    fetch('/userInfo')
        .then(response => response.json())
        .then(data => {
            // data pode ser um array de resultados
            if (Array.isArray(data) && data.length > 0) {
                const user = data[0];
                // Verifica se o plano do aluno é 'empreendedor'
                if (user.alPlano && user.alPlano.toLowerCase() === 'empreendedor') {
                    document.getElementById("user-name").textContent = user.alNome || user.userName || 'Aluno';
                    // Carrega inscrições do usuário
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
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Modal de perfil
    const modal = document.getElementById("modal");
    const profileIcon = document.getElementById("profile-icon");
    
    profileIcon.onclick = () => {
        modal.style.display = "flex";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Modal de inscrição
    const enrollmentModal = document.getElementById("enrollment-modal");
    const closeModal = document.querySelector(".close-modal");
    const cancelBtn = document.getElementById("cancel-enrollment");
    
    closeModal.onclick = () => {
        enrollmentModal.style.display = "none";
    };
    
    cancelBtn.onclick = () => {
        enrollmentModal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == enrollmentModal) {
            enrollmentModal.style.display = "none";
        }
    };

    // Adiciona listeners para todos os botões de inscrição
    document.querySelectorAll(".btn-primary").forEach(button => {
        if (button.textContent.includes("Inscrever") || button.textContent.includes("Ver")) {
            button.addEventListener("click", function(e) {
                e.preventDefault();
                const card = this.closest(".mentor-card, .event-card");
                if (card.classList.contains("enrolled")) {
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

// Inscrever usuário em um evento/mentoria
function enrollUser(card, title, date) {
    // Simulação - substitua por chamada real à API
    setTimeout(() => {
        card.classList.add("enrolled");
        
        // Desabilita o botão de inscrição
        const button = card.querySelector(".btn-primary");
        if (button) {
            button.disabled = true;
            button.textContent = "Inscrito";
            button.style.backgroundColor = "#4CAF50";
            button.style.cursor = "default";
        }
        
        showNotification(`Inscrição confirmada em ${title}${date ? ` para ${date}` : ''}`);
        
        // Adiciona à lista de inscrições no localStorage
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

// Carrega inscrições do usuário
function loadUserEnrollments() {
    const enrollments = JSON.parse(localStorage.getItem("userEnrollments") || "[]");
    
    // Para cada card na página, verifica se o usuário está inscrito
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