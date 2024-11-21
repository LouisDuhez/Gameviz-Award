import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Sélection de la div cible
const svgGraphique = document.querySelector('.svgGraphique');
 
// On donne la taille du SVG en fonction de la div
const width = svgGraphique.offsetWidth; //Largeur de la div
const height = svgGraphique.offsetHeight; //Hauteur de la div
let textWidth = 300

// Création du SVG avec d3.create
const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `${-textWidth} 0 ${width+textWidth} ${height}`)
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
createGraphVertical(dataYears)
selectYears.addEventListener('change', (e) => {
    selectedYear = e.target.value;
    console.log(selectedYear)
    const dataYears = data.filter(d => d.year == selectedYear)
    console.log(dataYears)
    createGraphVertical(dataYears)
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
    createGraphVertical(dataYears)
})

function createGraph(data) {

   

    const x = d3.scaleBand()
        .domain(data.map(d => d.game)) 
        .range([30, width - 30])
        .padding(0.5);

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
            .style('rx', 8)
            .style('ry', 8)
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
        .call(xAxis)

    svg.append('g')
        .attr('class', 'y-axis') 
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
                .style("display", "block")
                 // Afficher l'info-bulle
                 svg.selectAll('rect')
                 .style("opacity", "0.4")
                 
        })
        .on('mousemove', function (event) { // Mettre à jour la position de l'info-bulle
            infoGraphique
                .style("left", (event.pageX + 9) + "px")
                .style("top", (event.pageY - 175) + "px");
        })
        .on('mouseout', function () { // Masquer l'info-bulle
            infoGraphique
                .style("display", "none");

                svg.selectAll('rect')
                .style("opacity", "1")
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

function createGraphVertical(data) {
        
        const x = d3.scaleLinear()
            .domain([0, 10]) // Note sur une échelle linéaire
            .range([30, width - 30]);
    
        const y = d3.scaleBand()
            .domain(data.map(d => d.game)) // Les noms des jeux
            .range([height - 30, 30])
            .padding(0.5);
    
        const xAxis = d3.axisBottom(x); // Axe des notes
        const yAxis = d3.axisLeft(y);   // Axe des jeux
    
        const barHeight = y.bandwidth();
    
        svg.style("background-color", "#121212");
    
        svg.selectAll('rect')
            .data(data, d => d.game)
            .join(
                enter => enter
                    .append('rect')
                    .attr('x', x(0)) // Position initiale des barres
                    .attr('y', d => y(d.game))
                    .attr('width', 0) // Largeur initiale
                    .attr('height', barHeight)
                    .style('ry', 8)

                    .attr('class', d => `winner${d.winner} bar`)
                    .call(enter => enter.transition()
                        .duration(1000)
                        .attr('x', d => x(0))
                        .attr('width', d => x(d.note) - x(0))
                    ),
                update => update
                    .transition()
                    .duration(1000)
                    .attr('x', x(0))
                    .attr('width', d => x(d.note) - x(0)),
                exit => exit
                    .transition()
                    .duration(500)
                    .attr('width', 0)
                    .remove()
            );
    
        svg.selectAll('.x-axis').remove();
        svg.selectAll('.y-axis').remove();
    
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${y.range()[0]})`)
            .call(xAxis);
    
        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${x.range()[0]},0)`)
            .call(yAxis);
    
        // Ajout du SVG dans la div
        svgGraphique.appendChild(svg.node());
        // selectWidthText()
        // svg.attr('viewBox', `-${textWidth} 0 ${width+textWidth} ${height}`)

        
        afficheInfoRect();
        afficheInfoJeu();
    }


    
    
    // Fonction pour Sélectionner la taille du texte
    
    function selectWidthText() {
        textWidth = 0
        d3.select("svg").selectAll("text").each(function() {
            const bbox = this.getBBox(); 
            if (bbox.width > textWidth) { 
                textWidth = bbox.width; 
            }
        });
    
        console.log("Largeur maximale du texte :", textWidth);  
    }
    








