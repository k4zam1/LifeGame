
/* ライフゲーム全体で使用するグローバル変数 */
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var cellSize = 10;
var day = 0;

var mouseX = 0;
var mouseY = 0;
var cellLeft = 0;
var cellTop = 0;
var mouseout = false;


/* イベントの登録 */

function onDown(){
    //console.log("onDouwn");
}

function onUp(){
    //console.log("onUp");
}

function onClick(){
    //console.log("click");
}

function onOver() {
    //console.log("mouseover");
    mouseout = false;
}

function onOut(){
    //console.log("mouseout");
    mouseout = true;
}


function eventRegister(){
    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('mouseup', onUp, false);
    canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mouseover', onOver, false);
    canvas.addEventListener('mouseout', onOut, false);
    
    
    // カーソルが動いた場合、キャンパス内のカーソルの座標を更新
    canvas.onmousemove = function(e){
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        cellLeft = (Math.floor(mouseX/10))*10;
        cellTop = (Math.floor(mouseY/10))*10;
    }
    
    // 左クリックを始めたときの処理
    canvas.onmousedown = function(e){
        if(e.button == 0){
            var intervalID2 = setInterval(function(){
                
                // カーソルがキャンパス外に出た場合、処理を終了
                if(mouseout){
                   clearInterval(intervalID2);
                }
                
                // カーソルのあるセルの情報を読み取る関数
                // 壁を作成する関数 動植物がある場合はそれを削除してから作成
                //console.log(mouseX, mouseY, cellLeft, cellTop);
                
                
                // 左クリックを終えたときの処理
                canvas.onmouseup = function(e){
                    if(e.button == 0){
                        clearInterval(intervalID2);
                    }
                }
            },20);
        }
    }
}


// animal,plant共通
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    eq(point){
        if(this.x == point.x && this.y == point.y){
            return true;
        }
        return false;
    }
}
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
