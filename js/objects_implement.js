
/*---------------------------------------------------------------------------------------*
 *  Item :: Wall,Reactor
 *---------------------------------------------------------------------------------------*/
class Wall extends Item {
    static cost = 1;
    static period = INFO.finish+1;
    static size = "1x1";
    static soundon = false;

    static create(p){
        var success = super.create(p);
        if(success){
            INFO.remainingWalls--;
            if(Wall.soundon){
                var snd = new Audio("sound/se_wall.mp3");
                snd.play();
            }
        }
    }
    static delete(p){
        var success = super.delete.call(this,p);
        if(success){
            INFO.remainingWalls++;
            if(Wall.soundon){
                var snd = new Audio("sound/se_wall_delete.mp3");
                snd.play();
            }
        }
    }
    static isLimit(){
        return (INFO.remainingWalls < 1);
    }

    // mouse modeがWallのもののとき
    static onMouseOver(){
        this.highlight();
    }

    static onMouseMove(){
        this.updatePutable();
        var reverse  = (INFO.modeNumber == INFO.MODE_DELETE_WALL);
        INFO.putable = (reverse) ? !INFO.putable : INFO.putable;
        this.highlight();
    }

    static onMouseDown(){
        var IID = setInterval(function(){
            // 以下終了判定
            // つくれる壁が上限になった
            if(INFO.modeNumber == INFO.MODE_CREATE_WALL && Wall.isLimit()){
                return;
            }
            // クリックを終えた
            INFO.canvas.onmouseup = function(e){
                if(e.button == 0) clearInterval(IID);
            }
            // カーソルが外に出た || Modeが変更された
            if(INFO.mouseout || INFO.modeChanging){
                clearInterval(IID);
                INFO.modeChanging = (INFO.modeChanging) ? false : true;   
            }


            // 以下ondown時の処理
            if(INFO.modeNumber == INFO.MODE_CREATE_WALL){
                Wall.create(INFO.mousePoint);
            }
            else {
                Wall.delete(INFO.mousePoint);
            }
        },20);
    }
}

class BreederReactor  extends Item {
    static cost = 100;
    static period = 100;
    static size = "2x2";
    static color = new Color(240,90,240);

    constructor(x,y){
        super(x,y);
        this.published = INFO.day;
    }
    
    // mouse modeがBreederReactorのもののとき
    static onMouseMove(){
        this.updatePutable();
        this.highlight();
    }
    static onMouseOver(){
        this.highlight();
    }
    static onMouseDown(){
        if(INFO.tank < 30 || !INFO.putable) return;
        INFO.tank -= 30;
        
        var x = INFO.mousePoint.x;
        var y = INFO.mousePoint.y;
        for(var i=0;i<2;i++){
            for(var j=0;j<2;j++){
                var BR = new BreederReactor(x+i,y+j);
                MAP.register(BR);
            }
        }
        var snd = new Audio("sound/se_reactor.mp3");
        snd.play();
        INFO.modeChangeTo(INFO.MODE_INFORMATION);
        INFO.bgContext.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
    }

    // non static method
    update(){
        super.update();
        var sp = MAP.getBlankPoint(this.x,this.y);
        if(sp){
            Red.randomSpawn(sp);
        }
    }
}
INFO.items = [Wall,BreederReactor];


/*---------------------------------------------------------------------------------------*
 *  Spontaneous :: Resource,Plant
 *---------------------------------------------------------------------------------------*/
class Resource extends Spontaneous {
    static color = new Color(250,250,0);
}
class Plant extends Spontaneous {
    static color = new Color(0,200,0);
    static areas_num = 10;
    static areas = Array.from(new Array(this.areas_num), () => MAP.getRandomArea());
    static add(){
        for(var area of this.areas){
            super.add(area);
        }
    }
}

/*---------------------------------------------------------------------------------------*
 *  Organism :: Red,Blue
 *---------------------------------------------------------------------------------------*/
class Red extends Organism {
    static color = new Color(250,50,50);
}
class Blue extends Red {
    static color = new Color(50,50,250);
}