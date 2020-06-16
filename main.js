function main(){
    // 種族の選択をチェック
    var player = null;
    var species = document.getElementById("species");
    var radioNodeList = species.name;
    for(var i=0;i<radioNodeList.length;i++){
        if(radioNodeList[i].checked){
            player = radioNodeList[i].value;
        } 
    }
    if(player === null){
        console.log("モードを選択してください");
        return;
    }
    console.log("you select :",player);



    // 各クラスの初期化
    for(cls of objectClasses){
        if(typeof cls.init == "function"){
            cls.init();
        }
    }
    // eventの初期化
    eventRegister();
    


    // 1秒間隔で一日を経過させる
    var intervalID = setInterval(function(){
        var gameDay = gameRoutine();

        // finish日経過で終了
        if(gameDay >= finish){
            clearInterval(intervalID);
            var winner = (Animal.list.length >= Predator.list.length) ? "Animal" : "Predator";
            console.log((player == winner) ? "YOU WIN" : "YOU LOSE")
        }
    },30); 
}

// 一日に一回行われる関数
// 環境のアップデート・描画のすべてを集約している
function gameRoutine(){
    //++day;
    InfoManager.day += 1;

    // objectの更新
    for(cls of objectClasses){
        if(typeof cls.update == "function"){
            cls.update();
        }
    }

    // 以下、描画処理
    context.clearRect(0,0,canvas.width,canvas.height);

    // 全オブジェクトの描画
    for(cls of objectClasses){
        cls.draw();
    }

    // 縦線
    for(var i=0;i<=canvas.width;i+=cellSize){
        context.strokeStyle ="rgb(0,0,0)";
        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i,canvas.height);
        context.closePath();
        context.stroke();
    }
    // 横線
    for(var i=0;i<=canvas.height;i+=cellSize){
        context.strokeStyle ="rgb(0,0,0)";
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(canvas.width,i);
        context.closePath();
        context.stroke();
    }

    // ハイライト
    if(!mouseout){
        context.strokeStyle ="rgb(250,250,0)";
        context.strokeRect(cellLeft,cellTop,cellSize,cellSize);
    }


    // 情報を描画する
    var innerHTMLGenerator = new InnerHTMLGenerator();
    TEXTBOX.innerHTML = innerHTMLGenerator.generate();

    // クリックしたオブジェクトをハイライト
    if(InfoManager.clickedObj != null){
        context.fillStyle = "rgb(200,200,0)";
        context.fillRect(InfoManager.clickedObj.x,InfoManager.clickedObj.y,cellSize,cellSize);
    }

    return InfoManager.day;
}