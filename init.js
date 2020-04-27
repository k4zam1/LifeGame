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


// animal,plant共通
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
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