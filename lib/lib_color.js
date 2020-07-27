
class Color {
    constructor(r,g,b){
        this.set(r,g,b);
    }
    __makeRGB(){
        return "rgb({},{},{})".format(this.r,this.g,this.b);
    }
    set(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
        this.color = this.__makeRGB();
    }
    makeGradation(r,g,b){
        var tr = this.r + r;
        var tg = this.g + g;
        var tb = this.b + b;
        return "rgb({},{},{})".format(tr,tg,tb);
    }
}