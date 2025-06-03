const { jsPDF } = window.jspdf;
    
    // Atualizar datas de conclusão
    document.getElementById('githubDate').textContent = new Date().toLocaleDateString();
    document.getElementById('htmlDate').textContent = new Date().toLocaleDateString();
    document.getElementById('jsDate').textContent = new Date().toLocaleDateString();
    

updateGitHubProgress();
updateHtmlProgress();
updateJsProgress();

var gitPercentage = 0;
var htmlPercentage = 0;
var jsPercentage = 0;

function listCourses(){
    fetch('/listCourses')
    .then(response => response.json())
    .then(data => {
    const enrolledCourses = document.getElementById('enrolledCourses');
                
    enrolledCourses.innerHTML = '<ul>';
                
    data.forEach(row => {
        enrolledCourses.innerHTML += `<li>${row.courseName}</li>`                
    });

    enrolledCourses.innerHTML += '</ul>';
    })
    .catch(error => {
        console.error("Erro ao buscar dados do usuário: " + error);
    });
}

function fetchData() {
   return fetch('/userInfo')
    .then(response => response.json())
    .then(data => {

        console.log('Dados do fetch: ' + data[0].userName)
            
            return data[0].userName

    })
    .catch(error => {
        console.error("Erro ao buscar dados do usuário: " + error);
        return null
    });
}

function updateGitHubProgress() {
    fetch('/gitProgressPercentage')
    .then(response => response.json())
    .then(data => { 
        data.forEach(row => {
            gitPercentage = `${row.percentage}%`;
        })
    })
}

function updateHtmlProgress() {
    fetch('/htmlcssProgressPercentage')
    .then(response => response.json())
    .then(data => { 
        data.forEach(row => {
            htmlPercentage = `${row.percentage}%`;
        })
    })
}

function updateJsProgress() {
    fetch('/jsProgressPercentage')
    .then(response => response.json())
    .then(data => { 
        data.forEach(row => {
            jsPercentage = `${row.percentage}%`;
        })
    })
}

function generateCertificate(courseName) {
    fetchData().then(studentName => {

        if(!studentName) {
            console.error('Nome do estudante não encontrado!')
            return  
        }
    

    console.log('NOME DO ESTUDANTE: ' + studentName )
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    let courseHours;
    switch(courseName) {
        case 'GitHub':
            courseHours = 20;
            break;
        case 'HTML/CSS':
            courseHours = 90;
            break;
        case 'JavaScript':
            courseHours = 90;
            break;
        default:
            courseHours = 0;
    }

    // Configurações do certificado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(44, 62, 80);

    // Título
    doc.text("Certificado de Conclusão", 150, 50, { align: "center" });

    // Conteúdo
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(
        `Certificamos que ${studentName} concluiu com êxito o curso de ${courseName},\n` +
        `com carga horária de ${courseHours} minutos, finalizado em ${new Date().toLocaleDateString()}.`,
        150, 100, { align: "center", maxWidth: 200 }
    );

    // Assinatura
    doc.setFontSize(14);
    doc.text("SMGFAP Courses", 150, 160, { align: "center"});
    doc.line(100, 165, 200, 165); // Linha para assinatura
    doc.setFontSize(12);
    doc.text("Diretor de Ensino", 150, 175, { align: "center" });

    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Certificado emitido eletronicamente", 150, 190, { align: "center" });

    // Download do certificado
    doc.save(`Certificado_${courseName}_${studentName}.pdf`);

    // Mostrar mensagem de sucesso
    const courseCard = document.querySelector(`.course-card:has(button[onclick*="${courseName}"])`);
    const successMessage = courseCard.querySelector('.success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
})
}
document.body.classList.toggle('dark-mode');
        AOS.init({
            duration: 1000,
            once: true
        });