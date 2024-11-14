import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


 // On donne la taille du SVG
 const width = window.innerWidth //Largeur
 const height = window.innerHeight //Hauteur


 //On crée le svg que l'on va stocker dans const svg
 //On ajoute les différents attribut du svg

 const svg = d3.create('svg')
 .attr('width', width)
 .attr('height', height)
 .attr('viewBox', `0 0 ${width} ${height}`)


//on sélectionne les data dans le json

let data = (await d3.json("data-gameviz.json"))
data = data
        .filter(data => data.category === "game of the year")
        .map(data => ({ game: data.game, year: data.year, note: data.note, winner : data.winner})); // On filtre les données pour récupérer uniquement les jeux de l'année
        
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
    // console.log(svg.selectAll('rect')
    // .data(dataYears, d => d.game)
    // .join(
    //     enter => enter
    //         .insert('rect', ':first-child')
    //         .attr('x', d => x(d.game))
    //         .attr('y', d => y(0))            // Position initiale avant transition
    //         .attr("height", 0)               // Hauteur initiale avant transition
    //         .attr('width', barWidth)
    //         .call(enter => enter.transition() // Transition appliquée à l'élément `enter`
    //             .duration(700)
    //             .attr('y', d => y(d.note))
    //             .attr("height", d => y(0) - y(d.note))
    //         ),
    //     update => update                     // Transition appliquée à l'élément `update`
    //         .transition()
    //         .duration(700)
    //         .attr('y', d => y(d.note))
    //         .attr("height", d => y(0) - y(d.note)),
    //     exit => exit

    //         .remove()
    // )
// )
    


function createGraph(data) {

   

    const x = d3.scaleBand()
        .domain(data.map(d => d.game)) 
        .range([30, width - 30])
        .padding(0.3);

    const y = d3.scaleLinear().domain([0, 10]).range([height - 30, 30])

    const yAxis = d3.axisLeft(y)
    const xAxis = d3.axisBottom(x)


    const barWidth = x.bandwidth();

    svg.selectAll('rect')
    .data(data, d => d.game) 
    .join(
        enter => enter
            .append('rect')
            .attr('x', d => x(d.game))
            .attr('y', y(0))                
            .attr("height", 0)              
            .attr('width', barWidth)
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
    );

    svg.append('g')
        .attr('transform', `translate(0, ${y.range()[0]})`)
        .call(xAxis)

    svg.append('g')
        .attr('transform', `translate(${x.range()[0]},0)`)
        .call(yAxis)

    document.body.appendChild(svg.node())   
}









