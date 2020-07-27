
class Map {
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.map = Array.from(new Array(height), () => new Array(width).fill(0));
        this.highlight = imaginaryPoint;
    }
    register(target){
        this.map[target.y][target.x] = target;
    }

    delete(target){
        this.map[target.y][target.x] = 0;
    }

    find(x,y){
        return this.map[y][x];
    }

    __apply(func){
        for(var h=0;h<this.height;h++){
            for(var w=0;w<this.width;w++){
                if(this.map[h][w] == 0) continue;
                func(h,w);
            }
        }
    }

    update(){
        var that = this;
        var updater = function(h,w){
            if(that.map[h][w].hasOwnMethod("update")){
                that.map[h][w].update();
            }
        };
        this.__apply(updater);
    }

    draw(){
        var that = this;
        var drawer = function(h,w){
            if(that.map[h][w].hasOwnMethod("draw")){
                var p = new Point(w,h);
                var highlight = that.highlight.eq(p) ? true : false;
                that.map[h][w].draw(highlight);
            }
        };
        this.__apply(drawer);
    }
    
    getBlankPoint(x,y){
        for(var i=-1;i<1;i++){
            for(var j=-1;j<1;j++){
                var px = x+i%MAP.width;
                var py = y+j%MAP.height;
                if(px < 0) px += MAP.width;
                if(py < 0) py += MAP.height;
                var found = this.find(px,py);
                if(!found){
                    return new Point(px,py);
                }
            }
        }
        return 0;
    }

    getRandomArea(){
        var range = getRandomInt(0,10);
        var x = getRandomInt(0,this.width-range-1);
        var y = getRandomInt(0,this.height-range-1);
        return {x:x,y:y,range:range};
    }
}