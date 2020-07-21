
var PLAYER = null;
var screenIID = 0;

function main(){
    try {
        // set PLAYER
        var species = document.getElementById("species");
        PLAYER = species.name.value;
        if(!PLAYER){
            throw 'Player is not Selected!';
        }
        //console.log("you select :",player);


        createStage();

        // draw background
        /*
        var m = Math.max(canvas.width,canvas.height);
        bgCanvas.strokeStyle ="rgb(0,0,0)";
        bgCanvas.beginPath();
        for(var i=0;i<=m;i+=cellSize){
            // 横線
            bgCanvas.moveTo(i,0);
            bgCanvas.lineTo(i,canvas.height);
            // 縦線
            bgCanvas.moveTo(0,i);
            bgCanvas.lineTo(canvas.width,i);
        }
        bgCanvas.closePath();
        bgCanvas.stroke();
        */

        gameLoop();
    }
    catch(e){
        console.error(e);
        return;
    }
}


function gameLoop(gameSpeed=InfoManager.gameSpeed){
    // 以下の内容をループする
    screenIID = setInterval(function(){
        context.clearRect(0,0,canvas.width,canvas.height);

        // 各情報を更新して再描画する
        InfoManager.day += 1;
        Plant.add();
        Resource.add();
        MAP.update();
        infoBox.update();
        MAP.draw();

        // ゲーム終了
        if(InfoManager.day >= InfoManager.finish){
            var na = 0;
            var np = 0;
            for(var h=0;h<MAP.height;h++){
                for(var w=0;w<MAP.width;w++){
                    if(MAP.map[h][w] == 0) continue;
                    if(MAP.map[h][w].type == "Animal") na++;
                    if(MAP.map[h][w].type == "Predator") np++;
                }
            }
            var winner = (na >= np) ? "Animal" : "Predator";
            var text = (PLAYER == winner) ? "YOU WIN" : "YOU LOSE";
            context.font = "48px serif";
            context.fillStyle = 'rgb(255,255,0)';
            context.fillText(text,canvas.height/2,canvas.width/2-50);
            clearInterval(screenIID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != InfoManager.gameSpeed){
            clearInterval(screenIID);
            gameLoop(InfoManager.gameSpeed);
        }
    },gameSpeed);
}