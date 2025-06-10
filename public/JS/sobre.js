// Inicialização do AOS
AOS.init({
    duration: 1000,
    once: true
});

// Modal functionality
const modal = document.getElementById("modal");
const profileIcon = document.getElementById("profile-icon");

profileIcon.onclick = () => {
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
};

// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});

// Animação dos números
const stats = document.querySelectorAll('.stat-number');
stats.forEach(stat => {
    const finalValue = stat.getAttribute('data-value').includes('%') ? 
        parseInt(stat.getAttribute('data-value')) : 
        parseInt(stat.getAttribute('data-value'));
    let currentValue = 0;
    const duration = 2000;
    const increment = finalValue / (duration / 16);

    function updateValue() {
        if (currentValue < finalValue) {
            currentValue += increment;
            if (currentValue > finalValue) currentValue = finalValue;
            stat.textContent = stat.getAttribute('data-value').includes('%') ? 
                Math.round(currentValue) + '%' : 
                Math.round(currentValue);
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