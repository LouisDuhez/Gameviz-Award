import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Sélection de la div cible
const svgGraphique = document.querySelector('.svgGraphique');

// Dimensions initiales
let width = svgGraphique.offsetWidth;
let height = svgGraphique.offsetHeight;
let textWidth = 300;

// Création du SVG
const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `${-textWidth} 0 ${width + textWidth} ${height}`)
    .style('background-color', '#f0f0f0');

// Charger les données
let data = await d3.json("data-gameviz.json");
data = data
    .filter(d => d.category === "game of the year")
    .map(d => ({ game: d.game, year: d.year, note: d.note, winner: d.winner, studio: d.studio, image: d.image }));

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
    createGraphVertical(dataYears);
});

// Écouteur pour le range slider
const rangeSelectYears = document.querySelector('.rangeSelect');
const rangeSelectYearsValue = document.querySelector('.rangeSelectValue');
rangeSelectYears.addEventListener('input', e => {
    const value = e.target.value;
    rangeSelectYearsValue.textContent = `Valeur : ${value}`;
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
                ),
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

    svg.selectAll('.y-axis').remove();
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${x.range()[0]},0)`)
        .call(yAxis);

    // Ajouter les interactions
    afficheInfoRect();
    afficheInfoJeu();
}

// Fonction pour afficher les informations au survol
function afficheInfoRect() {
    svg.selectAll('rect')
        .on('mouseenter', function (event, d) {
            d3.select('.infoGraphique')
                .html(`
                    <p><span class="data-name">Nom du jeu : </span> ${d.game}</p>
                    <p><span class="data-name">Nom du studio :</span> ${d.studio}</p>
                    <p><span class="data-name">Année de sortie :</span> ${d.year}</p>
                    <p><span class="data-name">Note INDB :</span> ${d.note}</p>
                `)
                .style("display", "block");
            d3.selectAll('rect').style("opacity", "0.4");
            d3.select(this).style("opacity", "1");
        })
        .on('mousemove', event => {
            d3.select('.infoGraphique')
                .style("left", `${event.pageX + 9}px`)
                .style("top", `${event.pageY - 175}px`);
        })
        .on('mouseout', () => {
            d3.select('.infoGraphique').style("display", "none");
            d3.selectAll('rect').style("opacity", "1");
        });
}

// Fonction pour afficher les informations d'un jeu au clic
function afficheInfoJeu() {
    svg.selectAll('rect')
        .on('click', (event, d) => {
            
            document.querySelector('.infoJeux').innerHTML = `
                <div class="infoJeux-img-bloc">
                    <img src="${d.image}" alt="Image du jeu"></div>
                    <div class="infoJeux-text-bloc">

                    <div>
                        <p>${d.game}</p>
                        <p>${d.note} / 10</p>
                    </div>
                    <p>The Game Awards est une cérémonie annuelle célébrant l’excellence dans l’industrie vidéoludique. Créé en 2014 par Geoff Keighley, l’événement récompense jeux, développeurs et studios. Il inclut aussi annonces et bandes-annonces inédites, attirant millions de spectateurs.</p>
                    <div class="infoJeux-text-bloc-bottom">
                        <p>${d.studio}</p>
                        <div class="orange-separation"></div>
                        <p>${d.year}</p>
                    </div>
                    
                </div>
                
            `;
            let topInfo = document.querySelector('.infoJeux').offsetTop
            console.log(topInfo)
            window.scrollTo({
                top: topInfo,
                left: 0,
                behavior: "smooth",
              });
              document.querySelector('.infoJeux').style.display ="block"
        });
        
}