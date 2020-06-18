function main(){
    // 種族の選択をチェック
    var species = document.getElementById("species");
    var radioNodeList = species.name;
    for(var i=0;i<radioNodeList.length;i++){
        if(radioNodeList[i].checked){
            PLAYER = radioNodeList[i].value;
        } 
    }
    if(PLAYER === null){
        console.log("モードを選択してください");
        return;
    }
    console.log("you select :",PLAYER);


    // 背景描画
    var m = Math.max(canvas.width,canvas.height);
    bgContext.strokeStyle ="rgb(0,0,0)";
    bgContext.beginPath();
    for(var i=0;i<=m;i+=cellSize){
        // 横線
        bgContext.moveTo(i,0);
        bgContext.lineTo(i,canvas.height);

        // 縦線
        bgContext.moveTo(0,i);
        bgContext.lineTo(canvas.width,i);
    }
    bgContext.closePath();
    bgContext.stroke();



    // 各クラスの初期化
    for(cls of objectClasses){
        if(typeof cls.init == "function"){
            cls.init();
        }
    }

    // eventの初期化
    eventRegister();
    

    // 1秒間隔で一日を経過させる
    gameLoop(InfoManager.gameSpeed);
}



function gameLoop(gameSpeed){
    // 以下の内容をループする
    var intervalID = setInterval(function(){
        InfoManager.day += 1;
        
        // 描画
        context.clearRect(0,0,canvas.width,canvas.height);
        for(cls of objectClasses){
            if(typeof cls.update == "function"){
                cls.update();
            }
            cls.draw();
        }
    
        // 情報を描画する
        innerHTMLGenerator.update();
        TEXTBOX.innerHTML = innerHTMLGenerator.generate();
    
        // クリックされてるオブジェクトをハイライト
        if(InfoManager.clickedObj != null){
            context.fillStyle = "rgb(200,200,0)";
            context.fillRect(InfoManager.clickedObj.x,InfoManager.clickedObj.y,cellSize,cellSize);
        }

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