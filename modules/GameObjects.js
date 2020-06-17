

/*---------------------------------------------------------------------------------------*
 *  Wall
 *---------------------------------------------------------------------------------------*/
wall_count = 20;                            // キャンパス内に存在できる壁の数
InfoManager.remainingWalls = wall_count;    // 設置できる残りの壁の数

class Wall extends GameObject {
    static create(x,y){
        var block = new Wall(x,y);
        Wall.list.push(block);
        
        if(Wall.list.length > wall_count){
            Wall.list.shift();
        }
        
        InfoManager.remainingWalls = wall_count - Wall.list.length;
        
        // gameRoutineに依存せず即座に描画
        context.fillStyle = this.color;
        context.fillRect(x,y,cellSize,cellSize);
    }
}
Wall.list = [];
Wall.color = "rgb(0,0,0)"



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
    static init(){
        // 繁殖エリアを配列plantAreasに追加
        for(var i = 0; i < plantAreas_count; i++){
            plantAreas.push(Area.getRandomArea());
        }
    }
    static update(){
        // 各繁殖エリア内で植物をランダムに作成
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
    static init(){
        var adam_genes = [1,0,1,0,1,0,1,0];
        var adam = new Animal(300,300,80,0,adam_genes);
        Animal.list.push(adam);
    }

    eat(){
        var edibles = [Plant,Resource];
        var energyInc = 10;
        var callback = function(ateClassName,objClass,index){
            // クリックしていたオブジェクトを消すときはclickedObjをnullに戻す
            if(InfoManager.clickedObj != null && InfoManager.clickedObj.id == objClass.list[index].id) InfoManager.clickedObj = null;
            objClass.list.splice(index,1);
            if(objClass == Resource) InfoManager.tank += 1;
        };
        super.eat(edibles,energyInc,callback);
    }
}
Animal.list = [];
Animal.color = "rgb(200,0,0)";        // 描画に利用する色
Animal.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Animal.reproduction_interval = 3;     // 子孫を何日ごとに残すか

class Predator extends Organism {
    static init(){
        var adam_genes = [1,1,0,1,1,1,1,0]
        var adam = new Predator(250,300,80,0,adam_genes);
        Predator.list.push(adam);
    }
    eat(){
        var edibles = [Animal,Predator];
        var energyInc = 7;
        var callback = function(ateClassName,objClass,index){
            // クリックしていたオブジェクトを消すときはclickedObjをnullに戻す
            if(InfoManager.clickedObj != null && InfoManager.clickedObj.id == objClass.list[index].id) InfoManager.clickedObj = null;
            objClass.list.splice(index,1);
        };
        super.eat(edibles,energyInc,callback);
    }
}
Predator.list = [];
Predator.color = "rgb(0,0,200)"         // 描画に利用する色
Predator.reproduction_energy = 20;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 9;     // 子孫を何日ごとに残すか



//! すべてのオブジェクトクラスを登録しておく
var objectClasses = [Plant,Resource,Animal,Predator,Wall];