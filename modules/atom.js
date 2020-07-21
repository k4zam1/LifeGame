
//　軽量版ベータ

// "{}".format
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};


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
class Color {
    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
        this.color = this.__makeRGB();
    }
    __makeRGB(){
        return "rgb({},{},{})".format(this.r,this.g,this.b);
    }
    set(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
        this.color = this.__makeRGB();
    }
    makeGradation(r,g,b){
        var tr = this.r + r;
        var tg = this.g + g;
        var tb = this.b + b;
        return "rgb({},{},{})".format(tr,tg,tb);
    }
}


class Map {
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.map = Array.from(new Array(height), () => new Array(width).fill(0));
    }
    register(target){
        this.map[target.y][target.x] = target;
    }
    delete(target){
        this.map[target.y][target.x] = 0;
    }
    find(x,y){
        return this.map[y][x];
    }
    update(){
        for(var h=0;h<this.height;h++){
            for(var w=0;w<this.width;w++){
                if(this.map[h][w] == 0) continue;
                if(typeof this.map[h][w].update == "function"){
                    this.map[h][w].update();
                }
            }
        }
    }
    draw(){
        for(var h=0;h<this.height;h++){
            for(var w=0;w<this.width;w++){
                if(this.map[h][w] == 0) continue;
                if(typeof this.map[h][w].draw == "function"){
                    this.map[h][w].draw();
                }
            }
        }
    }
    getBlankPoint(x,y){
        for(var i=-1;i<1;i++){
            for(var j=-1;j<1;j++){
                var px = x+i%MAP.width;
                var py = y+j%MAP.height;
                if(px < 0) px += MAP.width;
                if(py < 0) py += MAP.height;
                var found = this.find(px,py);
                if(!found){
                    return new Point(px,py);
                }
            }
        }
        return 0;
    }
}
var MAP = new Map(canvas.width/cellSize,canvas.height/cellSize);


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

    // 各情報を更新して再描画する
    static update(){
        InfoManager.day += 1;
        
        // オブジェクトを更新・描画
        for(var cls of InfoManager.classList){
            if(typeof cls.update == "function"){
                cls.update();
            }
        }
        MAP.update();
        MAP.draw();


        // クリックされてるオブジェクトをハイライト
        if(InfoManager.clickedObj != 0){
            if(InfoManager.clickedObj.energy == 0){ 
                this.clickedObj = 0;
                return;
            }
            ScreenManager.draw(this.highlight,InfoManager.clickedObj);
        }
    }
}
InfoManager.day = 0;
InfoManager.tank = 0;
InfoManager.mode = "information";
InfoManager.clickedObj = 0;
InfoManager.gameSpeed = 100;
InfoManager.finish = 1000;      // 何dayで終わるか
InfoManager.highlight = new Color(200,200,0);


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
        return getRandomInt(0,MAP.width-1);
    }

    static getRandomHeight(){
        return getRandomInt(0,MAP.height-1);
    }

    static getRandomPoint(){
        var w = this.getRandomWidth();
        var h = this.getRandomHeight();
        var p = new Point(w,h);
        return p;
    }
}

class Area {
    constructor(){
        this.range = getRandomInt(0,10);
        this.x = getRandomInt(0,MAP.width-this.range-1);
        this.y = getRandomInt(0,MAP.height-this.range-1);
    }
    
    getRandomPoint(){
        var x = getRandomInt(this.x,this.x+this.range);
        var y = getRandomInt(this.y,this.y+this.range);
        return new Point(x,y);
    }

    static getRandomArea(){
        var area = new Area();
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