

/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/
wall_count = 20;                            // キャンパス内に存在できる壁の数
InfoManager.remainingWalls = wall_count;    // 設置できる残りの壁の数

class Wall extends GameObject {
    static create(mouse,objectsList){
        // オブジェクトがあった場合、それを削除する
        for(var objects of objectsList){
            for(var i=0;i<objects.length;i++){
                if(mouse.eq(objects[i])){
                    objects.splice(i,1);
                    break;
                }
            }
        }
        var block = new Wall(mouse.x,mouse.y);
        Wall.list.push(block);
        InfoManager.remainingWalls = wall_count - Wall.list.length;
        
        // gameRoutineに依存せず即座に描画
        context.fillStyle = this.color;
        context.fillRect(mouse.x,mouse.y,cellSize,cellSize);
    }
    static delete(mouse){
        for(var i=0;i<Wall.list.length;i++){
            if(mouse.eq(Wall.list[i])){
                Wall.list.splice(i,1);
                InfoManager.remainingWalls = wall_count - Wall.list.length;
                // gameRoutineに依存せず即座に描画
                context.fillStyle ="rgb(100,100,100)";
                context.fillRect(cellLeft,cellTop,cellSize,cellSize);
                break;
            }
        }
    }
    static isLimit(){
        return (Wall.list.length >= wall_count);
    }
}
Wall.list = [];



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
 *  Plant
 *---------------------------------------------------------------------------------------*/
var plantAreas = [];            // 植物が繁殖するエリア
var plantUpdateFrequency = 100; // 植物が繁殖する確率
var plantAreas_count = 10;      // 繁殖エリアの数
var plants_count = 100;         // キャンパス内に存在できる植物の数

class Plant extends GameObject {
    constructor(x,y,energy){
        super(x,y);
        this.energy = 1;
    }
    static init(){
        // 繁殖エリアを配列plantAreasに追加
        for(var i = 0; i < plantAreas_count; i++){
            plantAreas.push(Area.getRandomArea());
        }
    }
    static update(){
        // 各繁殖エリア内で植物をランダムに作成
        //if(Plant.list.length >= plants_count) return;
        var points = Point.getRandomPointIn(plantAreas);
        for(var p of points){
            var plant = new Plant(p.x,p.y);
            this.list.push(plant);
        }
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
var __PREDATOR_ENERGY_INC = 7;

// Settings
Predator.list = [];
Predator.color = "rgb(0,0,200)"         // 描画に利用する色
Predator.reproduction_energy = 20;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 10;     // 子孫を何日ごとに残すか



//! すべてのオブジェクトクラスを登録しておく
var objectClasses = [Wall,Animal,Predator,Plant,Resource];

// 各クラスの初期化
for(cls of objectClasses){
    if(typeof cls.init == "function"){
        cls.init();
    }
}