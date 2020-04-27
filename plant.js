
var plants = [];
var plantAreas = [];
var biome = [];

// the frequency of updating plant
var plantUpdateFrequency = 100;

// the number of the plantAreas
var plantAreas_number = 8;

// the number of the plants
var plant_number = 100;


// create plant area
class PlantArea {
    constructor(minX,rangeX,minY,rangeY){
        this.plantAreaX = Math.floor(Math.random()*rangeX + minX)/5;
        this.plantAreaY = Math.floor(Math.random()*rangeY + minY)/5;   
    }
}


// add to plant areas
for(var i = 0; i < plantAreas_number; i++){
    // set area size
    var pA = new PlantArea(Math.floor(Math.random()*410),Math.floor(Math.random()*20+50),Math.floor(Math.random()*570),Math.floor(Math.random()*20+50));
    
    // add new plant area
    plantAreas.push(pA);
    
}


function add_plant(){
    // add to plant in the plant area
    for(var i = 0; i < plantAreas_number; i++){
        var p = new Point(Math.floor(Math.random()*plantAreas[i].plantAreaX)*5, Math.floor(Math.random()*plantAreas[i].plantAreaY)*5);
    
        // add new plant
        plants.push(p);
        
        if(plants.length > plant_number){
            // delete old plant
            plants.shift();
        }
        
    }
}