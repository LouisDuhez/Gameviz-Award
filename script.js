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



function toggleModal(id) {
  const modal = document.getElementById(id);
  const body = document.querySelector("body");
  const html = document.querySelector("html");

  if (modal.style.display === "flex") {
    modal.style.display = "none";
    body.style.position = "relative";
    // Changer le scroll-behavior avant la redirection
    html.style.scrollBehavior = "auto"; 
    // Rediriger vers l'ancre #test
    window.location.href = "#test";
  } else {
    modal.style.display = "flex";
    //met le body en fix pour eviter le scroll lors de l'ouverture du modal
    body.style.position = "fixed";
    body.style.bottom = `10px`;

  }
}

function stop(event) {
  //permet d'empecher qu'au click sur le modal que la fonction toggleModal se lance 
  event.stopPropagation();
}