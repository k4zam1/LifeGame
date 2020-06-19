function main(){
    ScreenManager.drawBackground();
    
    // 種族の選択をチェック
    var species = document.getElementById("species");
    var radioNodeList = species.name;
    for(var i=0;i<radioNodeList.length;i++){
        if(radioNodeList[i].checked){
            PLAYER = radioNodeList[i].value;
            console.log("you select :",PLAYER);
            break;
        } 
    }
    if(PLAYER === null){
        console.log("モードを選択してください");
        return;
    }

    gameLoop(InfoManager.gameSpeed);
}



function gameLoop(gameSpeed){
    // 以下の内容をループする
    var intervalID = setInterval(function(){
        InfoManager.day += 1;
        ScreenManager.updateGameScreen(objectClasses);

        // ゲーム終了
        if(InfoManager.day >= FINISH){
            var winner = (Animal.list.length >= Predator.list.length) ? "Animal" : "Predator";
            console.log((PLAYER == winner) ? "YOU WIN" : "YOU LOSE");
            clearInterval(intervalID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != InfoManager.gameSpeed){
            clearInterval(intervalID);
            gameLoop(InfoManager.gameSpeed);
        }
    },gameSpeed);
}