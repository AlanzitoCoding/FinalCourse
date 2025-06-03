var score = 0;
        var qAmt = 5;
        var index = 0;

        document.getElementById('github-quiz').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const correctAnswers = {
                q1: 'b',
                q2: 'b',
                q3: 'c',
                q4: 'a',
                q5: 'b'
            };

            let feedback = '';

            // Verificar respostas
            for (let i = 1; i <= qAmt; i++) {
                const question = document.querySelector(`input[name="q${i}"]:checked`);
                if (question) {
                    if (question.value === correctAnswers[`q${i}`]) {
                        score++;
                        feedback += `<p class="correct">Questão ${i}: Correta!</p>`;
                    } else {
                        feedback += `<p class="incorrect">Questão ${i}: Incorreta</p>`;
                    }
                } else {
                    feedback += `<p class="incorrect">Questão ${i}: Não respondida</p>`;
                }
            }

            // Mostrar resultado
            document.getElementById('score').textContent = score;
            document.getElementById('feedback').innerHTML = feedback;
            document.getElementById('result').style.display = 'block';

            index = score*100/qAmt;

            if(index < 70){
                alert('Burro, pense 🤫')
            } 
            else{
                concludeCourse();
                alert('Inteligente 🤓')
            }

            // Scroll suave até o resultado
            document.getElementById('result').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Adicionar animação às questões conforme o scroll
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.question-card').forEach(card => {
            observer.observe(card);
        });

        function concludeCourse(){
            fetch('/postCourseConclusion', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({courseID: 1})
            })
            .then(response => response.json())
            .then(data => {
                console.log('Course completely concluded!')
            })
        }