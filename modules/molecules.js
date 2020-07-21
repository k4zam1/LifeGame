
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
    
    static draw(style,obj){
        var offset = 100;
        var color = null;
        if(obj.type == "Animal"){
            color = style.makeGradation(obj.energy-offset,0,0);
        }
        else if(obj.type == "Predator"){
            color = style.makeGradation(0,0,obj.energy-offset);
        }
        else{
            color = style.color;
        }
        this.gameScreen.fillStyle = color;
        this.gameScreen.fillRect(obj.x*cellSize+1,obj.y*cellSize+1,cellSize-2,cellSize-2);
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
    draw(){
        ScreenManager.draw(this.constructor.color,this);
    }
}
GameObject.color = new Color(0,0,0);

class Organism extends GameObject {
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
            next.x += 1;
        }
        else if(this.dir == 1 || this.dir == 5){
            next.x += 0;
        }
        else {
            next.x -= 1;
        }

        // yについての移動,cellSizeを単位とする
        if(0 <= this.dir && this.dir < 3){
            next.y -= 1;
        }
        else if(4 <= this.dir && this.dir < 7){
            next.y += 1;
        }

        // 端移動の処理
        next.x = next.x % MAP.width;
        next.y = next.y % MAP.height;
        if(next.x < 0){
            next.x += MAP.width;
        }
        if(next.y < 0){
            next.y += MAP.height;
        }

        // 障害物の判定
        var found = MAP.find(next.x,next.y);
        var movable = false;
        var eatable = false;

        if(found == 0){
            movable = true;
        }
        if(found != 0 && this.constructor.edibles.includes(found.constructor)){
            movable = true;
            eatable = true;
        }
        if(movable){
            this.x = next.x;
            this.y = next.y;
            this.point.x = next.x;
            this.point.y = next.y;
            this.energy -= 1;
        }
        if(eatable){
            this.eat();
        }
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

    eat(){
        var found = MAP.find(this.x,this.y);
        
        this.energy += this.constructor.energyInc;
        if(found.constructor == Resource) InfoManager.tank += 1;
        // クリックしていたオブジェクトを消すときはclickedObjをnullに戻す
        if(InfoManager.clickedObj != 0 && InfoManager.clickedObj == found){
            InfoManager.clickedObj = 0;
        }
        MAP.delete(found);
    }

    reproduce(){
        var energy = Math.floor(this.energy/2);
        var genes = Array.from(this.genes);
        var slot = getRandomInt(0,7);
        // 突然変異 -1,0,1をランダムのスロットに加算
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,3)-1);

        var p = MAP.getBlankPoint(this.x,this.y);
        if(typeof p == "object"){
            var child = new this.constructor(p.x,p.y,energy,this.dir,genes);
            MAP.register(child);
        }
    }


    static randomSpawn(sp){
        var geneLength = 8;
        var genes = new Array(geneLength).fill(0).map(x => x + getRandomInt(0,1));
        var energy = getRandomInt(100,200);
        var dir = getRandomInt(0,7);
        var newOrganism = new this(sp.x,sp.y,energy,dir,genes);
        MAP.register(newOrganism);
    }

    update(){
        MAP.delete(this);
        if(this.energy <= 0) return;
        
        this.turn();
        this.move();
        MAP.register(this);
        
        if(InfoManager.day%this.constructor.reproduction_interval == 0
             && this.energy > this.constructor.reproduction_energy){
            this.reproduce();
        }
    }
}

