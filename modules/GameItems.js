

class BreederReactor  extends GameObject {
    constructor(x,y){
        super(x,y);
        this.published = InfoManager.day;
    }
    static update(){
        // 期限が来たら壊す
        for(var BR of BreederReactor.list){
            if(InfoManager.day - BR.published >= BreederReactor.timeLimit){
                for(var i=0;i<BreederReactor.list.length;i++){
                    if(BreederReactor.list[i].id == BR.id){
                        BreederReactor.list.splice(i,0);
                        break;
                    }
                }
            }
        }
    }
}
BreederReactor.list = [];
BreederReactor.color = "rgb(240,90,240)";
BreederReactor.timeLimit = 100;

// select
var select = document.querySelector("#item");
var options = document.querySelectorAll("#item option");
select.addEventListener("change",function(){
    // 選択されたoption番号を取得
    var selectedItem = options[this.selectedIndex].value;
    switch(selectedItem){
        case "breederReactor":
            if(InfoManager.tank < 100) break;
            InfoManager.tank -= 100;

            var BR1 = new BreederReactor(50,50);
            var BR2 = new BreederReactor(50+cellSize,50);
            var BR3 = new BreederReactor(50,50+cellSize);
            var BR4 = new BreederReactor(50+cellSize,50+cellSize);
            BreederReactor.list.push(BR1);
            BreederReactor.list.push(BR2);
            BreederReactor.list.push(BR3);
            BreederReactor.list.push(BR4);
            break;
        default : break;
    }
    this.selectedIndex = 0;
});


//! すべてのオブジェクトクラスを登録しておく
var objectClasses = [Animal,Predator,Plant,Resource,BreederReactor,Wall];

// 各クラスの初期化
for(cls of objectClasses){
    if(typeof cls.init == "function"){
        cls.init();
    }
}