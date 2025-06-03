modalInfo()

        function toggleModal() {
            var modal = document.getElementById('userModal');
            modal.classList.toggle('show');
        }

        
function modalInfo(){
    fetch('/userInfo')
    .then(response => response.json())
    .then(data => {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
    
        userEmail.innerHTML = ''
        userName.innerHTML = '' 
        
        data.forEach(row => {

            userName.innerHTML += `Nome: ${row.userName}`
            userEmail.innerHTML += `Email: ${row.userEmail}`

        })

       
       

    })
    .catch(error => {
        console.error("Erro ao buscar dados do usuário: " + error);
        
    });
}