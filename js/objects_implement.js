
// moleculesを使うものはここに書く
/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/
class Wall extends GameObject {
    static isLimit(){
        return (INFO.remainingWalls < 0);
    }
    static create(mouse){
        var found = new Wall(mouse.x,mouse.y);
        MAP.register(found);
        INFO.remainingWalls--;
    }
    static delete(mouse){
        var found = MAP.find(mouse.x,mouse.y);
        if(found && found.type == "Wall"){
            MAP.delete(found);
            INFO.remainingWalls++;
        }
    }
}


/*---------------------------------------------------------------------------------------*
 *  Resource
 *---------------------------------------------------------------------------------------*/
class Resource extends GameObject {
    static color = new Color(250,250,0);
    static add(){
        var p = Point.getRandomPoint();
        var found = MAP.find(p.x,p.y);
        if(!found){
            var r = new Resource(p.x,p.y);
            MAP.register(r);
        }
    }
}


/*---------------------------------------------------------------------------------------*
 *  BreederReactor
 *---------------------------------------------------------------------------------------*/

class BreederReactor  extends GameObject {
    static color = new Color(240,90,240);
    static timeLimit = 100;
    constructor(x,y){
        super(x,y);
        this.published = INFO.day;
    }
    
    update(){
        // 期限が来たら壊す
        if(INFO.day - this.published >= BreederReactor.timeLimit){
            MAP.delete(this);
            return;
        }

        // 生物を増殖させる
        var sp = MAP.getBlankPoint(this.x,this.y);
        if(sp){
            Herbivores.randomSpawn(sp);
        }
    }
}


// select
var select = document.querySelector("#item");
var options = document.querySelectorAll("#item option");
select.addEventListener("change",function(){
    // 選択されたoption番号を取得
    var selectedItem = options[this.selectedIndex].value;
    switch(selectedItem){
        case "breederReactor":
            INFO.modeNumber = INFO.MODE_CREATE_BR;
            break;
        default : break;
    }
    this.selectedIndex = 0;
});


/*---------------------------------------------------------------------------------------*
 *  Plant
 *---------------------------------------------------------------------------------------*/

var PLANT_AREAS_NUM = 10;
var PLANT_AREAS = [];
for(var i=0; i < PLANT_AREAS_NUM; i++){
    PLANT_AREAS.push(MAP.getRandomArea());
}

class Plant extends GameObject {
    static color = new Color(0,200,0);
    static add(){
        for(var area of PLANT_AREAS){
            var p = Point.getRandomPoint(area);
            var found = MAP.find(p.x,p.y);
            if(!found){
                MAP.register(new Plant(p.x,p.y));
            }
        }
    }
}


/*---------------------------------------------------------------------------------------*
 *  bio
 *---------------------------------------------------------------------------------------*/

/*
// 虫
class Bug extends Organism {
    static color = new Color(140,255,50);
    static edibles = ["Plant","Resource"];
    static energyInc = 10;
    static reproduction_energy = 0;
    static reproduction_interval = 1;
}

// 草食動物
class Herbivores extends Organism {
    static color = new Color(200,100,50);
    static edibles = ["Bug","Plant"];
    static energyInc = 7;
    static reproduction_energy = 15;
    static reproduction_interval = 10;
}

*/

// 肉食動物
class Carnivore extends Organism {
    static color = new Color(200,50,200);
    static edibles = ["Plant","Resource"];
    static energyInc = 10;
    static reproduction_energy = 10;
    static reproduction_interval = 5;
}

class Predator extends Organism {
    static color = new Color(50,50,250);
    static edibles = ["Plant","Resource"];
    static energyInc = 10;
    static reproduction_energy = 15;
    static reproduction_interval = 5;
}