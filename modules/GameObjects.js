
// moleculesを使うものはここに書く


/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/


class Wall extends GameObject {
    static isLimit(){
        return (Wall.list.length >= this.__wallCount);
    }
    static create(mouse){
        // オブジェクトがあった場合、それを削除する
        for(var cls of InfoManager.classList){
            var found = cls.list.findIndex(obj => obj.point.eq(mouse));
            if(found != -1) cls.list.splice(found,1);
        }
        
        var newBlock = new Wall(mouse.x,mouse.y);
        Wall.list.push(newBlock);

        // gameRoutineに依存せず即座に描画
        ScreenManager.draw(this.color,mouse);
        InfoManager.remainingWalls = this.__wallCount - Wall.list.length;
    }
    static delete(mouse){
        var found = Wall.list.findIndex(wall => wall.point.eq(mouse));
        if(found == -1) return;
        
        // ブロックを消す
        ScreenManager.draw("rgb(100,100,100)",Wall.list[found]);
        Wall.list.splice(found,1);
        InfoManager.remainingWalls = this.__wallCount - Wall.list.length;
    }
}
Wall.list = [];
Wall.__wallCount = 20;
InfoManager.remainingWalls = Wall.__wallCount;


/*---------------------------------------------------------------------------------------*
 *  Resource
 *---------------------------------------------------------------------------------------*/
class Resource extends GameObject {
    static update(){
        var p = Point.getRandomPoint();
        var r = new Resource(p.x,p.y);
        Resource.list.push(r);
    }
}
Resource.list = [];
Resource.color = "rgb(250,165,0)";


/*---------------------------------------------------------------------------------------*
 *  BreederReactor
 *---------------------------------------------------------------------------------------*/
class BreederReactor  extends GameObject {
    constructor(x,y){
        super(x,y);
        this.published = InfoManager.day;
    }
    static update(){
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
    }
}
BreederReactor.list = [];
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
        // 各繁殖エリア内で植物をランダムに作成
        var newPlantPoints = Point.getRandomPointIn(__plantAreas);
        newPlantPoints.forEach(p => this.list.push(new Plant(p.x,p.y)));
    }
}
Plant.list = [];
Plant.color = "rgb(0,200,0)";



/*---------------------------------------------------------------------------------------*
 *  Animal,Predator
 *---------------------------------------------------------------------------------------*/
class Animal extends Organism {
    eat(){ super.eat(__ANIMAL_EDIBLES,__ANIMAL_ENERGY_INC); }
}
// Local Variables
var __ANIMAL_EDIBLES = [Plant,Resource];
var __ANIMAL_ENERGY_INC = 10;

// Settings
Animal.list = [];
Animal.color = "rgb(200,0,0)";        // 描画に利用する色
Animal.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Animal.reproduction_interval = 5;     // 子孫を何日ごとに残すか


class Predator extends Organism {
    eat(){ super.eat(__PREDATOR_EDIBLES,__PREDATOR_ENERGY_INC); }
}
// Local Variables
var __PREDATOR_EDIBLES = [Animal,Predator];
var __PREDATOR_ENERGY_INC = 10;

// Settings
Predator.list = [];
Predator.color = "rgb(0,0,200)"         // 描画に利用する色
Predator.reproduction_energy = 20;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 10;     // 子孫を何日ごとに残すか


// クラスのリストをInfoManagerに登録
InfoManager.obstacles = [Wall,BreederReactor];
InfoManager.classList = [Animal,Predator,Plant,Resource,BreederReactor,Wall];