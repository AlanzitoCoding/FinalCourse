document.addEventListener("DOMContentLoaded", fetchData());

        function fetchData() {
        fetch('/userInfo')
            .then(response => response.json())
            .then(data => {
                const uName = document.getElementById('uName');
                const uCPF = document.getElementById('uCPF');
                const uEmail = document.getElementById('uEmail');
                const uPhone = document.getElementById('uPhone');

                uName.innerHTML = '';
                uCPF.innerHTML = '';
                uEmail.innerHTML = '';
                uPhone.innerHTML = '';

                 const userName = document.querySelector('#userName')
                 const userCPF = document.querySelector('#userCPF')
                 const userPhone = document.querySelector('#userPhone')
                 const userPassword = document.querySelector('#userPassword')
                                
                data.forEach(row => {

                    uName.innerHTML += `${row.userName}`
                    uCPF.innerHTML += `${row.userCPF}`
                    uEmail.innerHTML += `${row.userEmail}`
                    uPhone.innerHTML += `${row.userPhone}`
                    
                    

                })

                data.forEach(row => {

                    userName.value = `${row.userName}`
                    userCPF.value = `${row.userCPF}`
                    userPhone.value = `${row.userPhone}`
                    userPassword.value = `${row.userPassword}`
                    
                    

                })
               

            })
            .catch(error => {
                console.error("Erro ao buscar dados do usuário: " + error);
                
            });
        }

        
        function updateProfileImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profileImage').src = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        function toggleEdit(elementId) {
            const element = document.getElementById(elementId);
            const currentValue = element.textContent;
            
            if (element.tagName === 'P') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.className = 'edit-input';
                input.onblur = function() {
                    updateName(currentValue);
                };
                input.onkeypress = function(e) {
                    if (e.key === 'Enter') {
                        updateName(currentValue);
                    }
                };
                element.parentNode.replaceChild(input, element);
                input.focus();
            }
        }
        
       function editUser(){

        const userName = document.querySelector('#userName').value
        const userCPF = document.querySelector('#userCPF').value
        const userPhone = document.querySelector('#userPhone').value
        const userPassword = document.querySelector('#userPassword').value
 

        fetch('/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName: userName, userCPF: userCPF, userPhone: userPhone, userPassword: userPassword })
            }).then(res => res.json())
            .then(data => {
                alert(data.message)
                fetchData()
            })

       }
        
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
        
         function deleteUser(){

            const userPassword = document.querySelector('#passwordConfirm').value

           fetch('/deleteUser',{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userPassword: userPassword})
            })
            .then(response => {

                window.location.href = response.url;
                
            }).catch(error => {
                console.error("Erro ao deletar usuário: " + error);
            })
            
        }
  
        
        const modal = document.getElementById("modal");
        const deleteButton = document.getElementById("deleteButton");
        const modaledit = document.getElementById("modaledit");
        const editButton = document.getElementById("editButtom");
        
        deleteButton.onclick = () => {
            modal.style.display = "flex";
        };
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        editButton.onclick = () => {
            modaledit.style.display = "flex";
        };
        
        window.onclick = (event) => {
            if (event.target == modaledit) {
                modaledit.style.display = "none";
            }
        };
        
        document.getElementById('modalNao').addEventListener('click', function() {
            document.getElementById('modal').style.display = 'none';
        });



        document.addEventListener("DOMContentLoaded", listCourses());