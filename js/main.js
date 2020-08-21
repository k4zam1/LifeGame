
function main(){
    menuScreenIID  = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
        gameMenu.draw();
        if(INFO.modeNumber != INFO.MODE_SELECT_STAGE){
            clearInterval(menuScreenIID);
            // item
            $(".bl_tab_itemCreate").addClass("is_active");
            INFO.ctab.tabs();
            INFO.dtab.tabs();
            INFO.ctab.tabs('refresh');
            for(var item of INFO.items){
                INFO.ctab.append('<li>' + item.type + '</li>');
                INFO.ctab.tabs('refresh');
            }
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
