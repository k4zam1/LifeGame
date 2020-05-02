
var plants = [];
var plantAreas = [];
var biome = [];

// the frequency of updating plant
var plantUpdateFrequency = 100;

// the number of the plantAreas
var plantAreas_number = 7;

// the number of the plants
var plant_number = 100;


// create plant area
class PlantArea {
    constructor(minX,minY,areaRange,randomRange){
        this.plantAreaX = Math.floor(Math.random()*minX)/cellSize;
        this.plantAreaY = Math.floor(Math.random()*minY)/cellSize; 
        this.range = Math.floor(Math.random()*randomRange + areaRange);
    }
}


// add to plant areas
for(var i = 0; i < plantAreas_number; i++){
    // set area size
    //areaRange と randomRange はマス目換算
    var pA = new PlantArea(Math.floor(Math.random()*420),Math.floor(Math.random()*600),5,2);
    
    // add new plant area
    plantAreas.push(pA);
    
}


function add_plant(){
    // add to plant in the plant area
    for(var i = 0; i < plantAreas_number; i++){
        var p = new Point(Math.floor(Math.random()*plantAreas[i].range + plantAreas[i].plantAreaX)*cellSize,Math.floor(Math.random()*plantAreas[i].range + plantAreas[i].plantAreaY)*cellSize);

        
        // add new plant
        plants.push(p);
        
        if(plants.length > plant_number){
            // delete old plant
            plants.shift();
        }
        
    }
}


