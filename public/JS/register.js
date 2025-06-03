const btnAluno = document.getElementById('btnAluno');
const btnProfessor = document.getElementById('btnProfessor');
const btnAdmin = document.getElementById('btnAdmin');
const tipoUsuario = document.getElementById('tipoUsuario');
const dadosContainer = document.getElementById('dadosContainer');
const escolherPlanoBtn = document.getElementById('escolherPlanoBtn');
const cadastrarBtn = document.getElementById('cadastrarBtn');
const modalPlano = document.getElementById('modalPlano');
const closeModal = document.getElementById('closeModal');
let planoEscolhido = null;

btnAluno.addEventListener('click', function() {
    tipoUsuario.value = 'aluno';
    btnAluno.classList.add('selected-tipo');
    btnProfessor.classList.remove('selected-tipo');
    btnAdmin.classList.remove('selected-tipo');
    dadosContainer.style.display = 'block';
    escolherPlanoBtn.style.display = 'block';
    cadastrarBtn.style.display = 'none';
});

btnProfessor.addEventListener('click', function() {
    tipoUsuario.value = 'professor';
    btnProfessor.classList.add('selected-tipo');
    btnAluno.classList.remove('selected-tipo');
    btnAdmin.classList.remove('selected-tipo');
    dadosContainer.style.display = 'block';
    escolherPlanoBtn.style.display = 'none';
    cadastrarBtn.style.display = 'block';
});

btnAdmin.addEventListener('click', function() {
    tipoUsuario.value = 'admin';
    btnAdmin.classList.add('selected-tipo');
    btnAluno.classList.remove('selected-tipo');
    btnProfessor.classList.remove('selected-tipo');
    dadosContainer.style.display = 'block';
    escolherPlanoBtn.style.display = 'none';
    cadastrarBtn.style.display = 'block';
});

// Modal plano
escolherPlanoBtn.addEventListener('click', function() {
    modalPlano.classList.add('active');
    document.body.style.overflow = 'hidden';
});
closeModal.addEventListener('click', function() {
    modalPlano.classList.remove('active');
    document.body.style.overflow = '';
});
window.addEventListener('click', function(e) {
    if(e.target === modalPlano) {
        modalPlano.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Seleção de plano
modalPlano.querySelectorAll('.plano-card-modal').forEach(card => {
    card.querySelector('button').addEventListener('click', function(e) {
        e.stopPropagation();
        modalPlano.querySelectorAll('.plano-card-modal').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        planoEscolhido = card.getAttribute('data-plano');
        modalPlano.classList.remove('active');
        document.body.style.overflow = '';
        cadastrarBtn.style.display = 'block';
        escolherPlanoBtn.style.display = 'block';
        escolherPlanoBtn.textContent = 'Trocar plano';
    });
});

document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if(data.tipoUsuario === 'aluno'){
        if(!planoEscolhido){
            alert('Escolha um plano para finalizar o cadastro!');
            return;
        }
        data.plano = planoEscolhido;
    }
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        alert(response.message);
        if (response.message === 'Cadastro efetuado!') {
            window.location.href = response.rota
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar o formulário.');
    });
})

// Máscara para CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', function(e) {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, '$1.$2');
    if (v.length > 7) v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (v.length > 11) v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.value = v;
});
// Máscara para telefone
const telInput = document.getElementById('telefone');
telInput.addEventListener('input', function(e) {
    let v = this.value.replace(/\D/g, '');
    if (v.length > 2) v = v.replace(/(\d{2})(\d)/, '($1) $2');
    if (v.length > 7) v = v.replace(/(\(\d{2}\) \d{5})(\d)/, '$1-$2');
    else if (v.length > 6) v = v.replace(/(\(\d{2}\) \d{4})(\d)/, '$1-$2');
    this.value = v;
});
// Máscara para email (validação visual simples)
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', function() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !re.test(this.value)) {
        this.style.border = '2px solid #ff5252';
    } else {
        this.style.border = '';
    }
});