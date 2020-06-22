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
            var winner = (Animal.list.length >= Predator.list.length) ? "Animal" : "Predator";
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