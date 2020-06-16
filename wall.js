var wall_count = 20;    // キャンパス内に存在できる壁の数
var remainingWalls = wall_count;

class Wall extends GameObject {}
Wall.list = [];
Wall.color = "rgb(0,0,0)"

function createWall(x,y){
    var block = new Wall(x,y);
    Wall.list.push(block);
    
    if(Wall.list.length > wall_count){
        Wall.list.shift();
    }
    
    remainingWalls = wall_count - Wall.list.length;
    
    // gameRoutineに依存せず即座に描画
    context.fillStyle = this.color;
    context.fillRect(x,y,cellSize,cellSize);
}