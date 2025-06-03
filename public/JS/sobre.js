document.body.classList.toggle('dark-mode');
        AOS.init({
            duration: 1000,
            once: true
        });

        const modal = document.getElementById("modal");
        const profileIcon = document.getElementById("profile-icon");

        profileIcon.onclick = () => {
            modal.style.display = "flex";
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
        

        // Animação dos números
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.getAttribute('data-value'));
            let currentValue = 0;
            const duration = 2000; // 2 segundos
            const increment = finalValue / (duration / 16); // 60fps

            function updateValue() {
                if (currentValue < finalValue) {
                    currentValue += increment;
                    if (currentValue > finalValue) currentValue = finalValue;
                    stat.textContent = Math.round(currentValue);
                    requestAnimationFrame(updateValue);
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateValue();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(stat);
        });