
class Color {
    constructor(r,g,b){
        this.set(r,g,b);
    }
    set(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
        this.color = "rgb({},{},{})".format(this.r,this.g,this.b);
    }
}
INFO.highlight = new Color(200,200,0);