document.addEventListener('DOMContentLoaded', function() {
    // Dados mockados para demonstração
    const mockUsers = [
        { id: 1, name: 'Admin Master', email: 'admin@smgfap.com', role: 'admin', status: 'active', lastAccess: '2024-05-15 14:30' },
        { id: 2, name: 'Prof. João Silva', email: 'joao@smgfap.com', role: 'professor', status: 'active', lastAccess: '2024-05-15 10:15', turmas: ['Desenvolvimento Web - Turma A', 'GitHub Avançado - Turma B'] },
        { id: 3, name: 'Prof. Maria Oliveira', email: 'maria@smgfap.com', role: 'professor', status: 'active', lastAccess: '2024-05-14 16:45', turmas: ['JavaScript Moderno - Turma C'] },
        { id: 4, name: 'Aluno: Pedro Santos', email: 'pedro@smgfap.com', role: 'aluno', status: 'active', lastAccess: '2024-05-15 09:20' },
        { id: 5, name: 'Aluno: Ana Costa', email: 'ana@smgfap.com', role: 'aluno', status: 'pending', lastAccess: '2024-05-13 18:30' },
        { id: 6, name: 'Aluno: Carlos Mendes', email: 'carlos@smgfap.com', role: 'aluno', status: 'active', lastAccess: '2024-05-15 11:45' },
        { id: 7, name: 'Prof. Luiz Pereira', email: 'luiz@smgfap.com', role: 'professor', status: 'inactive', lastAccess: '2024-04-28 08:10', turmas: [] },
        { id: 8, name: 'Aluno: Juliana Alves', email: 'juliana@smgfap.com', role: 'aluno', status: 'active', lastAccess: '2024-05-14 20:15' },
        { id: 9, name: 'Admin Suporte', email: 'suporte@smgfap.com', role: 'admin', status: 'active', lastAccess: '2024-05-15 13:25' },
        { id: 10, name: 'Aluno: Rodrigo Lima', email: 'rodrigo@smgfap.com', role: 'aluno', status: 'inactive', lastAccess: '2024-03-10 15:40' }
    ];

    const mockTurmas = [
        { professorId: 2, professorName: 'Prof. João Silva', turma: 'Desenvolvimento Web - Turma A', curso: 'Desenvolvimento Web', status: 'active', alunos: 25, assignedAt: '2024-01-10' },
        { professorId: 2, professorName: 'Prof. João Silva', turma: 'GitHub Avançado - Turma B', curso: 'GitHub Avançado', status: 'active', alunos: 18, assignedAt: '2024-02-15' },
        { professorId: 3, professorName: 'Prof. Maria Oliveira', turma: 'JavaScript Moderno - Turma C', curso: 'JavaScript Moderno', status: 'active', alunos: 30, assignedAt: '2024-03-05' },
        { professorId: 7, professorName: 'Prof. Luiz Pereira', turma: 'Banco de Dados - Turma D', curso: 'Banco de Dados', status: 'inactive', alunos: 0, assignedAt: '2023-11-20' }
    ];

    // Variáveis globais
    let currentTab = 'usuarios';
    let currentPage = {
        usuarios: 1,
        professores: 1,
        turmas: 1
    };
    const itemsPerPage = 5;
    let selectedUserId = null;
    let selectedProfessorId = null;

    // Inicialização
    init();

    // Adicione no início da função init() os listeners para os eventos:
function init() {
    // Configurar listeners para eventos globais
    document.addEventListener('editUserEvent', (e) => editUser(e.detail));
    document.addEventListener('confirmDeleteUserEvent', (e) => confirmDeleteUser(e.detail));
    document.addEventListener('assignTurmaToProfessorEvent', (e) => assignTurmaToProfessor(e.detail.professorId, e.detail.professorName));
    document.addEventListener('previousPageEvent', (e) => previousPage(e.detail));
    document.addEventListener('nextPageEvent', (e) => nextPage(e.detail));
    document.addEventListener('gerarSenhaEvent', (e) => gerarSenha(e.detail));
    document.addEventListener('exportarDadosEvent', exportarDados);
    document.addEventListener('closeModalEvent', (e) => closeModal(e.detail));
    document.addEventListener('openModalEvent', (e) => openModal(e.detail));
    document.addEventListener('confirmActionEvent', confirmAction);
        // Configurar tabs
        setupTabs();
        
        // Carregar dados iniciais
        loadUsers();
        loadProfessores();
        loadTurmas();
        
        // Configurar filtros
        setupFilters();
        
        // Configurar modais
        setupModals();
        
        // Configurar formulários
        setupForms();
    }

    // Configuração das abas
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    switchTab(tabId);
                }
            });
        });
    }

    // Trocar de aba
    function switchTab(tabId) {
        currentTab = tabId;
        
        // Atualizar botões ativos
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
        
        // Atualizar conteúdo das abas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
        
        // Atualizar paginação se necessário
        if (tabId === 'usuarios') {
            updatePagination('usuarios');
        } else if (tabId === 'professores') {
            updatePagination('professores');
        } else if (tabId === 'turmas') {
            updatePagination('turmas');
        }
    }

    // Carregar usuários
    function loadUsers(filter = '', role = 'all') {
        let filteredUsers = [...mockUsers];
        
        // Aplicar filtro de texto
        if (filter) {
            const searchTerm = filter.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
)}
        
        // Aplicar filtro de perfil
        if (role !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }
        
        // Atualizar contagem total
        document.getElementById('totalUsuarios').textContent = filteredUsers.length;
        
        // Paginação
        const startIndex = (currentPage.usuarios - 1) * itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
        
        // Atualizar tabela
        const tbody = document.getElementById('usuariosList');
        tbody.innerHTML = '';
        
        if (paginatedUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Nenhum usuário encontrado</td></tr>';
            return;
        }
        
        paginatedUsers.forEach(user => {
            const row = document.createElement('tr');
            
            // Determinar classe de status e texto
            let statusClass, statusText;
            if (user.status === 'active') {
                statusClass = 'status-active';
                statusText = 'Ativo';
            } else if (user.status === 'inactive') {
                statusClass = 'status-inactive';
                statusText = 'Inativo';
            } else {
                statusClass = 'status-pending';
                statusText = 'Pendente';
            }
            
            // Determinar classe de perfil e texto
            let roleClass, roleText;
            if (user.role === 'admin') {
                roleClass = 'role-admin';
                roleText = 'Administrador';
            } else if (user.role === 'professor') {
                roleClass = 'role-professor';
                roleText = 'Professor';
            } else {
                roleClass = 'role-aluno';
                roleText = 'Aluno';
            }
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="${roleClass}">${roleText}</span></td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${formatDate(user.lastAccess)}</td>
                <td>
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDeleteUser(${user.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${user.role === 'professor' ? `<button class="action-btn assign" onclick="assignTurmaToProfessor(${user.id}, '${user.name}')" title="Atribuir Turma">
                        <i class="fas fa-users"></i>
                    </button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Atualizar paginação
        updatePagination('usuarios', filteredUsers.length);
    }

    // Carregar professores
    function loadProfessores(filter = '') {
        const professores = mockUsers.filter(user => user.role === 'professor');
        let filteredProfessores = [...professores];
        
        // Aplicar filtro
        if (filter) {
            const searchTerm = filter.toLowerCase();
            filteredProfessores = filteredProfessores.filter(prof => 
                prof.name.toLowerCase().includes(searchTerm) || 
                prof.email.toLowerCase().includes(searchTerm))
        }
        
        // Atualizar contagem total
        document.getElementById('totalProfessores').textContent = filteredProfessores.length;
        
        // Paginação
        const startIndex = (currentPage.professores - 1) * itemsPerPage;
        const paginatedProfessores = filteredProfessores.slice(startIndex, startIndex + itemsPerPage);
        
        // Atualizar tabela
        const tbody = document.getElementById('professoresList');
        tbody.innerHTML = '';
        
        if (paginatedProfessores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Nenhum professor encontrado</td></tr>';
            return;
        }
        
    paginatedProfessores.forEach(prof => {
    const turmas = prof.turmas ? prof.turmas.join(', ') : 'Nenhuma turma atribuída';
    
    // Determinar classe de status e texto
    let statusClass, statusText;
    if (prof.status === 'active') {
        statusClass = 'status-active';
        statusText = 'Ativo';
    } else if (prof.status === 'inactive') {
        statusClass = 'status-inactive';
        statusText = 'Inativo';
    } else {
        statusClass = 'status-pending';
        statusText = 'Pendente';
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${prof.id}</td>
        <td>${prof.name}</td>
        <td>${prof.email}</td>
        <td>${turmas}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
            <button class="action-btn edit" onclick="editUser(${prof.id})" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn assign" onclick="assignTurmaToProfessor(${prof.id}, '${prof.name}')" title="Atribuir Turma">
                <i class="fas fa-users"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
});
        
        // Atualizar paginação
        updatePagination('professores', filteredProfessores.length);
    }

    // Carregar turmas
    function loadTurmas(professorId = 'all', status = 'all') {
        let filteredTurmas = [...mockTurmas];
        
        // Aplicar filtro de professor
        if (professorId !== 'all') {
            filteredTurmas = filteredTurmas.filter(turma => turma.professorId == professorId);
        }
        
        // Aplicar filtro de status
        if (status !== 'all') {
            filteredTurmas = filteredTurmas.filter(turma => turma.status === status);
        }
        
        // Atualizar contagem total
        document.getElementById('totalTurmas').textContent = filteredTurmas.length;
        
        // Paginação
        const startIndex = (currentPage.turmas - 1) * itemsPerPage;
        const paginatedTurmas = filteredTurmas.slice(startIndex, startIndex + itemsPerPage);
        
        // Atualizar tabela
        const tbody = document.getElementById('turmasList');
        tbody.innerHTML = '';
        
        if (paginatedTurmas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Nenhuma turma encontrada</td></tr>';
            return;
        }
        
        paginatedTurmas.forEach(turma => {
    // Determinar classe de status e texto
    let statusClass, statusText;
    if (turma.status === 'active') {
        statusClass = 'status-active';
        statusText = 'Ativa';
    } else {
        statusClass = 'status-inactive';
        statusText = 'Inativa';
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${turma.professorName}</td>
        <td>${turma.turma}</td>
        <td>${turma.curso}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>${turma.alunos}</td>
        <td>${formatDate(turma.assignedAt)}</td>
        <td>
            <button class="action-btn edit" onclick="editTurmaAssignment(${turma.professorId}, '${turma.turma}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="confirmRemoveTurmaAssignment(${turma.professorId}, '${turma.turma}')" title="Remover">
                <i class="fas fa-unlink"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
});
        
        // Atualizar paginação
        updatePagination('turmas', filteredTurmas.length);
    }

    // Configurar filtros
    function setupFilters() {
        // Filtro de usuários
        const searchUsuarios = document.getElementById('searchUsuarios');
        const filterRole = document.getElementById('filterRole');
        
        searchUsuarios.addEventListener('input', function() {
            loadUsers(this.value, filterRole.value);
        });
        
        filterRole.addEventListener('change', function() {
            loadUsers(searchUsuarios.value, this.value);
        });
        
        // Filtro de professores
        const searchProfessores = document.getElementById('searchProfessores');
        
        searchProfessores.addEventListener('input', function() {
            loadProfessores(this.value);
        });
        
        // Filtro de turmas
        const filterProfessorTurmas = document.getElementById('filterProfessorTurmas');
        const filterStatusTurmas = document.getElementById('filterStatusTurmas');
        
        // Preencher select de professores
        const professores = mockUsers.filter(user => user.role === 'professor');
        professores.forEach(prof => {
            const option = document.createElement('option');
            option.value = prof.id;
            option.textContent = prof.name;
            filterProfessorTurmas.appendChild(option);
        });
        
        filterProfessorTurmas.addEventListener('change', function() {
            loadTurmas(this.value, filterStatusTurmas.value);
        });
        
        filterStatusTurmas.addEventListener('change', function() {
            loadTurmas(filterProfessorTurmas.value, this.value);
        });
    }

    // Configurar modais
    function setupModals() {
        // Modal de novo usuário
        const novoUsuarioModal = document.getElementById('novoUsuarioModal');
        
        // Modal de edição de usuário
        const editarUsuarioModal = document.getElementById('editarUsuarioModal');
        
        // Modal de atribuição de turma
        const atribuirTurmaModal = document.getElementById('atribuirTurmaModal');
        
        // Modal de confirmação
        const confirmModal = document.getElementById('confirmModal');
    }

    // Configurar formulários
    function setupForms() {
        // Formulário de novo usuário
        const novoUsuarioForm = document.getElementById('novoUsuarioForm');
        novoUsuarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNewUser();
        });
        
        // Formulário de edição de usuário
        const editarUsuarioForm = document.getElementById('editarUsuarioForm');
        editarUsuarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserChanges();
        });
        
        // Formulário de atribuição de turma
        const atribuirTurmaForm = document.getElementById('atribuirTurmaForm');
        atribuirTurmaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTurmaAssignment();
        });
    }

    // Funções de paginação
    function updatePagination(type, totalItems = 0) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Atualizar texto "Mostrando X-Y de Z"
        const startItem = ((currentPage[type] - 1) * itemsPerPage) + 1;
        const endItem = Math.min(currentPage[type] * itemsPerPage, totalItems);
        
        document.getElementById(`${type}Inicio`).textContent = startItem;
        document.getElementById(`${type}Fim`).textContent = endItem;
        document.getElementById(`${type}Total`).textContent = totalItems;
        
        // Atualizar botões de navegação
        document.getElementById(`prev${capitalizeFirstLetter(type)}`).disabled = currentPage[type] <= 1;
        document.getElementById(`next${capitalizeFirstLetter(type)}`).disabled = currentPage[type] >= totalPages;
    }

    function previousPage(type) {
        if (currentPage[type] > 1) {
            currentPage[type]--;
            refreshCurrentTab();
        }
    }

    function nextPage(type) {
        const totalItems = parseInt(document.getElementById(`${type}Total`).textContent);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPage[type] < totalPages) {
            currentPage[type]++;
            refreshCurrentTab();
        }
    }

    function refreshCurrentTab() {
        if (currentTab === 'usuarios') {
            const search = document.getElementById('searchUsuarios').value;
            const role = document.getElementById('filterRole').value;
            loadUsers(search, role);
        } else if (currentTab === 'professores') {
            const search = document.getElementById('searchProfessores').value;
            loadProfessores(search);
        } else if (currentTab === 'turmas') {
            const professor = document.getElementById('filterProfessorTurmas').value;
            const status = document.getElementById('filterStatusTurmas').value;
            loadTurmas(professor, status);
        }
    }

    // Funções auxiliares
    function formatDate(dateString) {
        if (!dateString) return 'Nunca';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function generateRandomPassword(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }

    // Funções de modal
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Funções de usuário
    function editUser(userId) {
        const user = mockUsers.find(u => u.id == userId);
        if (!user) return;
        
        document.getElementById('editarUsuarioId').value = user.id;
        document.getElementById('editarUsuarioNome').value = user.name;
        document.getElementById('editarUsuarioEmail').value = user.email;
        document.getElementById('editarUsuarioPerfil').value = user.role;
        document.getElementById('editarUsuarioStatus').value = user.status;
        document.getElementById('editarUsuarioSenha').value = '';
        
        openModal('editarUsuarioModal');
    }

    function confirmDeleteUser(userId) {
        selectedUserId = userId;
        const user = mockUsers.find(u => u.id == userId);
        
        document.getElementById('confirmModalTitle').textContent = 'Confirmar Exclusão';
        document.getElementById('confirmModalMessage').textContent = `Tem certeza que deseja excluir o usuário ${user.name}?`;
        document.getElementById('confirmModalButton').textContent = 'Excluir';
        document.getElementById('confirmModalButton').onclick = deleteUser;
        
        openModal('confirmModal');
    }

    function deleteUser() {
        // Em uma aplicação real, aqui seria uma chamada AJAX para o servidor
        const index = mockUsers.findIndex(u => u.id == selectedUserId);
        if (index !== -1) {
            mockUsers.splice(index, 1);
            refreshCurrentTab();
        }
        
        closeModal('confirmModal');
        showToast('Usuário excluído com sucesso', 'success');
    }

    function saveNewUser() {
        const name = document.getElementById('usuarioNome').value;
        const email = document.getElementById('usuarioEmail').value;
        const role = document.getElementById('usuarioPerfil').value;
        const status = document.getElementById('usuarioStatus').value;
        const password = document.getElementById('usuarioSenha').value;
        
        // Validação básica
        if (!name || !email || !role || !status || !password) {
            showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Criar novo usuário (em uma aplicação real, seria uma chamada AJAX)
        const newUser = {
            id: mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1,
            name,
            email,
            role,
            status,
            lastAccess: 'Nunca',
            turmas: role === 'professor' ? [] : undefined
        };
        
        mockUsers.push(newUser);
        
        // Limpar formulário
        document.getElementById('novoUsuarioForm').reset();
        
        // Fechar modal e atualizar lista
        closeModal('novoUsuarioModal');
        refreshCurrentTab();
        
        showToast('Usuário criado com sucesso', 'success');
    }

    function saveUserChanges() {
        const id = document.getElementById('editarUsuarioId').value;
        const name = document.getElementById('editarUsuarioNome').value;
        const email = document.getElementById('editarUsuarioEmail').value;
        const role = document.getElementById('editarUsuarioPerfil').value;
        const status = document.getElementById('editarUsuarioStatus').value;
        const password = document.getElementById('editarUsuarioSenha').value;
        
        // Validação básica
        if (!id || !name || !email || !role || !status) {
            showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Encontrar e atualizar usuário (em uma aplicação real, seria uma chamada AJAX)
        const userIndex = mockUsers.findIndex(u => u.id == id);
        if (userIndex !== -1) {
            mockUsers[userIndex] = {
                ...mockUsers[userIndex],
                name,
                email,
                role,
                status
            };
            
            // Se foi fornecida uma nova senha, atualizar (em uma aplicação real)
            if (password) {
                // Aqui seria a lógica para atualizar a senha
            }
            
            // Fechar modal e atualizar lista
            closeModal('editarUsuarioModal');
            refreshCurrentTab();
            
            showToast('Alterações salvas com sucesso', 'success');
        }
    }

    function gerarSenha(fieldId = 'usuarioSenha') {
        const password = generateRandomPassword();
        document.getElementById(fieldId).value = password;
    }

    // Funções de turmas
    function assignTurmaToProfessor(professorId, professorName) {
        selectedProfessorId = professorId;
        
        // Preencher informações do professor no modal
        document.getElementById('atribuirTurmaProfessorId').value = professorId;
        document.getElementById('atribuirTurmaProfessor').value = professorName;
        
        // Preencher select de turmas disponíveis (em uma aplicação real, viria do servidor)
        const turmasDisponiveis = [
            'Desenvolvimento Web - Turma A',
            'GitHub Avançado - Turma B',
            'JavaScript Moderno - Turma C',
            'Banco de Dados - Turma D',
            'React Avançado - Turma E'
        ];
        
        const select = document.getElementById('atribuirTurmaSelecionada');
        select.innerHTML = '<option value="">Selecione uma turma</option>';
        
        turmasDisponiveis.forEach(turma => {
            // Verificar se o professor já tem essa turma atribuída
            const jaAtribuida = mockTurmas.some(t => 
                t.professorId == professorId && t.turma === turma);
            
            if (!jaAtribuida) {
                const option = document.createElement('option');
                option.value = turma;
                option.textContent = turma;
                select.appendChild(option);
            }
        });
        
        // Definir data atual como padrão
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('atribuirTurmaData').value = today;
        
        openModal('atribuirTurmaModal');
    }

    function saveTurmaAssignment() {
        const professorId = document.getElementById('atribuirTurmaProfessorId').value;
        const turma = document.getElementById('atribuirTurmaSelecionada').value;
        const data = document.getElementById('atribuirTurmaData').value;
        
        if (!professorId || !turma || !data) {
            showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Extrair nome do professor
        const professor = mockUsers.find(u => u.id == professorId);
        if (!professor) {
            showToast('Professor não encontrado', 'error');
            return;
        }
        
        // Extrair curso da turma (simplificado)
        const curso = turma.split(' - ')[0];
        
        // Adicionar turma (em uma aplicação real, seria uma chamada AJAX)
        const novaTurma = {
            professorId: parseInt(professorId),
            professorName: professor.name,
            turma,
            curso,
            status: 'active',
            alunos: 0, // Em uma aplicação real, isso viria do servidor
            assignedAt: data
        };
        
        mockTurmas.push(novaTurma);
        
        // Adicionar turma ao professor (se não existir)
        if (professor.turmas && !professor.turmas.includes(turma)) {
            professor.turmas.push(turma);
        } else if (!professor.turmas) {
            professor.turmas = [turma];
        }
        
        // Limpar formulário
        document.getElementById('atribuirTurmaForm').reset();
        
        // Fechar modal e atualizar lista
        closeModal('atribuirTurmaModal');
        refreshCurrentTab();
        
        showToast('Turma atribuída com sucesso', 'success');
    }

    function editTurmaAssignment(professorId, turmaNome) {
        // Encontrar a atribuição de turma
        const turma = mockTurmas.find(t => 
                   t.professorId == professorId && t.turma === turmaNome);
        if (!turma) return;

        // Preencher o modal de atribuição de turma com os dados existentes
        selectedProfessorId = professorId;
        document.getElementById('atribuirTurmaProfessorId').value = professorId;
        document.getElementById('atribuirTurmaProfessor').value = turma.professorName;
        
        // Definir a turma atual como selecionada (não editável neste exemplo)
        const select = document.getElementById('atribuirTurmaSelecionada');
        select.innerHTML = `<option value="${turma.turma}" selected>${turma.turma}</option>`;
        select.disabled = true;
        
        // Definir data de atribuição
        document.getElementById('atribuirTurmaData').value = turma.assignedAt;
        
        openModal('atribuirTurmaModal');
    }

    function confirmRemoveTurmaAssignment(professorId, turmaNome) {
        selectedProfessorId = professorId;
        const turma = mockTurmas.find(t => t.professorId == professorId && t.turma === turmaNome);
        
        document.getElementById('confirmModalTitle').textContent = 'Confirmar Remoção';
        document.getElementById('confirmModalMessage').textContent = `Tem certeza que deseja remover a atribuição da turma ${turmaNome} para o professor ${turma.professorName}?`;
        document.getElementById('confirmModalButton').textContent = 'Remover';
        document.getElementById('confirmModalButton').onclick = removeTurmaAssignment;
        
        openModal('confirmModal');
    }

    function removeTurmaAssignment() {
        // Encontrar e remover a atribuição de turma
        const turmaIndex = mockTurmas.findIndex(t => 
            t.professorId == selectedProfessorId && t.turma === document.getElementById('confirmModalMessage').textContent.split("'")[1]);
        
        if (turmaIndex !== -1) {
            mockTurmas.splice(turmaIndex, 1);
            
            // Remover a turma do professor também
            const professor = mockUsers.find(u => u.id == selectedProfessorId);
            if (professor && professor.turmas) {
                const turmaInProfessorIndex = professor.turmas.indexOf(document.getElementById('confirmModalMessage').textContent.split("'")[1]);
                if (turmaInProfessorIndex !== -1) {
                    professor.turmas.splice(turmaInProfessorIndex, 1);
                }
            }
            
            refreshCurrentTab();
        }
        
        closeModal('confirmModal');
        showToast('Atribuição de turma removida com sucesso', 'success');
    }

    // Função para exportar dados
    function exportarDados() {
        let dataToExport;
        let fileName;
        
        if (currentTab === 'usuarios') {
            dataToExport = mockUsers;
            fileName = 'usuarios_smgfap';
        } else if (currentTab === 'professores') {
            dataToExport = mockUsers.filter(u => u.role === 'professor');
            fileName = 'professores_smgfap';
        } else if (currentTab === 'turmas') {
            dataToExport = mockTurmas;
            fileName = 'turmas_smgfap';
        }
        
        // Converter para JSON
        const jsonData = JSON.stringify(dataToExport, null, 2);
        
        // Criar blob e link para download
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Dados exportados com sucesso', 'success');
    }

    // Função para mostrar notificações
    function showToast(message, type = 'info') {
        // Implementação básica de notificação
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Adicionar estilos para as notificações
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.5s forwards;
        }
        .toast-info {
            background-color: #2a6f97;
        }
        .toast-success {
            background-color: #4caf50;
        }
        .toast-error {
            background-color: #f44336;
        }
        .fade-out {
            animation: fadeOut 0.5s forwards;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Adicionar estilos para status e perfis
    const statusStyles = document.createElement('style');
    statusStyles.textContent = `
        .status-active {
            color: #4caf50;
            font-weight: bold;
        }
        .status-inactive {
            color: #f44336;
            font-weight: bold;
        }
        .status-pending {
            color: #ff9800;
            font-weight: bold;
        }
        .role-admin {
            color: #9c27b0;
            font-weight: bold;
        }
        .role-professor {
            color: #2196f3;
            font-weight: bold;
        }
        .role-aluno {
            color: #00bcd4;
            font-weight: bold;
        }
        .action-btn {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            margin: 0 5px;
            font-size: 16px;
            transition: all 0.3s;
        }
        .action-btn:hover {
            transform: scale(1.2);
        }
        .edit {
            color: #2196f3;
        }
        .delete {
            color: #f44336;
        }
        .assign {
            color: #4caf50;
        }
    `;
    document.head.appendChild(statusStyles);
});

// No final do arquivo AdminGestao.js, substitua as funções globais por:
window.editUser = function(userId) {
    document.dispatchEvent(new CustomEvent('editUserEvent', { detail: userId }));
};

window.confirmDeleteUser = function(userId) {
    document.dispatchEvent(new CustomEvent('confirmDeleteUserEvent', { detail: userId }));
};

window.assignTurmaToProfessor = function(professorId, professorName) {
    document.dispatchEvent(new CustomEvent('assignTurmaToProfessorEvent', { 
        detail: { professorId, professorName }
    }));
};

window.previousPage = function(type) {
    document.dispatchEvent(new CustomEvent('previousPageEvent', { detail: type }));
};

window.nextPage = function(type) {
    document.dispatchEvent(new CustomEvent('nextPageEvent', { detail: type }));
};

window.gerarSenha = function(fieldId) {
    document.dispatchEvent(new CustomEvent('gerarSenhaEvent', { detail: fieldId }));
};

window.exportarDados = function() {
    document.dispatchEvent(new Event('exportarDadosEvent'));
};

window.closeModal = function(modalId) {
    document.dispatchEvent(new CustomEvent('closeModalEvent', { detail: modalId }));
};

window.openModal = function(modalId) {
    document.dispatchEvent(new CustomEvent('openModalEvent', { detail: modalId }));
};

window.confirmAction = function() {
    document.dispatchEvent(new Event('confirmActionEvent'));
};
