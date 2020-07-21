function main(){
    try {
        InfoManager.init();
        InfoManager.setPlayer();
        createStage();
        gameLoop();
    }
    catch(e){
        console.error(e);
        return;
    }
}


function gameLoop(gameSpeed=InfoManager.gameSpeed){
    // 以下の内容をループする
    ScreenManager.IID = setInterval(function(){
        ScreenManager.clear();
        // 各情報を更新して再描画する
        InfoManager.update();
        // 情報を描画する
        innerHTMLGenerator.update();
        TEXTBOX.innerHTML = innerHTMLGenerator.generate();

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
            ScreenManager.showFinishScreen(winner);
            clearInterval(ScreenManager.IID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != InfoManager.gameSpeed){
            clearInterval(ScreenManager.IID);
            gameLoop(InfoManager.gameSpeed);
        }
    },gameSpeed);
}