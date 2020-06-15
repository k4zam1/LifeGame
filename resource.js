
resources = []; // すべての資源が記録される変数

class Resource {
    constructor(x,y){
        this.id = idAllocator.allocate();
        this.x = x;                         // type:num
        this.y = y;                         // type:num
        this.point = new Point(x,y);
        this.color = "rgb(250,165,0)";      // 描画に利用する色
        this.type = "resource";
    }
}

function add_resource(width,height,cellSize) {
    var w = getRandomInt(0,width/cellSize);
    var h = getRandomInt(0,height/cellSize);
    var r = new Resource(w*cellSize,h*cellSize);
    resources.push(r);
};