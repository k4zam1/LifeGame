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
    var mousePoint = new Point(cellLeft,cellTop);
    
    // information の場合オブジェクトをInfoManagerに登録
    if(modeNumber == 0){
        // クリックしたオブジェクトを取得
        var clickedObj = function(){
            for(objects of allObjects){
                for(obj of objects){
                    if(obj.point.eq(mousePoint))　return obj;
                }
            }
            return null;
        }();
        // InfoManagerに登録
        if(clickedObj != null && clickedObj.id != null){
            InfoManager.clickedObj = clickedObj;
        }
    }
    
    
    // createWall の場合、壁を生成
    if(modeNumber == 1){
        if(Wall.list.length >= wall_count){
            //ブブーなどのサウンドを鳴らしてみるか検討中
            
        } else {
            var intervalID2 = setInterval(function(){

                // カーソルがキャンパス外に出た場合、処理を終了
                if(mouseout){
                    clearInterval(intervalID2);
                }

                // mouseModeが変更されていた場合、処理を終了
                else if(modeChanging){
                    clearInterval(intervalID2);
                    modeChanging = false;
                }

                // 壁の数が上限に達した場合、処理を終了
                else if(Wall.list.length >= wall_count){
                    clearInterval(intervalID2);
                    //サウンドの検討
                }

                mousePoint = new Point(cellLeft,cellTop);



                // オブジェクトがあった場合、それを削除する
                for(objects of allObjects){
                    for(var i=0;i<objects.length;i++){
                        if(mousePoint.eq(objects[i])){
                            objects.splice(i,1);
                            break;
                        }
                    }
                }
                Wall.create(cellLeft,cellTop);
                //console.log(walls);

                // クリックを終えたとき、処理を終了
                canvas.onmouseup = function(e){
                    if(e.button == 0){
                        clearInterval(intervalID2);
                    }
                }
            },20);
        }
    }

    
    // extinguish の場合、オブジェクトを削除
    if(modeNumber == 2){
        var intervalID2 = setInterval(function(){
            
            // カーソルがキャンパス外に出た場合、処理を終了
            if(mouseout){
                clearInterval(intervalID2);
            }
            
            // mouseModeが変更されていた場合、処理を終了
            else if(modeChanging){
                clearInterval(intervalID2);
                modeChanging = false;
            }
            
            mousePoint = new Point(cellLeft,cellTop);
            
            /*
            // オブジェクトがあった場合、それを削除する
            for(objects of allObjects){
                for(var i=0;i<objects.length;i++){
                    if(mousePoint.eq(objects[i])){
                        objects.splice(i,1);
                        break;
                    }
                }
            }
            */
            
            
            // 壁オブジェクトがあった場合、それを削除する
            for(var i=0;i<Wall.list.length;i++){
                if(mousePoint.eq(Wall.list[i])){
                    Wall.list.splice(i,1);
                    InfoManager.remainingWalls = wall_count - Wall.list.length;
                    
                    // gameRoutineに依存せず即座に描画
                    context.fillStyle ="rgb(100,100,100)";
                    context.fillRect(cellLeft,cellTop,cellSize,cellSize);
                    break;
                }
            }
            
            
            // クリックを終えたとき、処理を終了
            canvas.onmouseup = function(e){
                if(e.button == 0){
                    clearInterval(intervalID2);
                }
            }
        },20);
    }
}


function onUp(e){
    //console.log("onUp");
}

function onClick(e){
    //console.log("click");
}

function onOver() {
    //console.log("mouseover");
    mouseout = false;
}

function onOut(e){
    //console.log("mouseout");
    mouseout = true;

}

function onMove(e){
    // カーソルが動いた場合、キャンパス内のカーソルの座標を更新
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    cellLeft = (Math.floor(mouseX/10))*10;
    cellTop = (Math.floor(mouseY/10))*10;
}


function eventRegister(){
    /* 
        eventRegisterは簡潔さを保つためにイベントを登録するだけの機能にする
        具体的な処理は原則的にすべてeventListenerに登録した関数内に記述する
    */
    document.onkeydown = keyDown;
    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('mouseup', onUp, false);
    canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mouseover', onOver, false);
    canvas.addEventListener('mouseout', onOut, false);
    canvas.addEventListener('mousemove',onMove,false);
}