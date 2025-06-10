// Lógica para carregar dados e interações
        document.addEventListener('DOMContentLoaded', function() {
            // Carregar estatísticas
            fetchAdminData();
            
            // Configurar eventos
            document.getElementById('novo-curso').addEventListener('click', showCursoForm);
        });
        
        function fetchAdminData() {
            // Chamadas AJAX para buscar dados do servidor
            fetch('/admin/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('total-cursos').textContent = data.totalCursos;
                    document.getElementById('total-usuarios').textContent = data.totalUsuarios;
                    document.getElementById('total-conclusoes').textContent = data.totalConclusoes;
                });
                
            fetch('/admin/cursos')
                .then(response => response.json())
                .then(data => {
                    const lista = document.getElementById('lista-cursos');
                    lista.innerHTML = '';
                    data.cursos.forEach(curso => {
                        lista.innerHTML += `
                            <div class="curso-item">
                                <h4>${curso.nome}</h4>
                                <p>${curso.descricao}</p>
                                <button onclick="editarCurso(${curso.id})">Editar</button>
                                <button onclick="removerCurso(${curso.id})">Remover</button>
                            </div>
                        `;
                    });
                });
        }
        
        function showCursoForm() {
            // Mostrar formulário para criar novo curso
        }
        
        function editarCurso(id) {
            // Lógica para editar curso
        }
        
        function removerCurso(id) {
            // Lógica para remover curso
        }
        document.addEventListener('DOMContentLoaded', function() {
// Exemplo: Carregar dados do professor via AJAX
    fetch('/professor_data')
    .then(response => response.json())
    .then(data => {
        // Atualizar a interface com os dados do professor
        console.log(data);
    });
});