
function keyDown(e){
    INFO.onKeyDown(e);
}

function onDown(e){
    switch(INFO.modeNumber){
    case INFO.MODE_INFORMATION:
        INFO.clickedObj = MAP.find(INFO.mousePoint.x,INFO.mousePoint.y);
        MAP.highlight = new Point(INFO.mousePoint.x,INFO.mousePoint.y);
        var snd = new Audio("sound/se_select.mp3");
        snd.play();
        break;
    default:
        gameMenu.eventHandler(e);
        INFO.items.eventHandler(e);
    }
}
function onUp(e){}
function onClick(e){}
function onOut(e){ INFO.mouseout = true;　}
function onOver(e){
    INFO.mouseout = false;
    INFO.items.eventHandler(e);
}
function onMove(e){
    // カーソルが動いた場合、キャンパス内のカーソルの座標を更新
    INFO.mousePoint = new Point(
        (Math.floor(e.offsetX/INFO.cellSize)),
        (Math.floor(e.offsetY/INFO.cellSize)));
    INFO.bgContext.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
    gameMenu.eventHandler(e);
    INFO.items.eventHandler(e);
}

function onStageSelected(e){
    try {
        // 配信サーバーからステージを取得
        STAGE_FILE_URL = "http://localhost:9000/api?query={}".format(INFO.STAGE);
        d3.csv(STAGE_FILE_URL,function(error,stage){
            if(error){
                console.warn(error);
            }
            var CREATEFUNC = {
                0 : function(p){  /* empty */  },
                1 : function(p){ Wall.create(p) },
                2 : function(p){ Red.randomSpawn(p) },
                3 : function(p){ Blue.randomSpawn(p) },
            }
            for(var i=0; i<MAP.height; i++){
                for(var j=0; j<MAP.width; j++){
                    var blocktype = stage[i][j];
                    var create = CREATEFUNC[blocktype];
                    if(create){
                        var point = new Point(j,i);
                        create(point);
                    }
                }
            }
            Wall.soundon = true;
            INFO.remainingWalls = 150;
        });
        gameLoop();
    }
    catch(e){
        console.error(e);
        return;
    }
}
function onUpdate(e){
    INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
    INFO.day += 1;
    Plant.add();
    Resource.add();
    MAP.update();
    INFO.box.update();
    MAP.draw();
}
function onGameOver(){
    var na = 0;
    var np = 0;
    for(var h=0;h<MAP.height;h++){
        for(var w=0;w<MAP.width;w++){
            if(MAP.map[h][w] == 0) continue;
            if(MAP.map[h][w].type == "Red") na++;
            if(MAP.map[h][w].type == "Blue") np++;
        }
    }
    var text = (na >= np) ? "YOU WIN" : "YOU LOSE";
    INFO.context.font = "48px serif";
    INFO.context.fillStyle = 'rgb(255,255,0)';
    INFO.context.fillText(text,INFO.canvas.height/2,INFO.canvas.width/2-50);
}

function onItemSelected(e){
    var selectedItem = e.target.value;
    INFO.items.setCreateMode(selectedItem);
}

// ユーザー操作で発生するイベント
INFO.canvas.addEventListener('mousedown', onDown, false);
INFO.canvas.addEventListener('mouseup', onUp, false);
INFO.canvas.addEventListener('click', onClick, false);
INFO.canvas.addEventListener('mouseover', onOver, false);
INFO.canvas.addEventListener('mouseout', onOut, false);
INFO.canvas.addEventListener('mousemove',onMove,false);
document.onkeydown = keyDown;
/*
var itemOptions = document.querySelector(".el_item");
itemOptions.addEventListener("change",onItemSelected);
*/

// ゲームロジックで発行されるイベント
INFO.canvas.addEventListener('update',onUpdate,false);
INFO.canvas.addEventListener('stageselected',onStageSelected,true);
INFO.canvas.addEventListener('gameover',onGameOver,true);