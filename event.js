function keyDown(e){
    modeChanging = true;
    if(e.shiftKey){
        modeNumber++;
    }
    else if (e.altKey){
        modeNumber--;
    }
    modeNumber = modeNumber%3;
    mouseMode = mouseModes[modeNumber];
    InfoManager.mode = mouseMode;
}
var MODE_INFORMATION = 0;
var MODE_DELETE_WALL = 1;
var MODE_CREATE_WALL = 2;

function onDown(e){
    switch(modeNumber){
        case MODE_INFORMATION:
            MAP.highlight = new Point(mousePoint.x,mousePoint.y);
            break;
        case MODE_DELETE_WALL:
            if(Wall.isLimit()){
                return;
            }
            var IID = setInterval(function(){
                // カーソルがキャンパス外に出た || mouseModeが変更されていた
                if(mouseout ||  Wall.isLimit() || modeChanging){
                    clearInterval(IID);
                    modeChanging = (modeChanging) ? false : true;   
                }
                Wall.create(mousePoint);
                // クリックを終えたとき、処理を終了
                canvas.onmouseup = function(e){
                    if(e.button == 0) clearInterval(IID);
                }
            },20);
            break;
        case MODE_CREATE_WALL:
            var IID = setInterval(function(){
                // カーソルがキャンパス外に出た || mouseModeが変更されていた
                if(mouseout || modeChanging){
                    clearInterval(IID);
                    modeChanging = (modeChanging) ? false : true;
                }
                Wall.delete(mousePoint);
                // クリックを終えたとき、処理を終了
                canvas.onmouseup = function(e){
                    if(e.button == 0) clearInterval(IID);
                }
            },20);
            break;
        default: break;
    }
}

function onUp(e){}
function onClick(e){}
function onOut(e){　mouseout = true;　}
function onOver(e){　mouseout = false;　}
function onMove(e){
    // カーソルが動いた場合、キャンパス内のカーソルの座標を更新
    mousePoint = new Point((Math.floor(e.offsetX/10)),(Math.floor(e.offsetY/10)));
}

// イベント登録
document.onkeydown = keyDown;
canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mouseup', onUp, false);
canvas.addEventListener('click', onClick, false);
canvas.addEventListener('mouseover', onOver, false);
canvas.addEventListener('mouseout', onOut, false);
canvas.addEventListener('mousemove',onMove,false);
