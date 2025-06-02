document.addEventListener('DOMContentLoaded', function() {
// Exemplo: Carregar dados do professor via AJAX
    fetch('/professor_data')
    .then(response => response.json())
    .then(data => {
        // Atualizar a interface com os dados do professor
        console.log(data);
    });
});