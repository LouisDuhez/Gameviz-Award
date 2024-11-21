document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener('scroll', function () {
        const elements = document.querySelectorAll('.pathanim');

        elements.forEach((element, index) => {
            // Vérifie si le défilement vertical de la fenêtre est supérieur à 50 pixels
            if (window.scrollY > 50) {
                // Ajoute un délai avant d'ajouter la classe 'diagonal-line2' et de changer l'opacité
                setTimeout(() => {
                    element.classList.add('diagonal-line2');
                    element.style.opacity = 1;
                    // Délai d'une seconde entre chaque animation
                }, index * 1000);
            }
        });
    });


});
