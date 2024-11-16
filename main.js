import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Sélection de la div cible
const svgGraphique = document.querySelector('.svgGraphique');
 
// On donne la taille du SVG en fonction de la div
const width = svgGraphique.offsetWidth; //Largeur de la div
const height = svgGraphique.offsetHeight; //Hauteur de la div

// Création du SVG avec d3.create
const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background-color', '#f0f0f0'); // Optionnel : Couleur de fond

let data = (await d3.json("data-gameviz.json"))
data = data
        .filter(data => data.category === "game of the year")
        .map(data => ({ game: data.game, year: data.year, note: data.note, winner : data.winner, studio : data.studio, image : data.image})); 
        



let selectYears = document.querySelector('.selectYears'); // On créer une varaibles selectYears pour sélectionner le <select> ou se trouve toutes les années 
let  listYears = [...new Set(data.map(d => d.year))]; // On sélectionne toutes les années disponibles

const years = listYears.sort(); // On trie le tableau dans l'ordre croissant
                years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year; 
                    option.textContent = year; 
                    yearsSelect.appendChild(option); 
                }); // On ajoutes les années dans le <select>


let selectedYear = 2014
const dataYears = data.filter(d => d.year == selectedYear)
createGraph(dataYears)
selectYears.addEventListener('change', (e) => {
    selectedYear = e.target.value;
    console.log(selectedYear)
    const dataYears = data.filter(d => d.year == selectedYear)
    console.log(dataYears)
    createGraph(dataYears)
})


const rangeSelectYears = document.querySelector('.rangeSelect')
const rangeSelectYearsValue = document.querySelector('.rangeSelectValue')
rangeSelectYears.addEventListener ('input', (e)=> {
    const value = e.target.value
    rangeSelectYearsValue.textContent = `Valeur : ${value}`

})

rangeSelectYears.addEventListener('input', (e) => {
    const value = e.target.value
    const dataYears = data.filter(d => d.year == value)
    createGraph(dataYears)
})

function createGraph(data) {

   

    const x = d3.scaleBand()
        .domain(data.map(d => d.game)) 
        .range([30, width - 30])
        .padding(0.3);

    const y = d3.scaleLinear().domain([0, 10]).range([height - 30, 30])

    const yAxis = d3.axisLeft(y)
    const xAxis = d3.axisBottom(x)


    const barWidth = x.bandwidth();

    console.log(svg.selectAll('rect')
    .data(data, d => d.game) 
    .join(
        enter => enter
            .append('rect')
            .attr('x', d => x(d.game))
            .attr('y', y(0))                
            .attr("height", 0)              
            .attr('width', barWidth)
            .attr('class', d=> `winner${d.winner} bar`)
            .call(enter => enter.transition() 
                .duration(700)
                .attr('y', d => y(d.note))
                .attr("height", d => y(0) - y(d.note))
            ),
        update => update
            .transition()
            .duration(700)
            .attr('y', d => y(d.note))
            .attr("height", d => y(0) - y(d.note)),
        exit => exit
            .transition()                   
            .duration(700)
            .attr("height", 0)
            .attr('y', y(0))
            .remove()
    ));
    svg.selectAll('.x-axis').remove()
    svg.append('g')
        .attr('class', 'x-axis') 
        .attr('transform', `translate(0, ${y.range()[0]})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${x.range()[0]},0)`)
        .call(yAxis)

    // Ajout du SVG dans la div
    svgGraphique.appendChild(svg.node());
    
    afficheInfoRect()
    afficheInfoJeu()
}
let infoGraphique = d3.select('.infoGraphique');

function afficheInfoRect() {
    svg.selectAll('rect')
        .on('mouseenter', function (event, d) { 
            infoGraphique
                .html(`
                    <p>Nom du jeu : ${d.game}</p>
                    <p>Nom du studio : ${d.studio}</p>
                    <p>Année de sortie : ${d.year}</p>
                    <p>Note INDB : ${d.note}</p>
                `)
                .style("display", "block"); // Afficher l'info-bulle
        })
        .on('mousemove', function (event) { // Mettre à jour la position de l'info-bulle
            infoGraphique
                .style("left", (event.pageX + 9) + "px")
                .style("top", (event.pageY - 175) + "px");
        })
        .on('mouseout', function () { // Masquer l'info-bulle
            infoGraphique
                .style("display", "none");
        });
}

const infoJeux = document.querySelector('.infoJeux')
function afficheInfoJeu() {
    svg.selectAll('rect')
    .on('click', function (event, d) { 

        infoJeux.innerHTML = `<p>Nom du jeux : ${d.game}</p>
        <p>Nom du studio : ${d.studio}</p>
        <p>Année de sortie : ${d.year}</p>
        <p>Note INDB : ${d.note}</p>
        <img src ="${d.image}" alt="">
        `
        console.log(d);    
    });
}








