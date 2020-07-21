
// moleculesを使うものはここに書く


/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/


class Wall extends GameObject {
    static isLimit(){
        return (InfoManager.remainingWalls > 0);
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
    static update(){
        var p = Point.getRandomPoint();
        var found = MAP.find(p.x,p.y);
        if(!found){
            var r = new Resource(p.x,p.y);
            MAP.register(r);
        }
    }
}

Resource.color = new Color(250,165,0);



/*---------------------------------------------------------------------------------------*
 *  BreederReactor
 *---------------------------------------------------------------------------------------*/
class BreederReactor  extends GameObject {
    constructor(x,y){
        super(x,y);
        this.published = InfoManager.day;
    }
    static update(){
        /*
        for(var BR of BreederReactor.list){

            // 生物を増殖させる
            var respawn = BR.point;
            var clone = Animal.randomProduce(respawn);
            Animal.list.push(clone);

            // 期限が来たら壊す
            if(InfoManager.day - BR.published >= BreederReactor.timeLimit){
                var found = BreederReactor.list.findIndex(br => br.id == BR.id);
                if(found != -1) BreederReactor.list.splice(found,1);
            }
        }
        */
    }
}
BreederReactor.color = "rgb(240,90,240)";
BreederReactor.timeLimit = 100;

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
            var BR1 = new BreederReactor(50,50);
            var BR2 = new BreederReactor(50+cellSize,50);
            var BR3 = new BreederReactor(50,50+cellSize);
            var BR4 = new BreederReactor(50+cellSize,50+cellSize);
            BreederReactor.list.push(BR1);
            BreederReactor.list.push(BR2);
            BreederReactor.list.push(BR3);
            BreederReactor.list.push(BR4);
            break;
        default : break;
    }
    this.selectedIndex = 0;
});


/*---------------------------------------------------------------------------------------*
 *  Plant
 *---------------------------------------------------------------------------------------*/
var __plantAreas = [];            // 植物が繁殖するエリア
var __plantAreasNum = 10;      // 繁殖エリアの数

class Plant extends GameObject {
    static init(){
        // 繁殖エリアを配列plantAreasに追加
        for(var i = 0; i < __plantAreasNum; i++){
            __plantAreas.push(Area.getRandomArea());
        }
    }
    static update(){
        for(var area of __plantAreas){
            var p = area.getRandomPoint();
            var found = MAP.find(p.x,p.y);
            if(!found){
                MAP.register(new Plant(p.x,p.y));
            }
        }
    }
}
Plant.color = new Color(0,200,0);



/*---------------------------------------------------------------------------------------*
 *  Animal,Predator
 *---------------------------------------------------------------------------------------*/
class Animal extends Organism {}
Animal.color = new Color(255,0,0);        // 描画に利用する色
Animal.edibles = [Plant,Resource];
Animal.energyInc = 10;
Animal.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Animal.reproduction_interval = 5;     // 子孫を何日ごとに残すか


class Predator extends Organism {}
Predator.color = new Color(0,0,255);         // 描画に利用する色
Predator.edibles = [Animal,Plant];
Predator.energyInc = 4;
Predator.reproduction_energy = 20;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 50;     // 子孫を何日ごとに残すか


// クラスのリストをInfoManagerに登録
InfoManager.obstacles = [Wall,BreederReactor];
InfoManager.classList = [Animal,Predator,Plant,Resource,BreederReactor,Wall];