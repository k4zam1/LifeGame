
function main(){
    try {
        // set PLAYER
        var species = document.getElementById("species");
        INFO.PLAYER = species.name.value;
        if(!INFO.PLAYER){
            throw 'Player is not Selected!';
        }
        //console.log("you select :",player);

        createStage();

        // draw background
        /*
        var m = Math.max(INFO.canvas.width,INFO.canvas.height);
        bgCanvas.strokeStyle ="rgb(0,0,0)";
        bgCanvas.beginPath();
        for(var i=0;i<=m;i+=INFO.cellSize){
            // 横線
            bgCanvas.moveTo(i,0);
            bgCanvas.lineTo(i,INFO.canvas.height);
            // 縦線
            bgCanvas.moveTo(0,i);
            bgCanvas.lineTo(INFO.canvas.width,i);
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


function gameLoop(gameSpeed=INFO.gameSpeed){
    var finish = 1000;

    // 以下の内容をループする
    INFO.screenIID = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);

        // 各情報を更新して再描画する
        INFO.day += 1;
        Plant.add();
        Resource.add();
        MAP.update();
        INFO.box.update();

        // draw
        MAP.draw();


        // ゲーム終了
        if(INFO.day >= finish){
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
            var text = (INFO.PLAYER == winner) ? "YOU WIN" : "YOU LOSE";
            INFO.context.font = "48px serif";
            INFO.context.fillStyle = 'rgb(255,255,0)';
            INFO.context.fillText(text,INFO.canvas.height/2,INFO.canvas.width/2-50);
            clearInterval(INFO.screenIID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != INFO.gameSpeed){
            clearInterval(INFO.screenIID);
            gameLoop(INFO.gameSpeed);
        }
    },gameSpeed);
}