

/*------------------------------------------------------
 * common variables
 *-------------------------------------------------------*/

 // 描画
var TEXTBOX = document.getElementById("info");
var canvas = document.getElementById("canvas");
var map = document.getElementById("stageSelect");
var context = canvas.getContext("2d");
var map = document.getElementById("stageSelect");
var bgCanvas = document.getElementById("background");
var bgContext = bgCanvas.getContext("2d");
var cellSize = 10;      // セルの一辺のサイズ

var PLAYER = null;
var FINISH = 1000;      // 何dayで終わるか

var stageLayout = [];   // 二次元配列を入れるための配列
canvas.height = 480;    // canvasのwidth
canvas.width = 640;     // canvasのheight

// マウスの位置情報を記録する変数
var mouseX = 0;
var mouseY = 0;
var cellLeft = 0;
var cellTop = 0;
var mouseout = false;


// マウスのモードを記録する変数
var mouseModes = ["information","createWall","breakWall"]
var modeNumber = 0;
var mousePoint = null;
var mouseMode = mouseModes[modeNumber];
var modeChanging = false;

// 情報ボックスで表示する変数はInfoManagerに登録する
class InfoManager {
    static registerClickedObject(mousePoint,objectsList){
        // クリックしたオブジェクトを取得
        var clickedObj = function(){
            for(var objects of objectsList){
                for(var obj of objects){
                    if(obj.point.eq(mousePoint))　return obj;
                }
            }
            return null;
        }();
        // InfoManagerに登録
        if(clickedObj != null && clickedObj.id != null){
            this.clickedObj = clickedObj;
        }
    }
}
InfoManager.day = 0;
InfoManager.tank = 0;
InfoManager.mode = "information";
InfoManager.clickedObj = null;
InfoManager.gameSpeed = 100;


// ゲーム速度
var SPEED_SLIDER = document.getElementById("gameSpeedSlider");
var changeSpeed = function(speed){
    InfoManager.gameSpeed = 1000 - speed;
}


/*------------------------------------------------------
 * common method
 *-------------------------------------------------------*/
function sum(arr){
    var s = 0;
    arr.forEach(function(elm){
        s += elm;
    });
    return s;
}

function getRandomInt(min,max){
    var rand = Math.floor(Math.random()*(max+1-min))+min;
    return rand;
}

function deepCopyArray(sourceArray){
    var newArray = [];
    for(s of sourceArray){
        newArray.push(s);
    }
    return newArray;
}





/*------------------------------------------------------
 * common class
 *-------------------------------------------------------*/
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    eq(point){
        if(this.x == point.x && this.y == point.y) return true;
        return false;
    }
    set(x,y){
        this.x = x;
        this.y = y;
    }

    static getRandomWidth(){
        return getRandomInt(0,canvas.width/cellSize);
    }

    static getRandomHeight(){
        return getRandomInt(0,canvas.height/cellSize);
    }

    static getRandomPoint(){
        var w = this.getRandomWidth();
        var h = this.getRandomHeight();
        var p = new Point(w*cellSize,h*cellSize);
        return p;
    }

    static getRandomPointIn(areas){
        var points = [];
        for(var i = 0; i < areas.length; i++){
            var p = new Point(
                Math.floor(Math.random()*areas[i].range + areas[i].AreaX)*cellSize,
                Math.floor(Math.random()*areas[i].range + areas[i].AreaY)*cellSize);
            points.push(p);
        }
        return points;
    }
}

class Area {
    constructor(minX,minY,areaRange,randomRange){
        this.AreaX = Math.floor(Math.random()*minX)/cellSize;
        this.AreaY = Math.floor(Math.random()*minY)/cellSize; 
        this.range = Math.floor(Math.random()*randomRange + areaRange);
    }

    static getRandomArea(){
        var area = new Area(canvas.width,canvas.clientHeight,5,4);
        return area;
    }
}

// オブジェクトにIDを振る
// クリックするオブジェクトにはこれでIDを割り振る
class IDAllocator {
    constructor(){
        this.id = -1;
    }
    allocate(){
        this.id++;
        return this.id;
    }
}
var idAllocator = new IDAllocator();

// セルに配置するクラスに継承する
class GameObject {
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;
        this.y = y;
        this.point = new Point(x,y);
        this.type = this.constructor.name;
    }

    static draw(){
        context.fillStyle = this.color;
        for(var obj of this.list){
            context.fillRect(obj.x+1,obj.y+1,cellSize-2,cellSize-2);
        }
    }
}
GameObject.list = [];
GameObject.color = "rgb(0,0,0)";

class Organism extends GameObject {
    constructor(x,y,energy,direction,genes){
        super(x,y);
        this.energy = energy;               // type:num
        this.dir = direction;               // type:num
        this.genes = genes;                 // type:array
    }

    move(){
        var next = new Point(this.x,this.y);

        // xについての移動,cellSizeを単位とする
        if(2 <= this.dir && this.dir < 5){
            next.x += cellSize;
        }
        else if(this.dir == 1 || this.dir == 5){
            next.x += 0;
        }
        else {
            next.x -= cellSize;
        }

        // yについての移動,cellSizeを単位とする
        if(0 <= this.dir && this.dir < 3){
            next.y -= cellSize;
        }
        else if(4 <= this.dir && this.dir < 7){
            next.y += cellSize;
        }

        // 端移動の処理
        next.x = next.x % canvas.width;
        next.y = next.y % canvas.height;
        if(next.x < 0){
            next.x += canvas.width;
        }
        if(next.y < 0){
            next.y += canvas.height;
        }

        // オブジェクトの判定
        for(var wall of Wall.list){
            if(wall.point.eq(next)){
                return;
            }
        }
        for(var br of BreederReactor.list){
            if(br.point.eq(next)){
                return;
            }
        }

        // 情報の更新
        this.x = next.x;
        this.y = next.y;
        this.point.x = next.x;
        this.point.y = next.y;
        this.energy -= 1;
    }

    turn(){
        var s = sum(this.genes);
        var r = getRandomInt(0,s);

        var i = 0;
        for(var gene of this.genes){
            r -= gene;
            if(r <= 0){
                this.dir = i;
                break;
            }
            i++;
        }
    }

    eat(edibles,energyInc=10){
        var ate;
        for(var edible of edibles){
            for(var i=0;i<edible.list.length;i++){
                if(this.point.eq(edible.list[i].point) && this.id != edible.list[i].id){
                    this.energy += energyInc;

                    // クリックしていたオブジェクトを消すときはclickedObjをnullに戻す
                    if(InfoManager.clickedObj != null && InfoManager.clickedObj.id == edible.list[i].id) InfoManager.clickedObj = null;
                    
                    // オブジェクトがResourceならタンクを増やす
                    if(edible == Resource) InfoManager.tank += 1;
                    edible.list.splice(i,1);
                    break;
                }
            }
        }
    }

    reproduce(){
        if(this.energy < this.reproduction_energy){
            return null;
        }

        var energy = Math.floor(this.energy/2);
        var genes = deepCopyArray(this.genes);

        // 突然変異 -1,0,1をランダムのスロットに加算
        var slot = getRandomInt(0,7);
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,3)-1);

        var child = new this.constructor(this.x,this.y,energy,this.dir,genes);
        return child;
    }

    static getRandomGene(){
        var geneLength = 8;
        var genes = [];
        for(var i=0;i<geneLength;i++){
            genes.push(getRandomInt(0,1));
        }
    }

    static init(){
        // ランダムな遺伝子を作成
        var geneLength = 8;
        var genes = [];
        for(var i=0;i<geneLength;i++){
            genes.push(getRandomInt(0,1));
        }

        // ランダムなプロパティを作成
        var respawn = Point.getRandomPoint();
        var energy = getRandomInt(100,200);
        var dir = getRandomInt(0,7);

        // オブジェクト生成
        var adam = new this(respawn.x,respawn.y,energy,dir,genes);
        this.list.push(adam);
    }

    static update(){
        // 更新
        var newCreatures = []
        for(var creature of this.list){
            if(creature != undefined && creature.energy > 0){
                newCreatures.push(creature);
            }
            else if(creature != null &&  InfoManager.clickedObj != null && creature.energy == 0 && creature.id == InfoManager.clickedObj.id){
                InfoManager.clickedObj = null;
            }
        }
        this.list = deepCopyArray(newCreatures);

        // 行動
        var childs = [];
        for(var creature of this.list){
            creature.turn();
            creature.move();
            creature.eat();
            if(InfoManager.day%this.reproduction_interval == 0){
                var child = creature.reproduce();
                if(child != null){
                    childs.push(child);
                }
            }
        }
        for(child of childs){
            this.list.push(child);
        }
    }
}

class InnerHTMLGenerator {
    constructor(){
        this.info = {
            "day":InfoManager.day,
            "mode":InfoManager.mode,
            "tank":InfoManager.tank,
            "remaining_walls":InfoManager.remainingWalls,
            "id":null,
            "type":null,
            "x":null,
            "y":null,
            "energy":null,
            "genes":null
        };
        this.clickedObj = InfoManager.clickedObj;
    }
    generate(){
        var text = "<p>";
        for(let title in this.info){
            // clickdObjの情報があれば追加
            if(this.info[title] == null && this.clickedObj != null){
                if(this.clickedObj[title] != undefined) text += title+":"+this.clickedObj[title]+"<br/>";
            }
            else if(this.info[title] != null){
                text += title+":"+this.info[title]+"<br/>"
            }
        }
        text += "</p>";
        return text;
    }

    update(){
        this.info.day = InfoManager.day;
        this.info.mode = InfoManager.mode;
        this.info.tank = InfoManager.tank;
        this.info.remaining_walls = InfoManager.remainingWalls;
        this.clickedObj = InfoManager.clickedObj;
    }
}
var innerHTMLGenerator = new InnerHTMLGenerator();


class ScreenManager {
    static drawBackground(){
        var m = Math.max(canvas.width,canvas.height);
        this.background.strokeStyle ="rgb(0,0,0)";
        this.background.beginPath();
        for(var i=0;i<=m;i+=cellSize){
            // 横線
            this.background.moveTo(i,0);
            this.background.lineTo(i,canvas.height);
    
            // 縦線
            this.background.moveTo(0,i);
            this.background.lineTo(canvas.width,i);
        }
        this.background.closePath();
        this.background.stroke();
    }
    static updateGameScreen(objClasses,){

        // 描画
        this.gameScreen.clearRect(0,0,canvas.width,canvas.height);
        for(var cls of objClasses){
            if(typeof cls.update == "function"){
                cls.update();
            }
            cls.draw();
        }
        // 情報を描画する
        innerHTMLGenerator.update();
        TEXTBOX.innerHTML = innerHTMLGenerator.generate();
    
        // クリックされてるオブジェクトをハイライト
        if(InfoManager.clickedObj != null){
            this.gameScreen.fillStyle = "rgb(200,200,0)";
            this.gameScreen.fillRect(InfoManager.clickedObj.x,InfoManager.clickedObj.y,cellSize,cellSize);
        }
    }
}
ScreenManager.gameScreen = context;
ScreenManager.background = bgContext;

