// Dados simulados de mensagens e conversas
const mensagensData = {
    // Mensagens globais
    globais: [
        {
            id: 1,
            aluno: "João Silva",
            turma: "Desenvolvimento Web - Turma A",
            turmaId: "1",
            data: "10/05/2024 10:30",
            texto: "Professor, tive uma dúvida sobre o exercício de HTML que passou na última aula. Na parte de formulários, não consegui fazer a validação funcionar corretamente. Poderia me explicar novamente?",
            status: "pendente",
            lida: false
        },
        {
            id: 2,
            aluno: "Maria Oliveira",
            turma: "GitHub Avançado - Turma B",
            turmaId: "2",
            data: "09/05/2024 15:20",
            texto: "Obrigada pelo feedback no meu projeto! Suas observações foram muito úteis para melhorar meu entendimento sobre branches no GitHub.",
            status: "respondida",
            lida: true
        },
        {
            id: 3,
            aluno: "Grupo - Turma C",
            turma: "JavaScript Moderno - Turma C",
            turmaId: "3",
            data: "05/05/2024 18:45",
            texto: "Carlos: Alguém pode me ajudar com o GitHub? Estou com problemas para fazer push do meu projeto.",
            status: "pendente",
            lida: false
        },
        {
            id: 4,
            aluno: "Pedro Santos",
            turma: "Desenvolvimento Web - Turma A",
            turmaId: "1",
            data: "03/05/2024 22:10",
            texto: "Enviei o trabalho atrasado, por favor confira. Tive alguns problemas pessoais que me impediram de entregar no prazo.",
            status: "pendente",
            lida: true
        }
    ],
    
    // Conversas individuais
    conversas: [
        {
            id: 1,
            aluno: "João Silva",
            turma: "Turma A",
            turmaId: "1",
            mensagens: [
                {
                    remetente: "João Silva",
                    data: "10/05/2024 10:30",
                    texto: "Professor, tive uma dúvida sobre o exercício de HTML que passou na última aula. Na parte de formulários, não consegui fazer a validação funcionar corretamente. Poderia me explicar novamente?",
                    lida: false
                },
                {
                    remetente: "Você",
                    data: "10/05/2024 10:45",
                    texto: "Claro, João. O problema provavelmente está no atributo \"required\" dos campos. Você adicionou ele em todos os inputs obrigatórios? Além disso, verifique se o type de cada input está correto (email, password, etc).",
                    lida: true
                },
                {
                    remetente: "João Silva",
                    data: "10/05/2024 11:02",
                    texto: "Ah, verdade! Esqueci do \"required\". Agora funcionou, obrigado! Só mais uma coisa: como faço para personalizar a mensagem de erro?",
                    lida: false
                }
            ]
        },
        {
            id: 2,
            aluno: "Maria Oliveira",
            turma: "Turma B",
            turmaId: "2",
            mensagens: [
                {
                    remetente: "Maria Oliveira",
                    data: "09/05/2024 15:20",
                    texto: "Obrigada pelo feedback no meu projeto! Suas observações foram muito úteis para melhorar meu entendimento sobre branches no GitHub.",
                    lida: true
                },
                {
                    remetente: "Você",
                    data: "09/05/2024 15:45",
                    texto: "De nada, Maria! Fico feliz que tenha sido útil. Seu progresso está muito bom, continue assim!",
                    lida: true
                }
            ]
        },
        {
            id: 3,
            aluno: "Grupo - Turma C",
            turma: "Turma C",
            turmaId: "3",
            mensagens: [
                {
                    remetente: "Carlos Pereira",
                    data: "05/05/2024 18:45",
                    texto: "Alguém pode me ajudar com o GitHub? Estou com problemas para fazer push do meu projeto.",
                    lida: false
                }
            ]
        },
        {
            id: 4,
            aluno: "Pedro Santos",
            turma: "Turma A",
            turmaId: "1",
            mensagens: [
                {
                    remetente: "Pedro Santos",
                    data: "03/05/2024 22:10",
                    texto: "Enviei o trabalho atrasado, por favor confira. Tive alguns problemas pessoais que me impediram de entregar no prazo.",
                    lida: true
                }
            ]
        }
    ]
};

// Variáveis de estado
let conversaAtual = 1;
let secaoAtiva = "mensagensGlobais";

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botões de navegação
    document.getElementById('btnMensagensGlobais').addEventListener('click', function() {
        secaoAtiva = "mensagensGlobais";
        atualizarSecoes();
        this.classList.remove('bg-gray-600');
        document.getElementById('btnConversas').classList.add('bg-gray-600');
    });

    document.getElementById('btnConversas').addEventListener('click', function() {
        secaoAtiva = "conversas";
        atualizarSecoes();
        this.classList.remove('bg-gray-600');
        document.getElementById('btnMensagensGlobais').classList.add('bg-gray-600');
    });

    // Configurar filtros
    document.getElementById('filtroTurma').addEventListener('change', filtrarMensagens);
    document.getElementById('filtroStatus').addEventListener('change', filtrarMensagens);
    document.getElementById('ordenarPor').addEventListener('change', filtrarMensagens);

    // Configurar pesquisa de conversas
    document.getElementById('pesquisarConversas').addEventListener('input', pesquisarConversas);

    // Carregar dados iniciais
    carregarMensagensGlobais();
    selecionarConversa(1);
});

// Funções de navegação
function atualizarSecoes() {
    document.querySelectorAll('.secao-mensagens').forEach(secao => {
        secao.classList.remove('ativa');
    });
    document.getElementById(secaoAtiva).classList.add('ativa');
}

// Funções para mensagens globais
function carregarMensagensGlobais() {
    // Implementação seria feita via AJAX na prática
    console.log("Mensagens globais carregadas");
}

function filtrarMensagens() {
    const turma = document.getElementById('filtroTurma').value;
    const status = document.getElementById('filtroStatus').value;
    const ordenacao = document.getElementById('ordenarPor').value;

    console.log(`Filtrando por: Turma=${turma}, Status=${status}, Ordenação=${ordenacao}`);
    // Implementação real filtraria os dados e atualizaria a exibição
}

function marcarComoLida(mensagemId) {
    const mensagem = mensagensData.globais.find(m => m.id === mensagemId);
    if (mensagem) {
        mensagem.lida = true;
        mensagem.status = "respondida";
        alert(`Mensagem de ${mensagem.aluno} marcada como lida.`);
        // Atualizar a exibição
    }
}

function responderMensagem(mensagemId, destinatario) {
    // Alternar para a seção de conversas
    secaoAtiva = "conversas";
    atualizarSecoes();
    document.getElementById('btnMensagensGlobais').classList.add('bg-gray-600');
    document.getElementById('btnConversas').classList.remove('bg-gray-600');

    // Encontrar a conversa correspondente
    const conversa = mensagensData.conversas.find(c => 
        c.aluno === destinatario.split(' - ')[0] || 
        c.aluno === destinatario
    );

    if (conversa) {
        selecionarConversa(conversa.id);
        document.getElementById('editorMensagem').focus();
    } else {
        // Criar nova conversa se não existir
        const novaConversa = {
            id: mensagensData.conversas.length + 1,
            aluno: destinatario.split(' - ')[0],
            turma: destinatario.includes(' - ') ? destinatario.split(' - ')[1] : '',
            turmaId: mensagensData.globais.find(m => m.id === mensagemId)?.turmaId || '1',
            mensagens: []
        };
        mensagensData.conversas.push(novaConversa);
        selecionarConversa(novaConversa.id);
        document.getElementById('editorMensagem').focus();
    }
}

// Funções para conversas
function pesquisarConversas() {
    const termo = document.getElementById('pesquisarConversas').value.toLowerCase();
    document.querySelectorAll('.conversa-item').forEach(item => {
        const texto = item.textContent.toLowerCase();
        if (texto.includes(termo)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function selecionarConversa(conversaId) {
    conversaAtual = conversaId;
    
    // Atualizar a lista de conversas
    document.querySelectorAll('.conversa-item').forEach(item => {
        item.classList.remove('conversa-ativa');
        if (parseInt(item.getAttribute('data-conversa')) === conversaId) {
            item.classList.add('conversa-ativa');
        }
    });
    
    // Carregar mensagens da conversa
    const conversa = mensagensData.conversas.find(c => c.id === conversaId);
    if (conversa) {
        document.getElementById('tituloConversa').textContent = `${conversa.aluno} - ${conversa.turma}`;
        
        const container = document.querySelector('.mensagens-container');
        container.innerHTML = '';
        
        conversa.mensagens.forEach(msg => {
            const div = document.createElement('div');
            div.className = `mensagem-card mb-4 ${msg.remetente !== 'Você' && !msg.lida ? 'mensagem-nao-lida' : ''}`;
            if (msg.remetente === 'Você') {
                div.style.borderLeftColor = 'var(--secondary-color)';
            }
            
            div.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold">${msg.remetente}</span>
                    <span class="text-xs text-gray-400">${msg.data}</span>
                </div>
                <p>${msg.texto}</p>
            `;
            
            container.appendChild(div);
            
            // Marcar como lida ao exibir
            if (msg.remetente !== 'Você') {
                msg.lida = true;
            }
        });
        
        // Rolagem para baixo
        container.scrollTop = container.scrollHeight;
    }
}

function enviarResposta() {
    const editor = document.getElementById('editorMensagem');
    const texto = editor.innerHTML.trim();
    
    if (texto === '' || texto === '<br>') {
        alert('Digite uma mensagem antes de enviar.');
        return;
    }
    
    const conversa = mensagensData.conversas.find(c => c.id === conversaAtual);
    if (conversa) {
        const novaMensagem = {
            remetente: 'Você',
            data: new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            texto: texto,
            lida: true
        };
        
        conversa.mensagens.push(novaMensagem);
        editor.innerHTML = '';
        
        // Atualizar a exibição
        selecionarConversa(conversaAtual);
        
        // Simular resposta do aluno (apenas para demonstração)
        if (Math.random() > 0.5) {
            setTimeout(() => {
                const respostas = [
                    "Obrigado pela ajuda, professor!",
                    "Entendi agora, muito obrigado!",
                    "Vou tentar fazer isso, obrigado!",
                    "Ainda estou com dúvida, poderia explicar de outra forma?",
                    "Funcionou perfeitamente, valeu!"
                ];
                
                const respostaAluno = {
                    remetente: conversa.aluno,
                    data: new Date().toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    texto: respostas[Math.floor(Math.random() * respostas.length)],
                    lida: false
                };
                
                conversa.mensagens.push(respostaAluno);
                selecionarConversa(conversaAtual);
                
                // Atualizar notificação na lista de conversas
                const conversaItem = document.querySelector(`.conversa-item[data-conversa="${conversa.id}"]`);
                if (!conversaItem.querySelector('.notificacao-nao-lida')) {
                    const notificacao = document.createElement('span');
                    notificacao.className = 'notificacao-nao-lida';
                    conversaItem.querySelector('h4').appendChild(notificacao);
                }
            }, 2000);
        }
    }
}

// Funções auxiliares
function formatarData(data) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(data).toLocaleString('pt-BR', options);
}