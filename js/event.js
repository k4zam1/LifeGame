function keyDown(e){
    INFO.modeChanging = true;
    if(e.shiftKey){
        INFO.modeNumber++;
    }
    else if (e.altKey){
        INFO.modeNumber--;
    }
    INFO.modeNumber = INFO.modeNumber%3;
    INFO.mouseMode = INFO.mouseModes[INFO.modeNumber];
}

function onDown(e){
    switch(INFO.modeNumber){
        case INFO.MODE_INFORMATION:
            MAP.highlight = new Point(INFO.mousePoint.x,INFO.mousePoint.y);
            break;
        case INFO.MODE_DELETE_WALL:
            if(Wall.isLimit()){
                return;
            }
            var IID = setInterval(function(){
                // カーソルがキャンパス外に出た || mouseModeが変更されていた
                if(INFO.mouseout ||  Wall.isLimit() || INFO.modeChanging){
                    clearInterval(IID);
                    INFO.modeChanging = (INFO.modeChanging) ? false : true;   
                }
                Wall.create(INFO.mousePoint);
                
                // クリックを終えたとき、処理を終了
                INFO.canvas.onmouseup = function(e){
                    if(e.button == 0) clearInterval(IID);
                }
            },20);
            break;
        case INFO.MODE_CREATE_WALL:
            var IID = setInterval(function(){
                // カーソルがキャンパス外に出た || mouseModeが変更されていた
                if(INFO.mouseout || INFO.modeChanging){
                    clearInterval(IID);
                    INFO.modeChanging = (INFO.modeChanging) ? false : true;
                }
                Wall.delete(INFO.mousePoint);
                // クリックを終えたとき、処理を終了
                INFO.canvas.onmouseup = function(e){
                    if(e.button == 0) clearInterval(IID);
                }
            },20);
            break;
        case INFO.MODE_CREATE_BR:
            if(INFO.tank < 30 || !INFO.putable) break;
            INFO.tank -= 30;
            
            var x = INFO.mousePoint.x;
            var y = INFO.mousePoint.y;
            for(var i=0;i<2;i++){
                for(var j=0;j<2;j++){
                    var BR = new BreederReactor(x+i,y+j);
                    MAP.register(BR);
                }
            }

            INFO.modeNumber = INFO.MODE_INFORMATION;
            INFO.bgContext.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
            break;
        default: break;
    }
}

function onUp(e){}
function onClick(e){}
function onOut(e){ INFO.mouseout = true;　}
function onOver(e){
    INFO.mouseout = false;

    // 設置場所をハイライトする
    if(INFO.modeNumber == INFO.MODE_CREATE_BR){
        INFO.bgContext.fillStyle = (INFO.putable) ? "rgb(200,200,0)":"rgb(200,50,50)";
        INFO.bgContext.fillRect(INFO.mousePoint.x*INFO.cellSize+1,INFO.mousePoint.y*INFO.cellSize+1,INFO.cellSize*2-2,INFO.cellSize*2-2);
    }
}
function onMove(e){
    // 前のハイライトを消す
    if(INFO.modeNumber == INFO.MODE_CREATE_BR){
        INFO.bgContext.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
    }

    // カーソルが動いた場合、キャンパス内のカーソルの座標を更新
    INFO.mousePoint = new Point((Math.floor(e.offsetX/INFO.cellSize)),(Math.floor(e.offsetY/INFO.cellSize)));


    // ハイライトする
    if(INFO.modeNumber == INFO.MODE_CREATE_BR){
        INFO.putable = true;
        var x = INFO.mousePoint.x;
        var y = INFO.mousePoint.y;
        for(var i=0;i<2;i++){
            for(var j=0;j<2;j++){
                var found = MAP.find(x+i,y+j);
                if(found && found.type == "Wall"){
                    INFO.putable = false;
                }
            }
        }
        INFO.bgContext.fillStyle = (INFO.putable) ? "rgb(200,200,0)":"rgb(200,50,50)";
        INFO.bgContext.fillRect(INFO.mousePoint.x*INFO.cellSize+1,INFO.mousePoint.y*INFO.cellSize+1,INFO.cellSize*2-2,INFO.cellSize*2-2);
    }
}

// イベント登録
document.onkeydown = keyDown;
INFO.canvas.addEventListener('mousedown', onDown, false);
INFO.canvas.addEventListener('mouseup', onUp, false);
INFO.canvas.addEventListener('click', onClick, false);
INFO.canvas.addEventListener('mouseover', onOver, false);
INFO.canvas.addEventListener('mouseout', onOut, false);
INFO.canvas.addEventListener('mousemove',onMove,false);
