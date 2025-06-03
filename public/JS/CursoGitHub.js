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