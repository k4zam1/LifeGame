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

function onDown(e){
    var allObjects = [Plant.list,Resource.list,Animal.list,Predator.list,Wall.list];
    
    switch(modeNumber){
        case 0: /*--: information */ InfoManager.registerClickedObject(mousePoint,allObjects);break;
        case 1:
        /*--: create */
            // 壁上限の場合
            if(Wall.isLimit()) break;
            var intervalID2 = setInterval(function(){
                // カーソルがキャンパス外に出た || 壁の上限 || mouseModeが変更されていた
                if(mouseout || Wall.isLimit() || modeChanging){
                    clearInterval(intervalID2);
                    modeChanging = (modeChanging) ? false : true;
                }
                Wall.create(mousePoint,allObjects);
                // クリックを終えたとき、処理を終了
                canvas.onmouseup = function(e){ if(e.button == 0) clearInterval(intervalID2); }
            },20);
            break;
        case 2:
        /*--: delete */
            var intervalID2 = setInterval(function(){
                // カーソルがキャンパス外に出た || mouseModeが変更されていた
                if(mouseout || modeChanging){
                    clearInterval(intervalID2);
                    modeChanging = (modeChanging) ? false : true;
                }
                // 壁オブジェクトがあった場合、それを削除する
                Wall.delete(mousePoint);
                // クリックを終えたとき、処理を終了
                canvas.onmouseup = function(e){ if(e.button == 0) clearInterval(intervalID2); }
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
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    cellLeft = (Math.floor(mouseX/10))*10;
    cellTop = (Math.floor(mouseY/10))*10;
    mousePoint = new Point(cellLeft,cellTop);
}

// イベント登録
document.onkeydown = keyDown;
canvas.addEventListener('mousedown', onDown, false);
canvas.addEventListener('mouseup', onUp, false);
canvas.addEventListener('click', onClick, false);
canvas.addEventListener('mouseover', onOver, false);
canvas.addEventListener('mouseout', onOut, false);
canvas.addEventListener('mousemove',onMove,false);
