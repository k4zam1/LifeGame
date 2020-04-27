var animals = [];

class Animal {
    constructor(x,y,energy,direction,genes){
        // num
        this.x = x;
        this.y = y;
        this.energy = energy;
        this.dir = direction;

        // array
        this.genes = genes;
    }

    move(){
        // xについての移動
        if(2 <= this.dir && this.dir < 5){
            this.x += 5;
        }
        else if(this.dir == 1 || this.dir == 5){
            this.x += 0;
        }
        else {
            this.x -= 5;
        }

        // yについての移動
        if(0 <= this.dir && this.dir < 3){
            this.y -= 5;
        }
        else if(4 <= this.dir && this.dir < 7){
            this.y += 5;
        }

        this.x = this.x % (canvas.width-1);
        this.y = this.y % canvas.height;
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

    //todo: eat

    reproduce(){
        if(this.energy < this.reproduction_energy){
            return;
        }

        var energy = Math.floor(this.energy/2);
        var genes = Object.create(this.genes);

        // 突然変異 -1,0,1をランダムのスロットに加算
        var slot = getRandomInt(0,7);
        genes[slot] = Math.max(0,genes[slot]+getRandomInt(0,2)-1);

        var child = new Animal(this.x,this.y,energy,this.dir,genes);
        return child;
    }
}
