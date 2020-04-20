
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

/* イベントの登録 */
function onDown(e){
    //console.log("down");
}
  
function onUp(e){
    //console.log("up");
}

function onClick(e){
    //console.log("click");
}

function onOver(e) {
    //console.log("mouseover");
}

function onOut(){
    //console.log("mouseout");
}

function eventRegister(){
    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('mouseup', onUp, false);
    canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mouseover', onOver, false);
    canvas.addEventListener('mouseout', onOut, false);
}

function main(){
    // initialize
    canvas.height = 480;
    canvas.width = 640;
    eventRegister();
    
    // 1秒間隔で一日を経過させる
    var intervalID = setInterval(function(){
        var gameDay = gameRoutine();

        // 1000日経過で終了
        if(gameDay >= 1000){
            clearInterval(intervalID);
        }
    },1000);
}


class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// draw test
var f1 = new Point(5,5);
var f2 = new Point(24,60);

var foods = [f1,f2];
var animals = [];
var biome = [];
var day = 0;

function gameRoutine(){
    // fresh screen
    context.clearRect(0,0,canvas.width,canvas.height);

    // update world
    ++day;
    context.fillStyle = "rgb(0,200,0)";
    for(food of foods){
        context.fillRect(food.x-2,food.y-3,5,5);
    }
    
    // draw screen
    console.log(day+"日目");

    return day
}