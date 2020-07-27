
// ATOMを使うものはここに書く
class InnerHTMLGenerator {
    static textbox = document.getElementById("info");
    constructor(){
        this.info = {
            "day":INFO.day,
            "mode":INFO.mouseMode,
            "tank":INFO.tank,
            "remaining_walls":INFO.remainingWalls,
            "id":null,
            "type":null,
            "x":null,
            "y":null,
            "energy":null,
            "genes":null
        };
    }
    generate(){
        var text = "<p>";
        if(MAP.highlight != imaginaryPoint){
            var found = MAP.find(MAP.highlight.x,MAP.highlight.y);
        }
        for(let title in this.info){
            // clickdObjの情報があれば追加
            if(!this.info[title] && found && found[title] != undefined){
                text += title+":"+found[title]+"<br/>";
            }
            else if(this.info[title]){
                text += title+":"+this.info[title]+"<br/>"
            }
        }
        text += "</p>";
        return text;
    }
    update(){
        this.info.day = INFO.day;
        this.info.mode = INFO.mouseMode;
        this.info.tank = INFO.tank;
        this.info.remaining_walls = INFO.remainingWalls;
        this.constructor.textbox.innerHTML = this.generate();
    }
}
INFO.box = new InnerHTMLGenerator();