
// ATOMを使うものはここに書く
class InnerHTMLGenerator {
    // use : InfoManager
    constructor(){
        this.info = {
            "day":InfoManager.day,
            "mode":InfoManager.mode,
            "tank":InfoManager.tank,
            "remaining_walls":InfoManager.remainingWalls,
            "id":null,
            "type":null,
            "x":null,
            "y":null,
            "energy":null,
            "genes":null
        };
        this.clickedObj = InfoManager.clickedObj;
    }
    generate(){
        var text = "<p>";
        for(let title in this.info){
            // clickdObjの情報があれば追加
            if(this.info[title] == null && this.clickedObj != null){
                if(this.clickedObj[title] != undefined) text += title+":"+this.clickedObj[title]+"<br/>";
            }
            else if(this.info[title] != null){
                text += title+":"+this.info[title]+"<br/>"
            }
        }
        text += "</p>";
        return text;
    }
    update(){
        this.info.day = InfoManager.day;
        this.info.mode = InfoManager.mode;
        this.info.tank = InfoManager.tank;
        this.info.remaining_walls = InfoManager.remainingWalls;
        this.clickedObj = InfoManager.clickedObj;
    }
}
var innerHTMLGenerator = new InnerHTMLGenerator();

class ScreenManager {
    // use : InfoManager
    static drawBackground(){
        var m = Math.max(canvas.width,canvas.height);
        this.background.strokeStyle ="rgb(0,0,0)";
        this.background.beginPath();
        for(var i=0;i<=m;i+=cellSize){
            // 横線
            this.background.moveTo(i,0);
            this.background.lineTo(i,canvas.height);
            // 縦線
            this.background.moveTo(0,i);
            this.background.lineTo(canvas.width,i);
        }
        this.background.closePath();
        this.background.stroke();
    }

    static showFinishScreen(winner){
        var text = (InfoManager.player == winner) ? "YOU WIN" : "YOU LOSE";
        context.font = "48px serif";
        context.fillStyle = 'rgb(255,255,0)';
        context.fillText(text,canvas.height/2,canvas.width/2);
    }

    static clear(){
        this.gameScreen.clearRect(0,0,canvas.width,canvas.height);
    }
    
    static draw(fillStyle,obj){
        this.gameScreen.fillStyle = fillStyle;
        this.gameScreen.fillRect(obj.x+1,obj.y+1,cellSize-2,cellSize-2);
    }
}
ScreenManager.gameScreen = context;
ScreenManager.background = bgContext;



// セルに配置するクラスに継承する
class GameObject {
    // use : Point
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;
        this.y = y;
        this.point = new Point(x,y);
        this.type = this.constructor.name;
    }

    static draw(){
        this.list.forEach(obj =>  ScreenManager.draw(this.color,obj));
    }
}
GameObject.list = [];
GameObject.color = "rgb(0,0,0)";

class Organism extends GameObject {
    // use : Point,InfoManager
    constructor(x,y,energy,direction,genes){
        super(x,y);
        this.energy = energy;               // type:num
        this.dir = direction;               // type:num
        this.genes = genes;                 // type:array
    }

    move(){
        var next = new Point(this.x,this.y);

        // xについての移動,cellSizeを単位とする
        if(2 <= this.dir && this.dir < 5){
            next.x += cellSize;
        }
        else if(this.dir == 1 || this.dir == 5){
            next.x += 0;
        }
        else {
            next.x -= cellSize;
        }

        // yについての移動,cellSizeを単位とする
        if(0 <= this.dir && this.dir < 3){
            next.y -= cellSize;
        }
        else if(4 <= this.dir && this.dir < 7){
            next.y += cellSize;
        }

        // 端移動の処理
        next.x = next.x % canvas.width;
        next.y = next.y % canvas.height;
        if(next.x < 0){
            next.x += canvas.width;
        }
        if(next.y < 0){
            next.y += canvas.height;
        }

        // 障害物の判定
        for(var obstacle of InfoManager.obstacles){
            var found = obstacle.list.findIndex(obs => obs.point.eq(next));
            if(found != -1) return;
        }

        // 情報の更新
        this.x = next.x;
        this.y = next.y;
        this.point.x = next.x;
        this.point.y = next.y;
        this.energy -= 1;
    }

    turn(){
        var s = this.genes.reduce((accumulator, currentValue) => accumulator + currentValue);
        var r = getRandomInt(0,s);

        var i = 0;
        for(var gene of this.genes){
            r -= gene;
            if(r <= 0){
                this.dir = i;
                break;
            }
            i++;
        }
    }

    eat(edibles,energyInc=10){
        for(var edible of edibles){
            // 食べられるリストから自分と同じポイントの個体を探す
            var found = edible.list.findIndex(element => this.point.eq(element));
            // いなかった || 自分自身だった
            if(found == -1 || this.id == edible.list[found].id) continue;
            // energyを増やす
            this.energy += energyInc;
            // クリックしていたオブジェクトを消すときはclickedObjをnullに戻す
            if(InfoManager.clickedObj != null && InfoManager.clickedObj.id == edible.list[found].id) InfoManager.clickedObj = null;
            // オブジェクトがResourceならタンクを増やす
            if(edible == Resource) InfoManager.tank += 1;
            edible.list.splice(found,1);
            break;
        }
    }

    reproduce(){
        if(this.energy < this.reproduction_energy) return null;

        var energy = Math.floor(this.energy/2);
        var genes = Array.from(this.genes);
        var slot = getRandomInt(0,7);
        // 突然変異 -1,0,1をランダムのスロットに加算
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,3)-1);

        var child = new this.constructor(this.x,this.y,energy,this.dir,genes);
        return child;
    }


    static randomProduce(respawn){
        var geneLength = 8;
        var genes = new Array(geneLength).fill(0).map(x => x + getRandomInt(0,1));
        var energy = getRandomInt(100,200);
        var dir = getRandomInt(0,7);
        var newOrganism = new this(respawn.x,respawn.y,energy,dir,genes);
        return newOrganism;
    }
/*
    static init(){
        var adam = this.randomProduce();
        this.list.push(adam);
    }
*/
    static update(){
        this.list = this.list.filter(creature => creature.energy > 0);

        // 行動
        var childs = [];
        for(var creature of this.list){
            creature.turn();
            creature.move();
            creature.eat();
            if(InfoManager.day%this.reproduction_interval == 0){
                var child = creature.reproduce();
                if(child != null) childs.push(child);
            }
        }
        childs.forEach(child => this.list.push(child));
    }
}

