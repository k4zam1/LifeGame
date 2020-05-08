function main(){
    // draw test(あとで消すこと)
    var adam_genes = [1,0,1,0,1,0,1,0];
    var adam = new Animal(50,50,80,0,adam_genes);
    animals.push(adam);

    var predator_genes = [1,1,2,1,1,1,1,0]
    var adam_predator = new Predator(60,80,80,0,predator_genes);
    predators.push(adam_predator);
    // draw test　ここまで

    // initialize
    canvas.height = 480;
    canvas.width = 640;
    eventRegister();
    
    // 1秒間隔で一日を経過させる
    var intervalID = setInterval(function(){
        var gameDay = gameRoutine();

        // 1000日経過で終了
        if(gameDay >= 1000){
            clearInterval(intervalID);
        }
    },1000);
}

// 一日に一回行われる関数
// 環境のアップデート・描画のすべてを集約している
var allObjects = null;
function gameRoutine(){
    ++day;

    // objectの更新
    add_plant();
    predators = updateCreatures(predators);
    animals = updateCreatures(animals);
    allObjects = [plants,predators,animals];

    // draw
    drawScreen();
    return day
}


// すべての描画を行う関数
function drawScreen(){
    // fresh screen
    context.clearRect(0,0,canvas.width,canvas.height);

    // 全オブジェクトの描画
    for(obj of allObjects){
        drawObject(obj);
    }

    // 縦線
    for(var i=0;i<=canvas.width;i+=cellSize){
        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i,canvas.height);
        context.closePath();
        context.stroke();
    }
    // 横線
    for(var i=0;i<=canvas.height;i+=cellSize){
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(canvas.width,i);
        context.closePath();
        context.stroke();
    }


    // 何日目かを描画する
    var textBox = document.getElementById("informationBox");
    var dayInformation = "<p>DAY:"+day+"</p><br/>";

    // 選択している個体の情報を表示
    if(select != null){
        var notFoundSelectedObject = true;
        for(objects of allObjects){
            for(obj of objects){
                if(select == obj.id){
                    var text = dayInformation
                        + "<p>ID:"+obj.id+"<br/>"
                        + "type:"+obj.type+"<br/>"
                        + "x:"+ obj.x + "y:" + obj.y +"<br/>"
                        + "energy:" + obj.energy+"<br/>"
                        + "genes:"+obj.genes+"</p>";
                    textBox.innerHTML = text;
                    context.fillStyle = "rgb(200,200,0)";
                    context.fillRect(obj.x,obj.y,cellSize,cellSize);
                    notFoundSelectedObject = false;
                    break;
                }
            }
        }
        // idを持つ個体がいなかった
        if(notFoundSelectedObject){
            select = null;
            return;
        }
    }
    // 何も選択していないとき
    else {
        textBox.innerHTML = dayInformation;
    }
}

// 描画するオブジェクトの集合drawObjectが与えられると
// そのなかのすべてを描画する関数
function drawObject(drawObject){
    for(obj of drawObject){
        context.fillStyle = obj.color;
        context.fillRect(obj.x,obj.y,cellSize,cellSize);
    }
}