
/*---------------------------------------------------------------------------------------*
 *  Item :: Wall,Reactor
 *---------------------------------------------------------------------------------------*/
/*
    ItemオブジェクトにはonEventメソッドがある
    Itemオブジェクトにはcreate,deleteの2つのモードがあり,
    onEventメソッドの内部で分岐するように実装する
*/
class Wall extends Item {
    static cost = 1;
    static period = INFO.finish+1;
    static size = "1x1";
    static soundon = false;
    static create_mode = IDAllocator.allocate();
    static delete_mode = IDAllocator.allocate();

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
    static onMouseMove(){
        this.updatePutable();
        var reverse  = (INFO.modeNumber == Wall.delete_mode);
        INFO.putable = (reverse) ? !INFO.putable : INFO.putable;

        this.highlight();
    }

    static onMouseDown(){
        var IID = setInterval(function(){
            // 以下終了判定
            // つくれる壁が上限になった
            if(INFO.modeNumber == Wall.create_mode && Wall.isLimit()){
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
            if(INFO.modeNumber == Wall.create_mode){
                Wall.create(INFO.mousePoint);
            }
            else if(INFO.modeNumber == Wall.delete_mode){
                Wall.delete(INFO.mousePoint);
            }
        },20);
    }
}

class BreederReactor  extends Item {
    static cost = 30;
    static period = 100;
    static size = "2x2";
    static color = new Color(240,90,240);
    static create_mode = IDAllocator.allocate();
    static delete_mode = null;
    static type = "BreederReactor";
    
    constructor(x,y){
        super(x,y);
        this.published = INFO.day;
    }
    
    // BRはcreateのみ
    // mouse modeがBreederReactorのもののとき
    static onMouseMove(){
        this.updatePutable();
        this.highlight();
    }
    static onMouseOver(){
        this.highlight();
    }
    static onMouseDown(){
        if(INFO.tank < this.cost || !INFO.putable) return;
        INFO.tank -= this.cost;
        
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
// Item追加時に変更しなければいけないところ
INFO.items = [Wall,BreederReactor];
INFO.items.__callEvent = function(callback){
    for(var item of INFO.items){
        if(INFO.modeNumber == item.create_mode || INFO.modeNumber == item.delete_mode){
            try {
                callback(item);
            }
            catch(e){
                console.error(e.name);
                return;
            }
        }
    }
}
INFO.items.onMouseDown = function(){
    INFO.items.__callEvent(function(item){ item.onMouseDown(); });
}
INFO.items.onMouseOver = function(){
    INFO.items.__callEvent(function(item){ item.onMouseOver(); });
}
INFO.items.onMouseMove = function(){
    INFO.items.__callEvent(function(item){ item.onMouseMove(); });
}
INFO.items.setCreateMode = function(selectedItem){
    for(var item of INFO.items){
        if(item.type == selectedItem){
            INFO.modeChangeTo(item.create_mode);
        }
    }
}
INFO.items.eventHandler = function(e){
    switch(e.type){
    case "mousedown":
        INFO.items.onMouseDown();
        break;
    case "mouseover":
        INFO.items.onMouseOver();
        break;
    case "mousemove":
        INFO.items.onMouseMove();
        break;
    }
}

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
class Eater extends Organism {
    static color = new Color(50,250,50);
    constructor(x,y,energy,direction,genes,edibles=[]){
        super(x,y,energy,direction,genes);
        this.constructor.edibles = edibles;
    }
}