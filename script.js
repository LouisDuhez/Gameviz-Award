document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener('scroll', function () {
        const element = document.querySelector('.svg-animate');
        // Récupère la position de l'élément par rapport à la fenêtre grâce à getBoundingClientRect()
        const rect = element.getBoundingClientRect();
        // Si la position de l'élément est inférieure à la hauteur de la fenêtre et que la position de l'élément est supérieure à 0 alors ajoute la classe 'visible'
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('visible');
            }
        });

});
