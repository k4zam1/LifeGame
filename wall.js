var walls = [];         // すべての壁が記録される変数(記録配列)
var wall_count = 20;    // キャンパス内に存在できる壁の数
var remainingWalls = wall_count;

class Wall{
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;
        this.y = y;
        this.type = "block";
        this.color = "rgb(0,0,0)"
        this.point = new Point(x,y);
    }
}

function createWall(x,y){
    var block = new Wall(x,y);
    walls.push(block);
    
    if(walls.length > wall_count){
        walls.shift();
    }
    
    remainingWalls = wall_count - walls.length;
    
    // gameRoutineに依存せず即座に描画
    context.fillStyle = this.color;
    context.fillRect(x,y,cellSize,cellSize);
}