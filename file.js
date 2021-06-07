
var width = document.body.clientWidth || document.documentElement.clientWidth;
var height = document.body.clientHeight || document.documentElement.clientHeight;

//scale d3.js
var xRange = d3.scaleLinear().domain([8,36]).range([10,width-100])
var yRange = d3.scaleLinear().domain([14,44]).range([10,height-100])
var xRangeInvertito = d3.scaleLinear().domain([8,36]).range([width-100, 8])
var yRangeInvertito = d3.scaleLinear().domain([14,44]).range([height-100, 14])
var numClick = 0; // per tenere traccia di quanti click ho fatto sul mouse

// lettura file Json
function readFileJsonZanza(){
    return $.ajax({
    type: 'GET',
    url: 'http://localhost:8000/file.json',
    async: false,
    dataType: 'json',
    data: { action : 'getList' },
    done: function(results) {
    // Uhm, maybe I don't even need this?
    JSON.parse(results);
    return results;
    },
    fail: function( jqXHR, textStatus, errorThrown ) {
    console.log( 'Could not get posts, server response: ' + textStatus + ': ' + errorThrown );
    }
    }).responseJSON;
}

var data = readFileJsonZanza().position;

function disegnaZanzara() {
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "#FFF8DC")
    for(let i = 0; i<data.length; i++) {
        svg.append("svg:image")
        .attr("xlink:href", "mosquito-svgrepo-com.svg")
        .attr("id", "zanzara"+i*2)
        .attr("locked",0)
        .attr("width",20)
        .attr("height",20)
        .attr("transform", "translate(" + posIniziale(i).x + "," + posIniziale(i).y+ ")")
        .on("click", function(){
                Kill(i)
        })
    }
} 

function posIniziale(zanzara) {
    let zanz = data[zanzara]
    return {x: eval(xRange(zanz.x1)), y: eval(yRange(zanz.y1))}
};

function Kill(i) {
    d3.select("#zanzara"+i*2).attr("locked", 1)
};

// click e spostamenti
    
d3.selectAll("body").on("click", function(){
    numClick++;
    move(data)
});

//catturare l'evento(v e h) sulla tastiera per invertire le posizioni della x e della y di ogni zanzara
document.getElementById("body").addEventListener("keydown", (e) => {
    if(e.key === "v") { //inverti y
        changeY(data)
    }
    if(e.key === "h") { // inverti x
        changeX(data)
    }

});


function move(data) {
        for(let i = 0; i<data.length; i++) {
            if(d3.select("#zanzara"+i*2).attr("locked")!=1){
                d3.select("#zanzara"+i*2).transition().attr("transform", "translate(" + setPosition(i).x + "," + setPosition(i).y+ ")").duration(1500)  
            }
        }
} 
function changeX(data) {
        for(let i = 0; i<data.length; i++) {
            if(d3.select("#zanzara"+i*2).attr("locked")!=1){
                d3.select("#zanzara"+i*2).transition().attr("transform", "translate(" + reverseCoordinateX(i).x + "," + reverseCoordinateY(i).y+ ")").duration(1500)
            }
        }
} 
function changeY(data) {
        for(let i = 0; i<data.length; i++) {
            if(d3.select("#zanzara"+i*2).attr("locked")!=1){
                d3.select("#zanzara"+i*2).transition().attr("transform", "translate(" + reverseCoordinateY(i).x + "," + reverseCoordinateY(i).y+ ")").duration(1500)
                
            }
        }
}   

function reverseCoordinateX(index){
    switch(numClick){
        case 0: x = data[index].x1; y = data[index].y1; break;
        case 1: x = data[index].x2; y = data[index].y2; break;
        case 2: x = data[index].x3; y = data[index].y3; break;
    }
    return {x: eval(xRangeInvertito(x)), y: eval(yRange(y))};
}


function reverseCoordinateY(index){
    switch(numClick){
        case 0: x = data[index].x1; y = data[index].y1; break;
        case 1: x = data[index].x2; y = data[index].y2; break;
        case 2: x = data[index].x3; y = data[index].y3; break;
    }
    return {x: eval(xRange(x)), y: eval(yRangeInvertito(y))};
}

//funzione per cambiare le posizioni ad ogni click del mouse
function setPosition(index) {  
    numClick = numClick%3;
    switch(numClick) {
        case 0: x = data[index].x1; y = data[index].y1; break;
        case 1: x = data[index].x2; y = data[index].y2; break;
        case 2: x = data[index].x3; y = data[index].y3; break; 
    }

    return{x: eval(xRange(x)), y: eval(yRange(y))};
}

disegnaZanzara(data)
//}

