
// ATOMを使うものはここに書く
class InnerHTMLGenerator {
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
    }
    generate(){
        var text = "<p>";
        if(MAP.highlight != imaginaryPoint){
            var found = MAP.find(MAP.highlight.x,MAP.highlight.y);
        }
        for(let title in this.info){
            // clickdObjの情報があれば追加
            if(!this.info[title] && found && found[title] != undefined){
                text += title+":"+found[title]+"<br/>";
            }
            else if(this.info[title]){
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
        TEXTBOX.innerHTML = this.generate();
    }
}
var infoBox = new InnerHTMLGenerator();


// セルに配置するクラスに継承する
class GameObject {
    static color = new Color(50,50,50);
    constructor(x,y){
        this.id = IDAllocator.allocate();
        this.x = x;
        this.y = y;
        this.point = new Point(x,y);
        this.type = this.constructor.name;
    }
    draw(highlight=false){
        var offset = 80;
        var color = null;
        var style = this.constructor.color;
        if(this.type == "Carnivore"){
            color = style.makeGradation(this.energy-offset,0,0);
        }
        else if(this.type == "Herbivores"){
            color = style.makeGradation(0,this.energy-offset,0);
        }
        else if(this.type == "Bug"){
            color = style.makeGradation(0,this.energy-offset,0);
        }
        else if(this.type == "Predator"){
            color = style.makeGradation(0,0,this.energy-offset);
        }
        else{
            color = style.color;
        }
        if(highlight){
            color = "rgb(200,200,0)";
        }
        context.fillStyle = color;
        context.fillRect(this.x*cellSize+1,this.y*cellSize+1,cellSize-2,cellSize-2);
    }
}

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
            this.point.x = next.x;
            this.point.y = next.y;
            if(this.point.eq(MAP.highlight)){
                MAP.highlight = this.point;
            }
            this.x = next.x;
            this.y = next.y;
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
        // かならずMAP.register()の前に使う
        var found = MAP.find(this.x,this.y);
        if(found.constructor == Resource) InfoManager.tank += 1;
        // クリックしていたオブジェクトを消すときはhighlighをオフ
        if(MAP.highlight.eq(found.point)){
            MAP.highligh = imaginaryPoint;
        }
        this.energy += this.constructor.energyInc;
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
        if(this.energy <= 0){
            if(this.point.eq(MAP.highlight)){
                MAP.highlight = imaginaryPoint;
            }
            return;
        }
        
        this.turn();
        this.move();
        MAP.register(this);
        
        if(InfoManager.day%this.constructor.reproduction_interval == 0
             && this.energy > this.constructor.reproduction_energy){
            this.reproduce();
        }
    }
}
