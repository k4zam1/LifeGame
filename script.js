function main(){
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

// draw test
var adam_genes = [0,2,3,5,6,8,1,0];
var adam = new Animal(50,50,80,0,adam_genes);
animals.push(adam);

var day = 0;

function gameRoutine(){
    // fresh screen
    context.clearRect(0,0,canvas.width,canvas.height);

    // update world
    ++day;
    add_plant();

    // animals_update
    var new_animals = []
    for(animal of animals){
        if(animal.energy > 0){
            new_animals.push(animal);
        }
    }
    animals = Object.create(new_animals);
    var childs = [];
    for(animal of animals){
        animal.turn();
        animal.move();
        //animal.eat();
        if(day%3 == 0){
            var child = animal.reproduce();
            childs.push(child);
        }
    }
    for(child of childs){
        animals.push(child);
    }
    
    drawScreen();
    console.log(day+"日目");

    return day
}


function drawScreen(){
    context.fillStyle = "rgb(0,200,0)";
    for(plant of plants){
        context.fillRect(plant.x,plant.y,cellSize,cellSize);
    }
    context.fillStyle = "rgb(200,0,0)";
    for(animal of animals){
        context.fillRect(animal.x,animal.y,cellSize,cellSize);
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
}