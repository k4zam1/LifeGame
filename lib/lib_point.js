
class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    eq(point){
        if(this.x == point.x && this.y == point.y) return true;
        return false;
    }
    set(x,y){
        this.x = x;
        this.y = y;
    }

    static getRandomWidth(){
        return getRandomInt(0,MAP.width-1);
    }

    static getRandomHeight(){
        return getRandomInt(0,MAP.height-1);
    }

    static getRandomPoint(area=false){
        if(!area){
            var w = this.getRandomWidth();
            var h = this.getRandomHeight();
            var p = new Point(w,h);
            return p;
        }
        var w = getRandomInt(area.x,area.x+area.range);
        var h = getRandomInt(area.y,area.y+area.range);
        var p = new Point(w,h);
        return p;
    }
}
var imaginaryPoint = new Point(-1,-1);