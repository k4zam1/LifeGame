// 動物
class Animal extends Organism {
    eat(){
        var edibles = [Plant,Resource];
        var energyInc = 10;
        var callback = function(ateClassName,objClass,index){
            objClass.list.splice(index,1);
            if(objClass == Resource) tank += 1;
        };
        super.eat(edibles,energyInc,callback);
    }
}
Animal.color = "rgb(200,0,0)";        // 描画に利用する色
Animal.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Animal.reproduction_interval = 3;     // 子孫を何日ごとに残すか

// 捕食者
class Predator extends Organism {
    eat(){
        var edibles = [Animal,Predator];
        var energyInc = 10;
        var callback = function(ateClassName,objClass,index){
            objClass.list.splice(index,1);
        };
        super.eat(edibles,energyInc,callback);
    }
}
Predator.color = "rgb(0,0,200)"         // 描画に利用する色
Predator.reproduction_energy = 10;      // 子孫を残すのに必要なエネルギー
Predator.reproduction_interval = 9;     // 子孫を何日ごとに残すか