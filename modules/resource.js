class Resource extends GameObject {
    static update(){
        var w = getRandomInt(0,widthSize/cellSize);
        var h = getRandomInt(0,heightSize/cellSize);
        var r = new Resource(w*cellSize,h*cellSize);
        Resource.list.push(r);
    }
}
Resource.list = [];
Resource.color = "rgb(250,165,0)";