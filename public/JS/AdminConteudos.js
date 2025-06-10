// Dados simulados (substituir por chamadas à API real)
const turmasData = {
    1: {
        id: 1,
        nome: "Desenvolvimento Web - Turma A",
        curso: "html",
        horario: "Segundas e Quartas, 19:00-21:00",
        alunos: [
            { id: 1, nome: "João Silva", progresso: 90, ultimoAcesso: "2024-05-15" },
            { id: 2, nome: "Maria Oliveira", progresso: 85, ultimoAcesso: "2024-05-14" },
            { id: 3, nome: "Carlos Souza", progresso: 78, ultimoAcesso: "2024-05-13" },
            { id: 4, nome: "Ana Costa", progresso: 65, ultimoAcesso: "2024-05-15" },
            { id: 5, nome: "Pedro Santos", progresso: 72, ultimoAcesso: "2024-05-12" }
        ],
        videos: [
            {
                id: 1,
                title: "Introdução ao HTML5",
                url: "https://www.youtube.com/watch?v=ABC123",
                description: "Aprenda os conceitos básicos de HTML5 e estrutura de documentos web.",
                duration: 15,
                thumbnail: "https://i.ytimg.com/vi/ABC123/hqdefault.jpg",
                createdAt: "2024-05-10"
            },
            {
                id: 2,
                title: "CSS Básico",
                url: "https://www.youtube.com/watch?v=DEF456",
                description: "Introdução aos estilos CSS e formatação de páginas web.",
                duration: 20,
                thumbnail: "https://i.ytimg.com/vi/DEF456/hqdefault.jpg",
                createdAt: "2024-05-15"
            }
        ]
    },
    2: {
        id: 2,
        nome: "GitHub Avançado - Turma B",
        curso: "github",
        horario: "Terças e Quintas, 14:00-16:00",
        alunos: [
            { id: 6, nome: "Fernanda Lima", progresso: 75, ultimoAcesso: "2024-05-14" },
            { id: 7, nome: "Ricardo Alves", progresso: 60, ultimoAcesso: "2024-05-13" },
            { id: 8, nome: "Patrícia Nunes", progresso: 55, ultimoAcesso: "2024-05-12" }
        ],
        videos: [
            {
                id: 3,
                title: "Git Branching Strategies",
                url: "https://www.youtube.com/watch?v=GHI789",
                description: "Estratégias avançadas de branching com Git para projetos em equipe.",
                duration: 25,
                thumbnail: "https://i.ytimg.com/vi/GHI789/hqdefault.jpg",
                createdAt: "2024-05-12"
            }
        ]
    },
    3: {
        id: 3,
        nome: "JavaScript Moderno - Turma C",
        curso: "js",
        horario: "Sábados, 9:00-13:00",
        alunos: [
            { id: 9, nome: "Gabriel Martins", progresso: 60, ultimoAcesso: "2024-05-13" },
            { id: 10, nome: "Amanda Rocha", progresso: 52, ultimoAcesso: "2024-05-12" },
            { id: 11, nome: "Rodrigo Ferreira", progresso: 40, ultimoAcesso: "2024-05-11" },
            { id: 12, nome: "Tatiana Gomes", progresso: 38, ultimoAcesso: "2024-05-10" }
        ],
        videos: [
            {
                id: 4,
                title: "Fundamentos de JavaScript",
                url: "https://www.youtube.com/watch?v=JKL012",
                description: "Introdução aos conceitos básicos de JavaScript e sintaxe.",
                duration: 30,
                thumbnail: "https://i.ytimg.com/vi/JKL012/hqdefault.jpg",
                createdAt: "2024-05-18"
            },
            {
                id: 5,
                title: "Manipulação do DOM",
                url: "https://www.youtube.com/watch?v=MNO345",
                description: "Como manipular elementos da página usando JavaScript.",
                duration: 25,
                thumbnail: "https://i.ytimg.com/vi/MNO345/hqdefault.jpg",
                createdAt: "2024-05-20"
            }
        ]
    }
};

// Variáveis globais
let currentTurmaId = null;
let videoToDelete = null;
let currentTab = 'videos';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderTurmas();
    setupFormSubmit();
    setupEventListeners();
});

// Configurar submit do formulário
function setupFormSubmit() {
    document.getElementById('videoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveVideo();
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Pesquisa de turmas
    document.getElementById('searchTurmas').addEventListener('input', function() {
        renderTurmas(this.value);
    });
    
    // Botão de adicionar vídeo
    document.getElementById('addVideoBtn').addEventListener('click', openAddVideoModal);
    
    // Abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            changeTab(this.dataset.tab);
        });
    });
}

// Renderizar lista de turmas
function renderTurmas(searchTerm = '') {
    const container = document.getElementById('turmasContainer');
    const turmas = Object.values(turmasData);
    
    // Filtrar turmas
    let filteredTurmas = turmas;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTurmas = filteredTurmas.filter(turma => 
            turma.nome.toLowerCase().includes(term)
        );
    }
    
    // Se não houver turmas, mostrar estado vazio
    if (filteredTurmas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Nenhuma turma encontrada</p>
            </div>
        `;
        return;
    }
    
    // Renderizar turmas
    container.innerHTML = filteredTurmas.map(turma => `
        <div class="turma-item ${currentTurmaId === turma.id ? 'active' : ''}" 
                onclick="selectTurma(${turma.id})">
            <h3 class="font-bold">${turma.nome}</h3>
            <p class="text-sm text-gray-400">${turma.horario}</p>
            <div class="flex justify-between items-center mt-2">
                <span class="text-xs">${turma.alunos.length} alunos</span>
                <span class="text-xs">${turma.videos.length} vídeos</span>
            </div>
        </div>
    `).join('');
}

// Selecionar turma
function selectTurma(turmaId) {
    currentTurmaId = turmaId;
    renderTurmas();
    renderContent();
    
    // Ativar botão de adicionar vídeo
    document.getElementById('addVideoBtn').disabled = false;
    
    // Atualizar header
    const turma = turmasData[turmaId];
    document.getElementById('turmaNome').textContent = turma.nome;
    document.getElementById('turmaInfo').textContent = `${turma.horario} • ${turma.alunos.length} alunos • ${turma.videos.length} vídeos`;
    document.getElementById('turmaHeader').classList.remove('hidden');
}

// Renderizar conteúdo da turma selecionada
function renderContent() {
    if (currentTab === 'videos') {
        renderVideos();
    } else {
        renderAlunos();
    }
}

// Renderizar vídeos da turma selecionada
function renderVideos() {
    const container = document.getElementById('videosContainer');
    
    if (!currentTurmaId) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video-slash"></i>
                <p>Selecione uma turma para ver os vídeos</p>
                <p>Ou adicione novos vídeos à turma selecionada</p>
            </div>
        `;
        return;
    }
    
    const turma = turmasData[currentTurmaId];
    const videos = turma.videos;
    
    if (videos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-video-slash"></i>
                <p>Nenhum vídeo encontrado para esta turma</p>
                <p>Adicione seu primeiro vídeo clicando no botão acima</p>
            </div>
        `;
        return;
    }
    
    // Renderizar vídeos
    container.innerHTML = videos.map(video => `
        <div class="video-item" data-id="${video.id}">
            <div class="relative">
                <div class="video-thumbnail">
                    ${video.thumbnail ? 
                        `<img src="${video.thumbnail}" alt="${video.title}">` : 
                        `<i class="fas fa-play"></i>`
                    }
                    <span class="video-duration">${formatDuration(video.duration)}</span>
                </div>
            </div>
            <h3 class="font-bold mb-2">${video.title}</h3>
            <p class="text-sm text-gray-400 mb-3">${video.description}</p>
            <div class="flex justify-between items-center">
                <span class="badge ${getBadgeClass(turma.curso)}">${getCourseName(turma.curso)}</span>
                <div class="flex space-x-2">
                    <button class="btn-primary" onclick="editVideo(${video.id})">
                        <i class="fas fa-edit mr-1"></i> Editar
                    </button>
                    <button class="btn-danger" onclick="showDeleteConfirm(${video.id})">
                        <i class="fas fa-trash mr-1"></i> Remover
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar alunos da turma selecionada
function renderAlunos() {
    const container = document.getElementById('alunosContainer');
    
    if (!currentTurmaId) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Selecione uma turma para ver os alunos</p>
            </div>
        `;
        return;
    }
    
    const turma = turmasData[currentTurmaId];
    const alunos = turma.alunos;
    
    if (alunos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <p>Nenhum aluno encontrado nesta turma</p>
            </div>
        `;
        return;
    }
    
    // Renderizar alunos
    container.innerHTML = `
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>Progresso</th>
                        <th>Último Acesso</th>
                    </tr>
                </thead>
                <tbody>
                    ${alunos.map(aluno => `
                        <tr class="aluno-item">
                            <td>${aluno.nome}</td>
                            <td>
                                <div class="flex items-center">
                                    <span class="mr-2">${aluno.progresso}%</span>
                                    <div class="progress-bar" style="flex-grow: 1;">
                                        <div class="progress-fill" style="width: ${aluno.progresso}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td>${formatDate(aluno.ultimoAcesso)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Trocar de aba
function changeTab(tabName) {
    currentTab = tabName;
    
    // Atualizar botões das abas
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Atualizar conteúdo das abas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}Tab`) {
            content.classList.add('active');
        }
    });
    
    // Renderizar conteúdo da aba selecionada
    renderContent();
}

// Função para formatar duração
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Função para formatar data
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para obter classe do badge
function getBadgeClass(course) {
    switch(course) {
        case 'github': return 'badge-github';
        case 'html': return 'badge-html';
        case 'js': return 'badge-js';
        default: return 'badge-primary';
    }
}

// Função para obter nome do curso
function getCourseName(course) {
    switch(course) {
        case 'github': return 'GitHub';
        case 'html': return 'HTML/CSS';
        case 'js': return 'JavaScript';
        default: return course;
    }
}

// Abrir modal para adicionar vídeo
function openAddVideoModal() {
    if (!currentTurmaId) return;
    
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Vídeo';
    document.getElementById('videoId').value = '';
    document.getElementById('turmaId').value = currentTurmaId;
    document.getElementById('videoForm').reset();
    openModal('videoModal');
}

// Abrir modal
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

// Fechar modal
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Mostrar confirmação de exclusão
function showDeleteConfirm(id) {
    videoToDelete = id;
    openModal('confirmModal');
}

// Confirmar exclusão
function confirmDelete() {
    if (videoToDelete && currentTurmaId) {
        const turma = turmasData[currentTurmaId];
        turma.videos = turma.videos.filter(video => video.id !== videoToDelete);
        renderVideos();
        closeModal('confirmModal');
        videoToDelete = null;
        showToast('Vídeo excluído com sucesso!');
    }
}

// Editar vídeo
function editVideo(id) {
    if (!currentTurmaId) return;
    
    const turma = turmasData[currentTurmaId];
    const video = turma.videos.find(v => v.id === id);
    
    if (video) {
        document.getElementById('modalTitle').textContent = 'Editar Vídeo';
        document.getElementById('videoId').value = video.id;
        document.getElementById('turmaId').value = currentTurmaId;
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoUrl').value = video.url;
        document.getElementById('videoDescription').value = video.description;
        document.getElementById('videoDuration').value = video.duration;
        document.getElementById('videoThumbnail').value = video.thumbnail || '';
        openModal('videoModal');
    }
}

// Salvar vídeo (criar ou atualizar)
function saveVideo() {
    const id = document.getElementById('videoId').value;
    const turmaId = document.getElementById('turmaId').value;
    const videoData = {
        title: document.getElementById('videoTitle').value,
        url: document.getElementById('videoUrl').value,
        description: document.getElementById('videoDescription').value,
        duration: parseInt(document.getElementById('videoDuration').value),
        thumbnail: document.getElementById('videoThumbnail').value || null,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (!turmaId) return;
    
    const turma = turmasData[turmaId];
    
    if (id) {
        // Atualizar vídeo existente
        const index = turma.videos.findIndex(v => v.id === parseInt(id));
        if (index !== -1) {
            turma.videos[index] = { ...turma.videos[index], ...videoData };
            showToast('Vídeo atualizado com sucesso!');
        }
    } else {
        // Criar novo vídeo
        const newId = turma.videos.length > 0 ? Math.max(...turma.videos.map(v => v.id)) + 1 : 1;
        turma.videos.push({ id: newId, ...videoData });
        showToast('Vídeo adicionado com sucesso!');
    }
    
    closeModal('videoModal');
    renderVideos();
    renderTurmas();
    document.getElementById('videoForm').reset();
}

// Mostrar notificação
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};