
//　軽量版ベータ


/*------------------------------------------------------
 * common variables
 *-------------------------------------------------------*/

// 描画
var TEXTBOX = document.getElementById("info");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var bgCanvas = document.getElementById("background");
var bgContext = bgCanvas.getContext("2d");
var cellSize = 10;      // セルの一辺のサイズ

// マウスのモードを記録する変数
var mouseout = false;
var mouseModes = ["information","createWall","breakWall"]
var modeNumber = 0;
var mousePoint = null;
var mouseMode = mouseModes[modeNumber];
var modeChanging = false;


/*------------------------------------------------------
 * common method
 *-------------------------------------------------------*/

// "{}".format
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

function getRandomInt(min,max){ return Math.floor(Math.random()*(max+1-min))+min; }



/*------------------------------------------------------
 * common class
 *-------------------------------------------------------*/

class IDAllocator {
    static id = -1;
    static allocate(){
        IDAllocator.id++;
        return IDAllocator.id;
    }
}

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

    static getRandomPoint(area=false){
        if(!area){
            var w = this.getRandomWidth();
            var h = this.getRandomHeight();
            var p = new Point(w,h);
            return p;
        }
        var w = getRandomInt(area.x,area.x+area.range);
        var h = getRandomInt(area.y,area.y+area.range);
        var p = new Point(w,h);
        return p;
    }
}
var imaginaryPoint = new Point(-1,-1);


class Area {
    constructor(){
        this.range = getRandomInt(0,10);
        this.x = getRandomInt(0,MAP.width-this.range-1);
        this.y = getRandomInt(0,MAP.height-this.range-1);
    }

    static getRandomArea(){
        var area = new Area();
        return area;
    }
}

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
        this.highlight = imaginaryPoint;
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
                    var p = new Point(w,h);
                    var highlight = this.highlight.eq(p) ? true :false;
                    this.map[h][w].draw(highlight);
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
    static day = 0;
    static tank = 0;
    static mode = "information";
    static clickedObj = 0;
    static gameSpeed = 100;
    static finish = 1000;      // 何dayで終わるか
    static highlight = new Color(200,200,0);
}


// ゲーム速度が変化したときに呼び出される関数
var changeSpeed = function(speed){ InfoManager.gameSpeed = 1000 - speed; }

