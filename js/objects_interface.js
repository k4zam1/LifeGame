
// セルに配置するクラスに継承する
class GameObject {
    static color = new Color(60,60,60);

    constructor(x,y){
        this.id = IDAllocator.allocate();
        this.x = x;
        this.y = y;
        this.point = new Point(x,y);
        this.type = this.constructor.name;
    }
    draw(highlight=false){
        var offset = 80;
        var style = this.constructor.color;
        var color = style.color;
        switch(this.type){
            case "Carnivore":
                color = style.makeGradation(this.energy-offset,0,0);
                break;
            case "Herbivores":
                color = style.makeGradation(0,this.energy-offset,0);
                break;
            case "Bug":
                color = style.makeGradation(0,this.energy-offset,0);
                break;
            case "Predator":
                color = style.makeGradation(0,0,this.energy-offset);
                break;
            default :
                color = style.color;
        }
        if(highlight){
            color = "rgb(200,200,0)";
        }
        INFO.context.fillStyle = color;
        INFO.context.fillRect(this.x*INFO.cellSize+1,this.y*INFO.cellSize+1,INFO.cellSize-2,INFO.cellSize-2);
    }
    hasOwnMethod(method) {
        return typeof this[method] == "function";
    }
}

class Organism extends GameObject {
    
    static color = new Color(0,0,0);
    static edibles = [];
    static energyInc = 0;
    static reproduction_energy = 100;
    static reproduction_interval = 1;

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
        if(found != 0 && this.constructor.edibles.includes(found.type)){
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
        if(found.constructor == Resource) INFO.tank += 1;
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
        
        if(INFO.day%this.constructor.reproduction_interval == 0
             && this.energy > this.constructor.reproduction_energy){
            this.reproduce();
        }
    }
}
