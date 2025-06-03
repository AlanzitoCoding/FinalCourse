// Selecionar tipo de usuário
        const userTypeBtns = document.querySelectorAll('.user-type-btn');
        const userTypeInput = document.getElementById('userType');
        
        userTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                userTypeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                userTypeInput.value = btn.dataset.type;
            });
        });

        document.getElementById('login').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            fetch('/auth', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
            .then(data => {
                if(data.ok){
                    window.location.href = data.rota
                } else {
                    const message = data.message;
                    alert(message);
                }
            }).catch(err => {
                console.log(err);
                alert('Erro ao fazer login. Tente novamente.');
            });
        });