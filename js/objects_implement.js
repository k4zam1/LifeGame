
// moleculesを使うものはここに書く
/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/
class Wall extends Item {
    static cost = 1;
    static period = INFO.finish+1;
    static size = "1x1";
    static isLimit(){
        return (INFO.remainingWalls < 0);
    }
    static create(p){
        var success = super.create(p);
        if(success){
            INFO.remainingWalls--;
        }
    }
    static delete(p){
        var success = super.delete.call(this,p);
        if(success){
            INFO.remainingWalls++;
        }
    }
}

/*---------------------------------------------------------------------------------------*
 *  BreederReactor
 *---------------------------------------------------------------------------------------*/
class BreederReactor  extends Item {
    static cost = 100;
    static period = 100;
    static size = "4x4";
    static color = new Color(240,90,240);

    constructor(x,y){
        super(x,y);
        this.published = INFO.day;
    }
    
    static updatePutable(){
        INFO.putable = true;
        var x = INFO.mousePoint.x;
        var y = INFO.mousePoint.y;
        for(var i=0;i<2;i++){
            for(var j=0;j<2;j++){
                var found = MAP.find(x+i,y+j);
                if(found && found.type == "Wall"){
                    INFO.putable = false;
                }
            }
        }
    }
    static highlight(){
        INFO.bgContext.fillStyle = (INFO.putable) ? "rgb(200,200,0)":"rgb(200,50,50)";
        INFO.bgContext.fillRect(INFO.mousePoint.x*INFO.cellSize+1,INFO.mousePoint.y*INFO.cellSize+1,INFO.cellSize*2-2,INFO.cellSize*2-2);
    }

    update(){
        super.update();

        // 生物を増殖させる
        var sp = MAP.getBlankPoint(this.x,this.y);
        if(sp){
            Carnivore.randomSpawn(sp);
        }
    }
}
INFO.items = [Wall,BreederReactor];


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