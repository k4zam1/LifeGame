
/* Animal関連のグローバル変数 */
var animals = [];               // すべての動物が記録される変数
var reproduction_energy = 10;   // 子孫を残すのに必要なエネルギー
var reproduction_interval = 3;  // 子孫を何日ごとに残すか
var id = 0;

class Animal {
    constructor(x,y,energy,direction,genes){
        this.id = id;
        id++;
        
        // type:num
        this.x = x;
        this.y = y;

        this.energy = energy;
        this.dir = direction;

        // type:array
        this.genes = genes;
    }

    move(){
        // xについての移動,cellSizeを単位とする
        if(2 <= this.dir && this.dir < 5){
            this.x += cellSize;
        }
        else if(this.dir == 1 || this.dir == 5){
            this.x += 0;
        }
        else {
            this.x -= cellSize;
        }

        // yについての移動,cellSizeを単位とする
        if(0 <= this.dir && this.dir < 3){
            this.y -= cellSize;
        }
        else if(4 <= this.dir && this.dir < 7){
            this.y += cellSize;
        }

        this.x = this.x % canvas.width;
        this.y = this.y % canvas.height;
        if(this.x < 0){
            this.x += canvas.width;
        }
        if(this.y < 0){
            this.y += canvas.height;
        }
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

    // todo:位置バグ修正
    eat(){
        var animalPoint = new Point(this.x,this.y);
        for(var i=0;i<plants.length;i++){
            if(animalPoint.eq(plants[i])){
                this.energy += 2;
                // i番目の植物を削除して詰める
                plants.splice(i,i);
                break;
            }
        }
    }

    reproduce(){
        if(this.energy < reproduction_energy){
            return null;
        }

        var energy = Math.floor(this.energy/2);
        var genes = deepCopyArray(this.genes);

        // 突然変異 -1,0,1をランダムのスロットに加算
        var slot = getRandomInt(0,7);
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,2)-1);

        var child = new Animal(this.x,this.y,energy,this.dir,genes);
        return child;
    }
}

// todo: 種族の作成


/* すべての動物の状態をアップデートする */
function updateAnimals(){
    var newAnimals = []
    for(animal of animals){
        if(animal instanceof Animal && animal.energy > 0){
            newAnimals.push(animal);
        }
    }
    animals = deepCopyArray(newAnimals);
    
    var childs = [];
    for(animal of animals){
        animal.turn();
        animal.move();
        animal.eat();
        if(day%reproduction_interval == 0){
            var child = animal.reproduce();
            if(child != null){
                childs.push(child);
            }
        }
    }
    for(child of childs){
        animals.push(child);
    }
}

function inAnimals(point){
    for(animal of animals){
        var animalPoint = new Point(animal.x,animal.y);
        if(animalPoint.eq(point)){
            return animal.id;
        }
    }
    return null;
}