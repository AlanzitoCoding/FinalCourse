// Atualizar progresso dos cursos
        function updateGitHubProgress() {
            fetch("/progressCoursePercentage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({courseID: 1})
            })
            .then((response) => response.json())
            .then((data) => {
                const progressBar = document.querySelector("#github-progress");
                data.forEach((row) => {
                    progressBar.style.width = `${row.percentage}%`;
                });
            });
        }

        function updatehtmlProgress() {
            fetch("/progressCoursePercentage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({courseID: 2})
            })
            .then((response) => response.json())
            .then((data) => {
                const progressBar = document.querySelector("#html-progress");
                data.forEach((row) => {
                    progressBar.style.width = `${row.percentage}%`;
                });
            });
        }

        function updatejsProgress() {
            fetch("/progressCoursePercentage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({courseID: 3})
            })
            .then((response) => response.json())
            .then((data) => {
                const progressBar = document.querySelector("#js-progress");
                data.forEach((row) => {
                    progressBar.style.width = `${row.percentage}%`;
                });
            });
        }

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

        // Alternar entre abas
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Remover classe active de todas as abas
                tabs.forEach(t => t.classList.remove("active"));
                
                // Adicionar classe active à aba clicada
                tab.classList.add("active");
                
                // Esconder todos os conteúdos
                document.querySelectorAll(".tab-content").forEach(content => {
                    content.classList.remove("active");
                });
                
                // Mostrar o conteúdo correspondente
                const tabId = tab.getAttribute("data-tab") + "-tab";
                document.getElementById(tabId).classList.add("active");
            });
        });

        // Carregar nome do usuário
        function loadUserName() {
            // Simulação - substitua por chamada real à API
            setTimeout(() => {
                document.getElementById("user-name").textContent = "João Silva";
            }, 1000);
        }

        // Carregar cursos em andamento
        function loadOngoingCourses() {
            // Simulação - substitua por chamada real à API
            setTimeout(() => {
                const ongoingCourses = document.getElementById("ongoing-courses");
                ongoingCourses.innerHTML = `
                    <div class="course-card">
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Course" class="course-image">
                        <div class="course-content">
                            <h3 class="course-title">Curso de GitHub</h3>
                            <p class="course-description">Aprenda a utilizar o GitHub para controle de versão e colaboração em projetos.</p>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: 45%"></div>
                            </div>
                            <div class="course-meta">
                                <div class="course-stats">
                                    <span><i class="fas fa-book-open"></i> 5/12 aulas</span>
                                    <span><i class="fas fa-clock"></i> 3.5/8 horas</span>
                                </div>
                            </div>
                            <button class="btn-primary" onclick="window.location.href='/CursoGithub'">Continuar Curso</button>
                        </div>
                    </div>
                    <div class="course-card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png" alt="HTML/CSS Course" class="course-image">
                        <div class="course-content">
                            <h3 class="course-title">Curso de HTML/CSS</h3>
                            <p class="course-description">Domine as linguagens fundamentais para criação de páginas web.</p>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: 30%"></div>
                            </div>
                            <div class="course-meta">
                                <div class="course-stats">
                                    <span><i class="fas fa-book-open"></i> 4/15 aulas</span>
                                    <span><i class="fas fa-clock"></i> 3/10 horas</span>
                                </div>
                            </div>
                            <button class="btn-primary" onclick="window.location.href='/Cursohtml'">Continuar Curso</button>
                        </div>
                    </div>
                `;
            }, 1500);
        }

        // Carregar cursos concluídos
        function loadCompletedCourses() {
            // Simulação - substitua por chamada real à API
            setTimeout(() => {
                const completedCourses = document.getElementById("completed-courses");
                completedCourses.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-graduation-cap"></i>
                        <p>Você ainda não concluiu nenhum curso</p>
                        <p>Explore nossos cursos disponíveis e comece a aprender!</p>
                    </div>
                `;
            }, 1500);
        }

        // Inicialização
        document.addEventListener("DOMContentLoaded", () => {
            loadUserName();
            loadOngoingCourses();
            loadCompletedCourses();
            updateGitHubProgress();
            updatehtmlProgress();
            updatejsProgress();
            
            // Ativar dark mode se necessário
            document.body.classList.toggle('dark-mode');
        });