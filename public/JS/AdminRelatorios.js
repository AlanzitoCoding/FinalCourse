document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os gráficos e dados
    initCharts();
    loadReportData();
    setupEventListeners();
});

function setupEventListeners() {
    // Filtros
    document.getElementById('filterPeriodo').addEventListener('change', function() {
        const customDateRange = document.getElementById('customDateRange');
        if (this.value === 'custom') {
            customDateRange.classList.remove('hidden');
        } else {
            customDateRange.classList.add('hidden');
        }
    });

    // Botão aplicar filtros
    document.getElementById('applyFilters').addEventListener('click', function() {
        applyFilters();
    });

    // Botão exportar
    document.getElementById('exportRelatorio').addEventListener('click', function() {
        exportReport();
    });

    // Botão atualizar
    document.getElementById('refreshRelatorio').addEventListener('click', function() {
        refreshReport();
    });
}

function initCharts() {
    // Gráfico de Progresso por Curso
    const progressoCtx = document.getElementById('progressoChart').getContext('2d');
    window.progressoChart = new Chart(progressoCtx, {
        type: 'bar',
        data: {
            labels: ['Desenvolvimento Web', 'GitHub Avançado', 'JavaScript Moderno'],
            datasets: [{
                label: 'Progresso Médio (%)',
                data: [75, 62, 45],
                backgroundColor: [
                    'rgba(42, 111, 151, 0.7)',
                    'rgba(97, 165, 194, 0.7)',
                    'rgba(66, 153, 225, 0.7)'
                ],
                borderColor: [
                    'rgba(42, 111, 151, 1)',
                    'rgba(97, 165, 194, 1)',
                    'rgba(66, 153, 225, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Engajamento por Turma
    const engajamentoCtx = document.getElementById('engajamentoChart').getContext('2d');
    window.engajamentoChart = new Chart(engajamentoCtx, {
        type: 'doughnut',
        data: {
            labels: ['Ativos', 'Moderados', 'Inativos'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function loadReportData() {
    // Simulação de dados - na prática, você faria uma requisição AJAX
    const reportData = {
        totalAlunos: 73,
        taxaConclusao: '64%',
        tempoMedio: '3.2h',
        atividadesConcluidas: 215,
        turmas: [
            {
                id: 1,
                nome: 'Turma A',
                curso: 'Desenvolvimento Web',
                alunos: 25,
                progresso: '75%',
                conclusao: '68%',
                professor: 'Carlos Silva'
            },
            {
                id: 2,
                nome: 'Turma B',
                curso: 'GitHub Avançado',
                alunos: 18,
                progresso: '62%',
                conclusao: '55%',
                professor: 'Ana Oliveira'
            },
            {
                id: 3,
                nome: 'Turma C',
                curso: 'JavaScript Moderno',
                alunos: 30,
                progresso: '45%',
                conclusao: '40%',
                professor: 'João Santos'
            }
        ]
    };

    // Atualiza os dados do resumo
    document.getElementById('totalAlunos').textContent = reportData.totalAlunos;
    document.getElementById('taxaConclusao').textContent = reportData.taxaConclusao;
    document.getElementById('tempoMedio').textContent = reportData.tempoMedio;
    document.getElementById('atividadesConcluidas').textContent = reportData.atividadesConcluidas;

    // Preenche a tabela de turmas
    const turmasTable = document.getElementById('turmasTable');
    turmasTable.innerHTML = '';

    reportData.turmas.forEach(turma => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${turma.nome}</td>
            <td>${turma.curso}</td>
            <td>${turma.alunos}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-fill" style="width: ${turma.progresso}"></div>
                </div>
                <span>${turma.progresso}</span>
            </td>
            <td>${turma.conclusao}</td>
            <td>
                <button class="btn-primary text-sm" onclick="openTurmaDetails(${turma.id})">
                    <i class="fas fa-eye mr-1"></i>Detalhes
                </button>
            </td>
        `;
        turmasTable.appendChild(row);
    });
}

function applyFilters() {
    // Simulação de aplicação de filtros
    const curso = document.getElementById('filterCurso').value;
    const turma = document.getElementById('filterTurma').value;
    const periodo = document.getElementById('filterPeriodo').value;
    
    let mensagem = 'Filtros aplicados: ';
    if (curso !== 'all') mensagem += `Curso: ${document.getElementById('filterCurso').options[document.getElementById('filterCurso').selectedIndex].text}, `;
    if (turma !== 'all') mensagem += `Turma: ${document.getElementById('filterTurma').options[document.getElementById('filterTurma').selectedIndex].text}, `;
    mensagem += `Período: ${document.getElementById('filterPeriodo').options[document.getElementById('filterPeriodo').selectedIndex].text}`;
    
    console.log(mensagem);
    // Na prática, você faria uma requisição AJAX com os parâmetros de filtro
    // e atualizaria os gráficos e tabelas com os novos dados
    
    // Simulando atualização
    alert('Relatório atualizado com os filtros selecionados');
    refreshReport();
}

function exportReport() {
    // Simulação de exportação de relatório
    alert('Relatório exportado com sucesso!');
    // Na prática, você poderia gerar um PDF ou CSV com os dados
}

function refreshReport() {
    // Simulação de atualização de dados
    console.log('Atualizando relatório...');
    loadReportData();
    
    // Atualiza os gráficos
    window.progressoChart.update();
    window.engajamentoChart.update();
}

function openTurmaDetails(turmaId) {
    // Simulação de dados detalhados da turma
    const turmas = [
        {
            id: 1,
            nome: 'Turma A',
            curso: 'Desenvolvimento Web',
            horario: 'Segundas e Quartas, 19:00-21:00',
            alunos: 25,
            progresso: '75%',
            conclusao: '68%',
            professor: 'Carlos Silva',
            alunosList: [
                { nome: 'João Silva', progresso: '80%', ultimoAcesso: '10/05/2024', status: 'Ativo' },
                { nome: 'Maria Oliveira', progresso: '90%', ultimoAcesso: '09/05/2024', status: 'Ativo' },
                { nome: 'Pedro Santos', progresso: '65%', ultimoAcesso: '08/05/2024', status: 'Moderado' },
                { nome: 'Ana Costa', progresso: '70%', ultimoAcesso: '07/05/2024', status: 'Ativo' }
            ]
        },
        {
            id: 2,
            nome: 'Turma B',
            curso: 'GitHub Avançado',
            horario: 'Terças e Quintas, 14:00-16:00',
            alunos: 18,
            progresso: '62%',
            conclusao: '55%',
            professor: 'Ana Oliveira',
            alunosList: [
                { nome: 'Carlos Mendes', progresso: '75%', ultimoAcesso: '10/05/2024', status: 'Ativo' },
                { nome: 'Juliana Pereira', progresso: '50%', ultimoAcesso: '05/05/2024', status: 'Moderado' },
                { nome: 'Fernando Souza', progresso: '60%', ultimoAcesso: '09/05/2024', status: 'Ativo' }
            ]
        },
        {
            id: 3,
            nome: 'Turma C',
            curso: 'JavaScript Moderno',
            horario: 'Sábados, 9:00-13:00',
            alunos: 30,
            progresso: '45%',
            conclusao: '40%',
            professor: 'João Santos',
            alunosList: [
                { nome: 'Roberto Almeida', progresso: '60%', ultimoAcesso: '08/05/2024', status: 'Moderado' },
                { nome: 'Patrícia Lima', progresso: '30%', ultimoAcesso: '03/05/2024', status: 'Inativo' },
                { nome: 'Lucas Fernandes', progresso: '50%', ultimoAcesso: '10/05/2024', status: 'Moderado' },
                { nome: 'Camila Ribeiro', progresso: '40%', ultimoAcesso: '07/05/2024', status: 'Inativo' }
            ]
        }
    ];

    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) return;

    // Preenche o modal com os dados da turma
    document.getElementById('modalTurmaTitle').textContent = `${turma.curso} - ${turma.nome}`;
    document.getElementById('modalTurmaCurso').textContent = `Curso: ${turma.curso}`;
    document.getElementById('modalTurmaHorario').textContent = `Horário: ${turma.horario}`;
    document.getElementById('modalTurmaProfessor').textContent = `Professor: ${turma.professor}`;
    document.getElementById('modalTurmaAlunos').textContent = `Alunos: ${turma.alunos}`;
    document.getElementById('modalTurmaProgresso').textContent = `Progresso médio: ${turma.progresso}`;
    document.getElementById('modalTurmaConclusao').textContent = `Taxa de conclusão: ${turma.conclusao}`;

    // Preenche a lista de alunos
    const alunosList = document.getElementById('modalAlunosList');
    alunosList.innerHTML = '';
    
    turma.alunosList.forEach(aluno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-fill" style="width: ${aluno.progresso}"></div>
                </div>
                <span>${aluno.progresso}</span>
            </td>
            <td>${aluno.ultimoAcesso}</td>
            <td>
                <span class="status-badge ${getStatusClass(aluno.status)}">${aluno.status}</span>
            </td>
        `;
        alunosList.appendChild(row);
    });

    // Abre o modal
    document.getElementById('detalhesModal').style.display = 'block';
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'ativo': return 'bg-green-500';
        case 'moderado': return 'bg-yellow-500';
        case 'inativo': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funções globais para serem chamadas do HTML
window.openTurmaDetails = openTurmaDetails;
window.closeModal = closeModal;