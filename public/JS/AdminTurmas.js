// Dados simulados para as turmas
const turmasData = {
    1: {
        nome: "Desenvolvimento Web - Turma A",
        horario: "Segundas e Quartas, 19:00-21:00",
        curso: "Desenvolvimento Web",
        alunos: 25,
        progresso: 75,
        alunosLista: [
            { nome: "João Silva", progresso: 90, ultimoAcesso: "10/05/2024" },
            { nome: "Maria Oliveira", progresso: 85, ultimoAcesso: "09/05/2024" },
            { nome: "Carlos Souza", progresso: 78, ultimoAcesso: "08/05/2024" },
            { nome: "Ana Costa", progresso: 65, ultimoAcesso: "10/05/2024" },
            { nome: "Pedro Santos", progresso: 72, ultimoAcesso: "07/05/2024" }
        ],
        mensagens: [
            { remetente: "João Silva", data: "10/05/2024 19:30", texto: "Professor, tenho uma dúvida sobre o exercício da semana passada." },
            { remetente: "Você", data: "10/05/2024 20:15", texto: "João, qual é exatamente sua dúvida?" },
            { remetente: "Maria Oliveira", data: "09/05/2024 15:20", texto: "Boa tarde, quando será disponibilizado o próximo material?" }
        ]
    },
    2: {
        nome: "GitHub Avançado - Turma B",
        horario: "Terças e Quintas, 14:00-16:00",
        curso: "GitHub Avançado",
        alunos: 18,
        progresso: 62,
        alunosLista: [
            { nome: "Fernanda Lima", progresso: 75, ultimoAcesso: "09/05/2024" },
            { nome: "Ricardo Alves", progresso: 60, ultimoAcesso: "08/05/2024" },
            { nome: "Patrícia Nunes", progresso: 55, ultimoAcesso: "07/05/2024" },
            { nome: "Lucas Mendes", progresso: 48, ultimoAcesso: "06/05/2024" },
            { nome: "Juliana Castro", progresso: 72, ultimoAcesso: "09/05/2024" }
        ],
        mensagens: [
            { remetente: "Fernanda Lima", data: "08/05/2024 14:45", texto: "Não consegui resolver o conflito no merge, pode ajudar?" },
            { remetente: "Você", data: "08/05/2024 15:30", texto: "Fernanda, me envie o print do erro por favor." },
            { remetente: "Ricardo Alves", data: "07/05/2024 16:20", texto: "O repositório do exercício está privado?" }
        ]
    },
    3: {
        nome: "JavaScript Moderno - Turma C",
        horario: "Sábados, 9:00-13:00",
        curso: "JavaScript Moderno",
        alunos: 30,
        progresso: 45,
        alunosLista: [
            { nome: "Gabriel Martins", progresso: 60, ultimoAcesso: "06/05/2024" },
            { nome: "Amanda Rocha", progresso: 52, ultimoAcesso: "05/05/2024" },
            { nome: "Rodrigo Ferreira", progresso: 40, ultimoAcesso: "04/05/2024" },
            { nome: "Tatiana Gomes", progresso: 38, ultimoAcesso: "03/05/2024" },
            { nome: "Marcos Dias", progresso: 35, ultimoAcesso: "06/05/2024" }
        ],
        mensagens: [
            { remetente: "Gabriel Martins", data: "06/05/2024 10:20", texto: "Não entendi a diferença entre let e const." },
            { remetente: "Você", data: "06/05/2024 11:05", texto: "Gabriel, let permite reatribuição, const não." },
            { remetente: "Amanda Rocha", data: "05/05/2024 12:30", texto: "Quando será o próximo encontro presencial?" }
        ]
    }
};

// Variável para armazenar a turma atualmente selecionada
let currentTurmaId = null;
let currentTab = 'alunos';

// Funções para manipulação de modais
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Formulário de nova turma
document.getElementById('novaTurmaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Aqui você pode adicionar lógica para criar a turma
    alert('Turma criada com sucesso!');
    closeModal('novaTurmaModal');
    // Limpar o formulário
    this.reset();
});

// Função para abrir os detalhes da turma
function openTurmaDetail(turmaId, tab) {
    currentTurmaId = turmaId;
    currentTab = tab || 'alunos';
    
    const turma = turmasData[turmaId];
    document.getElementById('turmaDetailTitle').textContent = turma.nome;
    
    // Atualizar informações da aba Detalhes
    document.getElementById('turmaHorario').textContent = `Horário: ${turma.horario}`;
    document.getElementById('turmaCurso').textContent = `Curso: ${turma.curso}`;
    document.getElementById('turmaAlunos').textContent = `Total de Alunos: ${turma.alunos}`;
    document.getElementById('turmaProgresso').textContent = `Progresso Médio: ${turma.progresso}%`;
    document.getElementById('taxaConclusao').textContent = `${turma.progresso}%`;
    document.getElementById('progressoConclusao').style.width = `${turma.progresso}%`;
    
    // Calcular atividade recente (simulado)
    const atividadeRecente = Math.min(100, turma.progresso + 15);
    document.getElementById('atividadeRecente').textContent = `${atividadeRecente}%`;
    document.getElementById('progressoAtividade').style.width = `${atividadeRecente}%`;
    
    // Carregar lista de alunos
    const alunosList = document.getElementById('alunosList');
    alunosList.innerHTML = '';
    turma.alunosLista.forEach(aluno => {
        const row = document.createElement('tr');
        row.className = 'aluno-item';
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${aluno.progresso}%"></div>
                </div>
                <span class="text-sm">${aluno.progresso}%</span>
            </td>
            <td>${aluno.ultimoAcesso}</td>
            <td>
                <button class="text-blue-400 hover:text-blue-300" onclick="enviarMensagemAluno('${aluno.nome}')">
                    <i class="fas fa-envelope"></i>
                </button>
            </td>
        `;
        alunosList.appendChild(row);
    });
    
    // Carregar mensagens
    const mensagensList = document.getElementById('mensagensList');
    mensagensList.innerHTML = '';
    turma.mensagens.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'neumorphic p-4';
        msgDiv.innerHTML = `
            <div class="flex justify-between mb-2">
                <strong>${msg.remetente}</strong>
                <span class="text-gray-400">${msg.data}</span>
            </div>
            <p>${msg.texto}</p>
        `;
        mensagensList.appendChild(msgDiv);
    });
    
    // Ativar a aba solicitada
    changeTab(currentTab);
    
    // Abrir o modal
    openModal('turmaDetailModal');
}

// Função para trocar de aba
function changeTab(tabName) {
    currentTab = tabName;
    
    // Desativar todas as abas e botões
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativar a aba e botão selecionados
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab-button').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
}

// Função para enviar mensagem para a turma
function enviarMensagem() {
    const mensagemTexto = document.getElementById('novaMensagem').value.trim();
    if (mensagemTexto === '') return;
    
    const turma = turmasData[currentTurmaId];
    const novaMensagem = {
        remetente: "Você",
        data: new Date().toLocaleString('pt-BR'),
        texto: mensagemTexto
    };
    
    turma.mensagens.unshift(novaMensagem);
    
    // Atualizar a lista de mensagens
    const mensagensList = document.getElementById('mensagensList');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'neumorphic p-4';
    msgDiv.innerHTML = `
        <div class="flex justify-between mb-2">
            <strong>${novaMensagem.remetente}</strong>
            <span class="text-gray-400">${novaMensagem.data}</span>
        </div>
        <p>${novaMensagem.texto}</p>
    `;
    mensagensList.insertBefore(msgDiv, mensagensList.firstChild);
    
    // Limpar o campo de mensagem
    document.getElementById('novaMensagem').value = '';
    
    // Feedback visual
    const feedback = document.createElement('div');
    feedback.className = 'text-green-500 text-sm mt-2';
    feedback.textContent = 'Mensagem enviada com sucesso!';
    mensagensList.parentNode.insertBefore(feedback, mensagensList.nextSibling);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Função para enviar mensagem para aluno específico
function enviarMensagemAluno(alunoNome) {
    changeTab('mensagens');
    document.getElementById('novaMensagem').value = `@${alunoNome} `;
    document.getElementById('novaMensagem').focus();
}

// Função para confirmar exclusão da turma
function confirmarExclusao() {
    if (confirm(`Tem certeza que deseja excluir a turma "${turmasData[currentTurmaId].nome}"? Esta ação não pode ser desfeita.`)) {
        alert(`Turma "${turmasData[currentTurmaId].nome}" excluída com sucesso!`);
        closeModal('turmaDetailModal');
        // Aqui você adicionaria a lógica para realmente excluir a turma
    }
}

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', function() {
    // Pode adicionar inicializações aqui se necessário
});