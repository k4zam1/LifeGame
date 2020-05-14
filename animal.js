
/* Animal関連のグローバル変数 */
var animals = [];       // すべての動物が記録される変数(記録配列)
var predators = [];     // すべての捕食者が記録されている変数(記録配列)



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



// 草食動物
class Animal {
    constructor(x,y,energy,direction,genes){
        this.id = idAllocator.allocate();
        this.x = x;                         // type:num
        this.y = y;                         // type:num
        this.energy = energy;               // type:num
        this.dir = direction;               // type:num
        this.genes = genes;                 // type:array
        this.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
        this.reproduction_interval = 3;     // 子孫を何日ごとに残すか
        this.color = "rgb(200,0,0)";        // 描画に利用する色
        this.type = "animal";
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
        for(var wall of walls){
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

    eat(){
        var animalPoint = new Point(this.x,this.y);
        for(var i=0;i<plants.length;i++){
            if(animalPoint.eq(plants[i])){
                this.energy += 10;
                // i番目の植物を削除して詰める
                plants.splice(i,1);
                break;
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

        var child = new Animal(this.x,this.y,energy,this.dir,genes);
        return child;
    }
}



// 捕食者
class Predator extends Animal {
    constructor(x,y,energy,direction,genes){
        super(x,y,energy,direction,genes);
        this.type = "predator";
        this.color = "rgb(0,0,200)"
        this.reproduction_interval = 20;
    }
    eat(){
        var point = new Point(this.x,this.y);
        for(var i=0;i<animals.length;i++){
            if(point.eq(animals[i])){
                this.energy += 5;
                // i番目の植物を削除して詰める
                animals.splice(i,1);
                break;
            }
        }
        // 生態系の頂点に達した生物は敵が同じ種族になる
        // 同種どうしの殺戮は、人口抑制として機能するのでpredator同士を戦わせる
        for(var i=0;i<predators.length;i++){
            if(point.eq(predators[i]) && predators[i].id != this.id){
                // this.energy += 7;
                
                // energyの高いほうが強いpredator
                if(this.energy > predators[i].energy){
                    console.log("win predator :"+this.id+"vs predator :"+predators[i].id);
                    predators.splice(i,1);
                    break;
                }
                // 負けた場合自分を消去する
                else {
                    for(var j=0;j<predators.length;j++){
                        if(predators[j].id == this.id){
                            console.log("lose predator :"+this.id+"vs predator :"+predators[j].id);
                            predators.splice(j,1);
                            break;
                        }
                    }
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

        var child = new Predator(this.x,this.y,energy,this.dir,genes);
        return child;
    }
}




/* すべての生物の状態をアップデートする */
function updateAllCreatures(){
    predators = updateCreatures(predators);
    animals = updateCreatures(animals);    
    
    //!! 新しい生物種を追加したらここにupdateを記述する
}


// 与えられた記録配列に含まれるオブジェクトをアップデートする
function updateCreatures(creatures){
    var newCreatures = []
    for(creature of creatures){
        if(creature != undefined && creature.energy > 0){
            newCreatures.push(creature);
        }
    }
    creatures = deepCopyArray(newCreatures);
    var childs = [];
    for(creature of creatures){
        creature.turn();
        creature.move();
        creature.eat();
        if(day%creature.reproduction_interval == 0){
            var child = creature.reproduce();
            if(child != null){
                childs.push(child);
            }
        }
    }
    for(child of childs){
        creatures.push(child);
    }
    return creatures;
}