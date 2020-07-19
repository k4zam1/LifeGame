
//　軽量版ベータ
/*------------------------------------------------------
 * common variables
 *-------------------------------------------------------*/

// 描画
var TEXTBOX = document.getElementById("info");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var map = document.getElementById("stageSelect");
var bgCanvas = document.getElementById("background");
var bgContext = bgCanvas.getContext("2d");
var cellSize = 10;      // セルの一辺のサイズ
var PLAYER = null;
var stageLayout = [];   // 二次元配列を入れるための配列

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


/*------------------------------------------------------
 * common method
 *-------------------------------------------------------*/
function getRandomInt(min,max){ return Math.floor(Math.random()*(max+1-min))+min; }



/*------------------------------------------------------
 * common class
 *-------------------------------------------------------*/

 // 情報ボックスで表示する変数はInfoManagerに登録する
class InfoManager {
    static init(){
        // 各クラスの初期化
        for(var cls of InfoManager.classList){
            if(typeof cls.init == "function"){
                cls.init();
            }
        }
    }
    static setPlayer(){
        // 種族の選択をチェック
        var species = document.getElementById("species");
        this.player = species.name.value;
        if(this.player == ""){
            throw 'Player is not Selected!';
        }
        console.log("you select :",this.player);
    }
    static getAllObjectList(){
        var objects = [];
        this.classList.forEach(cls => objects.push(cls.list));
        return objects;
    }
    static registerClickedObject(mousePoint){
        // クリックしたオブジェクトを取得
        for(var objects of InfoManager.getAllObjectList()){
            var clickedObj = objects.find(obj => obj.point.eq(mousePoint));
            if(clickedObj != undefined) break;
        }
        if(clickedObj == undefined) return;
        this.clickedObj = clickedObj;
    }

    // 各情報を更新して再描画する
    static update(){
        InfoManager.day += 1;
        // オブジェクトを更新・描画
        for(var cls of InfoManager.classList){
            if(typeof cls.update == "function"){
                cls.update();
            }
            cls.draw();
        }
        // クリックされてるオブジェクトをハイライト
        if(InfoManager.clickedObj != null){
            if(InfoManager.clickedObj.energy == 0){ 
                this.clickedObj = null;
                return;
            }
            ScreenManager.draw("rgb(200,200,0)",InfoManager.clickedObj);
        }
    }
}
InfoManager.day = 0;
InfoManager.tank = 0;
InfoManager.mode = "information";
InfoManager.clickedObj = null;
InfoManager.gameSpeed = 100;
InfoManager.finish = 1000;      // 何dayで終わるか


// ゲーム速度が変化したときに呼び出される関数
var changeSpeed = function(speed){ InfoManager.gameSpeed = 1000 - speed; }


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