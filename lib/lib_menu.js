class Menu {
    constructor(x,y,w,h,row,col){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.row = row;
        this.col = col;
        this.over = -1;
        this.yoffset = 10;
        this.xoffset = 10;

        // font settings
        this.font = "18px serif";
        this.fontWide = 40;
        this.fontHigh = 10;
        this.fontcolor = "rgb(250,250,250)";

        // menu box settings
        this.menuboxcolor = "rgb(50,50,50)";
        this.highlightbox = "rgb(80,80,80)";
    }

    draw(){
        var index = 0;
        for(var row=0;row<this.row;row++){
            for(var col=0;col<this.col;col++){
                // draw menu box
                if(this.over == index){
                    INFO.context.fillStyle = this.highlightbox;
                }
                else {
                    INFO.context.fillStyle = this.menuboxcolor;
                }
                INFO.context.fillRect(
                    this.x+(this.w*col)+col*this.xoffset,
                    this.y+(this.h*row)+row*this.yoffset,
                    this.w,
                    this.h);
                // draw text
                INFO.context.fillStyle = this.fontcolor;
                INFO.context.font = this.font;
                INFO.context.fillText("STAGE"+zeroPadding(index,2),
                    this.x+(this.w*col)+col*this.xoffset + (this.w/2-this.fontWide),
                    this.y+(this.h*row)+row*this.yoffset + (this.h/2+this.fontHigh));
                
                index++;
            }
        }
    }

    inMenu(mouse,row,col){
        if(mouse == null) return;

        // for debug
        /*
        console.log(mouse);
        console.log("this.x:",this.x);
        console.log("this.y:",this.y);
        console.log("this.w:",this.w);
        console.log("this.h:",this.h);
        console.log("mouse.x:",mouse.x);
        console.log("mouse.y:",mouse.y);
        console.log("row:",row);
        console.log("col:",col);
        console.log((mouse.x*INFO.cellSize > rx) &&
                    (mouse.x*INFO.cellSize < rx+this.w) &&
                    (mouse.y*INFO.cellSize > ry) &&
                    (mouse.y*INFO.cellSize < ry+this.h));
        */

        var rx = this.x+(this.w*col)+col*this.xoffset;
        var ry = this.y+(this.h*row)+row*this.yoffset;

        return (mouse.x*INFO.cellSize > rx) &&
                (mouse.x*INFO.cellSize < rx+this.w) &&
                (mouse.y*INFO.cellSize > ry) &&
                (mouse.y*INFO.cellSize < ry+this.h);
    }

    setHighlight(mouse){
        var index = 0;
        for(var row=0;row<this.row;row++){
            for(var col=0;col<this.col;col++){
                if(this.inMenu(mouse,row,col) && this.over != index){
                    this.over = index;
                    break;
                }
                index++;
            }
        }
    }
    
    getover(){
        return this.over;
    }
}
var gameMenu = new Menu(30,30,100,100,3,5);