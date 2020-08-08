
function main(){
    menuScreenIID  = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
        gameMenu.draw();
        if(INFO.modeNumber != INFO.MODE_SELECT_STAGE){
            clearInterval(menuScreenIID);
            INFO.canvas.dispatchEvent(new Event("stageselected"));
        }
    },20);
}

function gameLoop(gameSpeed=INFO.gameSpeed){
    var finish = 1000;
    var intervalID = setInterval(function(){
        INFO.canvas.dispatchEvent(new Event("update"));
        if(INFO.day >= finish){
            clearInterval(intervalID);
            INFO.canvas.dispatchEvent(new Event("gameover"));
        }
        // 速度が変わった場合再読み込み
        if(gameSpeed != INFO.gameSpeed){
            clearInterval(intervalID);
            gameLoop(INFO.gameSpeed);
        }
    },gameSpeed);
}
