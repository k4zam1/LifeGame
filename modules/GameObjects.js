
// moleculesを使うものはここに書く
/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/
class Wall extends GameObject {
    static isLimit(){
        return (InfoManager.remainingWalls < 0);
    }
    static create(mouse){
        var wall = new Wall(mouse.x,mouse.y);
        MAP.register(wall);
        InfoManager.remainingWalls--;
    }
    static delete(mouse){
        var found = MAP.find(mouse.x,mouse.y);
        MAP.delete(found);
        InfoManager.remainingWalls++;
    }
}
InfoManager.remainingWalls = 20;


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
        this.published = InfoManager.day;
    }
    
    update(){
        // 期限が来たら壊す
        if(InfoManager.day - this.published >= BreederReactor.timeLimit){
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
            if(InfoManager.tank < 100) break;
            InfoManager.tank -= 100;
            var BR1 = new BreederReactor(10,10);
            var BR2 = new BreederReactor(11,10);
            var BR3 = new BreederReactor(10,11);
            var BR4 = new BreederReactor(11,11);
            MAP.register(BR1);
            MAP.register(BR2);
            MAP.register(BR3);
            MAP.register(BR4);
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
    PLANT_AREAS.push(Area.getRandomArea());
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
 *  Animal,Predator
 *---------------------------------------------------------------------------------------*/

// 虫
class Bug extends Organism {
    static color = new Color(140,255,50);
    static edibles = [Plant];
    static energyInc = 10;
    static reproduction_energy = 2;
    static reproduction_interval = 1;
}

// 草食動物
class Herbivores extends Organism {
    static color = new Color(200,200,0);
    static edibles = [Bug,Plant];
    static energyInc = 10;
    static reproduction_energy = 5;
    static reproduction_interval = 8;
}

// 肉食動物
class Carnivore extends Organism {
    static color = new Color(200,0,200);
    static edibles = [Herbivores,Resource];
    static energyInc = 3;
    static reproduction_energy = 20;
    static reproduction_interval = 20;
}

class Predator extends Organism {
    static color = new Color(0,0,255);
    static edibles = [Herbivores,Carnivore];
    static energyInc = 2;
    static reproduction_energy = 30;
    static reproduction_interval = 20;
}