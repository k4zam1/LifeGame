// オブジェクトにIDを振ってくれるアロケーター
// クリックするオブジェクトにはこれでIDを割り振ること
class IDAllocator {
    constructor(){
        this.id = -1;
    }
    allocate(){
        this.id++;
        return this.id;
    }
}
idAllocator = new IDAllocator();


// セルに配置するクラスに継承する
class GameObject {
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;
        this.y = y;
        this.point = new Point(x,y);
        this.type = this.constructor.name;
    }

    static draw(){
        context.fillStyle = this.color;
        for(var obj of this.list){
            context.fillRect(obj.x,obj.y,cellSize,cellSize);
        }
    }
}
GameObject.color = "rgb(255,255,255)";

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

        // オブジェクトの判定
        for(var wall of Wall.list){
            if(wall.point.eq(next)){
                return;
            }
        }

        // 情報の更新
        this.x = next.x;
        this.y = next.y;
        this.energy -= 1;
    }

    turn(){
        var s = sum(this.genes);
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

    eat(edibles,energyInc=10,callback){
        var ate;
        for(var edible of edibles){
            for(var i=0;i<edible.list.length;i++){
                if(this.point.eq(edible.list[i].point) && this.id != edible.list[i].id){
                    this.energy += energyInc;
                    ate = edible.list[i].constructor.name;
                    callback(ate,edible,i);
                    break;
                }
            }
        }
    }

    reproduce(){
        if(this.energy < this.reproduction_energy){
            return null;
        }

        var energy = Math.floor(this.energy/2);
        var genes = deepCopyArray(this.genes);

        // 突然変異 -1,0,1をランダムのスロットに加算
        var slot = getRandomInt(0,7);
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,3)-1);

        var child = new this.constructor(this.x,this.y,energy,this.dir,genes);
        return child;
    }

    static update(){
        // 更新
        var newCreatures = []
        for(var creature of this.list){
            if(creature != undefined && creature.energy > 0){
                newCreatures.push(creature);
            }
        }
        this.list = deepCopyArray(newCreatures);

        // 行動
        var childs = [];
        for(var creature of this.list){
            creature.turn();
            creature.move();
            creature.eat();
            if(day%this.reproduction_interval == 0){
                var child = creature.reproduce();
                if(child != null){
                    childs.push(child);
                }
            }
        }
        for(child of childs){
            this.list.push(child);
        }
    }
}

// 動物
var tank = 0;           // 資源の総量
class Animal extends Organism {
    eat(){
        var edibles = [Plant,Resource];
        var energyInc = 10;
        var callback = function(ateClassName,objClass,index){
            objClass.list.splice(index,1);
            if(objClass == Resource) tank += 1;
        };
        super.eat(edibles,energyInc,callback);
    }
}
Animal.color = "rgb(200,0,0)";        // 描画に利用する色
Animal.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Animal.reproduction_interval = 3;     // 子孫を何日ごとに残すか

// 捕食者
class Predator extends Organism {
    eat(){
        var edibles = [Animal,Predator];
        var energyInc = 10;
        var callback = function(ateClassName,objClass,index){
            objClass.list.splice(index,1);
        };
        super.eat(edibles,energyInc,callback);
    }
}
Predator.color = "rgb(0,0,200)"         // 描画に利用する色
Predator.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 9;     // 子孫を何日ごとに残すか