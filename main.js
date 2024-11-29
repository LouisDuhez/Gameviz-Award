import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Sélection de la div cible
const svgGraphique = document.querySelector('.svgGraphique');
const rangeSelectYears = document.querySelector('.rangeSelect');
const rangeSelectYearsValue = document.querySelector('.rangeSelectValue');
// Dimensions initiales
let width = svgGraphique.offsetWidth;
let height = svgGraphique.offsetHeight;

// Création du SVG
const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height +40}`)

// Charger les données
let data = await d3.json("data-gameviz.json");
data = data
    .filter(d => d.category === "game of the year")
    .map(d => ({ game: d.game, year: d.year, note: d.note, winner: d.winner, studio: d.studio, image: d.image, video: d.video, description: d.description }));

data = data.sort((a,b) => a.note - b.note)

// Initialisation des années
const selectYears = document.querySelector('.selectYears');
const listYears = [...new Set(data.map(d => d.year))].sort();
listYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    selectYears.appendChild(option);
});

// Variables globales
let selectedYear = listYears[0];
let dataYears = data.filter(d => d.year == selectedYear);

// Créer le graphique initial
createGraphVertical(dataYears);
svgGraphique.appendChild(svg.node());

// Écouteurs pour les sélections
selectYears.addEventListener('change', e => {
    selectedYear = e.target.value;
    dataYears = data.filter(d => d.year == selectedYear);
    rangeSelectYearsValue.innerHTML = `Année : ${selectedYear}`
    rangeSelectYears.value = selectedYear
    createGraphVertical(dataYears);
});

// Écouteur pour le range slider

rangeSelectYears.addEventListener('input', e => {
    const value = e.target.value;
    rangeSelectYearsValue.textContent = `Année : ${value}`;
    dataYears = data.filter(d => d.year == value);
    createGraphVertical(dataYears);
});

// Fonction pour créer le graphique vertical
function createGraphVertical(data) {
    const x = d3.scaleLinear()
        .domain([0, 10])
        .range([30, width - 30]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.game))
        .range([height - 30, 30])
        .padding(0.5);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const barHeight = y.bandwidth();

    // Mettre à jour les barres
    svg.selectAll('.crown').remove()
        
    svg.selectAll('rect')
        .data(data, d => d.game)
        .join(
            enter => enter.append('rect')
                .attr('x', x(0))
                .attr('y', d => y(d.game))
                .attr('width', 0)
                .attr('height', barHeight)
                .attr('class', d => `winner${d.winner} bar`)
                .call(enter => enter.transition()
                    .duration(1000)
                    .attr('width', d => x(d.note) - x(0))
                )

                .each(function(d) {
                    if (d.winner === 1) {
                        d3.select(this.parentNode)
                            .append('text')
                            .attr('x', x(0))
                            .attr('y', y(d.game) + barHeight / 2)
                            .attr('dy', '0.35em') 
                            .text('Winner')
                            .style('opacity', 0)
                            .style('position', 'relative')
                            .style('right',50)
                            .attr('class', 'crown')
                            .transition()
                            .duration(1000)
                            .delay(500)
                            .attr('x', x(d.note)+5)
                            .style('opacity', 1)
                        exit => exit.transition()
                            .duration(500)
                            .attr('width', 0)
                            .remove()
                            
                    }
                }),
            update => update.transition()
                .duration(1000)
                .attr('width', d => x(d.note) - x(0))
                .attr('y', d => y(d.game)),
            exit => exit.transition()
                .duration(500)
                .attr('width', 0)
                .remove()
        );

    // Mettre à jour les axes
    svg.selectAll('.x-axis').remove();
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${y.range()[0]})`)
        .call(xAxis);
    
    svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', (x.range()[1] + x.range()[0]) / 2) // Centré par rapport à l'axe X
    .attr('y', y.range()[0] + 60) // Positionné légèrement sous l'axe X
    .style('font-size', '1.5rem')
    .style('font-weight', 'bold')
    .text('Note moyenne des utilisateurs');    

    svg.selectAll('.y-axis').remove();
    svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${x.range()[0]},0)`)
    .call(yAxis);

    svg.selectAll('.y-axis text')
    .attr('text-anchor', 'start')
    .attr('x', 9) 
    .attr('dy', '0.35em')

    afficheInfoRect();
    afficheInfoJeu();
}

// Fonction pour afficher les informations au survol
function afficheInfoRect() {
    svg.selectAll('rect')
        .on('mouseenter', function (event, d) {
            // Afficher les informations du jeu dans le conteneur infoGraphique
            d3.select('.infoGraphique')
                .html(`
                    <div>              
                        <img class="infoGraphique-image" src="${d.image}" alt=""></img>
                    </div>
                    <div>
                        
                        <p><span class="data-name">Nom du jeu : </span> ${d.game}</p>
                        <p><span class="data-name">Nom du studio :</span> ${d.studio}</p>
                        <p><span class="data-name">Année de sortie :</span> ${d.year}</p>
                        <p><span class="data-name">User score :</span> ${d.note}</p>
                    </div>
                `)
                .style("display", "flex");

            // Réduire l'opacité de toutes les barres
            d3.selectAll('rect').style("opacity", "0.4");

            // Mettre en évidence la barre survolée
            d3.select(this).style("opacity", "1");

            // Réduire l'opacité de toutes les légendes en Y
            svg.selectAll('.y-axis .tick text').style('opacity', '0.4');

            // Mettre en évidence uniquement la légende associée
            svg.selectAll('.y-axis .tick text')
                .filter(t => t === d.game) // Associer la légende au jeu via son nom
                .style('opacity', '1');
        })
        .on('mousemove', event => {
            // Mettre à jour la position du conteneur infoGraphique
            d3.select('.infoGraphique')
                .style("left", `${event.pageX + 9}px`)
                .style("top", `${event.pageY - 175}px`);
        })
        .on('mouseout', () => {
            // Réinitialiser l'affichage des informations et l'opacité des éléments
            d3.select('.infoGraphique').style("display", "none");
            d3.selectAll('rect').style("opacity", "1");
            svg.selectAll('.y-axis .tick text').style('opacity', '1');
        });
}



// Fonction pour afficher les informations d'un jeu au clic
function afficheInfoJeu() {
    svg.selectAll('rect')
        .on('click', (event, d) => {
            
            document.querySelector('.infoJeux').innerHTML = `
                <div class="border-img-back">
                        <div class="border-img"></div>
                        <div class="border-img"></div>
                        <div class="border-img"></div>
                </div>
                <div class="infoJeux-img-bloc">
                    <video class="video1" poster="${d.image}">
                        <source src="trailer/${d.video}.mp4" type="video/mp4">
                    </video>
                    <!--<img src="${d.image}" alt="Image du jeu">-->
                    <!--<div class= "border-img"> </div>
                    <div class= "border-img border-img-2"> </div> -->
                    <div class="lecteur-vid">
                    <span class="reducesec"><i class="fa-solid fa-backward"></i></span>
                    <span class="play"><i class="fa-solid fa-play"></i></span>
                    <span class="skipsec"><i class="fa-solid fa-forward"></i></span>
                    <div>
                        <label class="volume"for="volume"><i class="fa-solid fa-volume-xmark"></i></label>
                        <input id="volume"class="volume-control" type="range" min="0" max="1" step="0.1" value="0">
                    </div>
                    </div>
                </div>
                <div class="infoJeux-text-bloc">

                        <p class="game-title">${d.game}</p>
                        <p>${d.note} / 10 user score</p>
                        <p>${d.description}</p>
                        <div class="infoJeux-text-bloc-bottom">
                        <p>${d.studio}</p>
                        <div class="orange-separation"></div>
                        <p>${d.year}</p>
                    </div>
                    
                </div>
                
            `;
            document.querySelector('.infoJeux').style.display ="flex"
            let topInfo = document.querySelector('.infoJeux').offsetTop - 100
            console.log(topInfo)
            window.scrollTo({
                top: topInfo,
                left: 0,
                behavior: "smooth",
              });

            
            let playStatue = 0
            const btnPlay = document.querySelector('.play')
            console.log(btnPlay)
            const video1 = document.querySelector('.video1')
            btnPlay.addEventListener('click', function(e) {
                if (playStatue == 0) {
                    video1.play()
                    console.log('play')
                    playStatue = 1
                    btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>'
                } else {
                    video1.pause()
                    playStatue = 0
                    btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>'
                    console.log('pause')
                }
             })  

             
             let btnSkip10Sec = document.querySelector('.skipsec')
             btnSkip10Sec.addEventListener('click', e=> {
                 console.log(video1.currentTime)
                 video1.currentTime=video1.currentTime+10;
                 console.log(video1.currentTime)
            })
            
            let btnreduce10Sec = document.querySelector('.reducesec')
            btnreduce10Sec.addEventListener('click', e=> {
                console.log(video1.currentTime)
                video1.currentTime=video1.currentTime-10;
                console.log(video1.currentTime)
                 
             })
            video1.volume = 0
            const volumeControl = document.querySelector('.volume-control');
            volumeControl.addEventListener('input', function () {
            video1.volume = this.value
            
            if (video1.volume == 0) {
                document.querySelector('.volume').innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
            } if (video1.volume > 0) {
                document.querySelector('.volume').innerHTML = '<i class="fa-solid fa-volume-low"></i>'
            } if (video1.volume >= 0.6) {
                document.querySelector('.volume').innerHTML = '<i class="fa-solid fa-volume-high"></i>'
            } 

                    });
              
        });
        
}
// Graphique numéro 2


