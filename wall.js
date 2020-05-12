var walls = [];       // すべての壁が記録される変数(記録配列)

class Wall{
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;
        this.y = y;
        this.type = "block";
        this.color = "rgb(0,0,0)"
    }
}

function createWall(x,y){
    var block = new Wall(x,y);
    walls.push(block);
    
    // gameRoutineに依存せず即座に描画
    context.fillStyle = this.color;
    context.fillRect(x,y,cellSize,cellSize);
}