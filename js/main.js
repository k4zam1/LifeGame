
function main(){
    menuScreenIID  = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
        gameMenu.draw();

        if(INFO.modeNumber != INFO.MODE_SELECT_STAGE){
            var event = new Event("stageselected");
            INFO.canvas.dispatchEvent(event);
            clearInterval(menuScreenIID);
        }
    },20);
}

function gameLoop(gameSpeed=INFO.gameSpeed){
    var finish = 1000;
    INFO.screenIID = setInterval(function(){
        var event = new Event("update");
        INFO.canvas.dispatchEvent(event);

        // ゲーム終了
        if(INFO.day >= finish){
            var event = new Event("gameover");
            INFO.canvas.dispatchEvent(event);
            clearInterval(INFO.screenIID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != INFO.gameSpeed){
            gameLoop(INFO.gameSpeed);
            clearInterval(INFO.screenIID);
        }
    },gameSpeed);
}
