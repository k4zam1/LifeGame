// animal,plant共通メソッド
function sum(arr){
    var s = 0;
    arr.forEach(function(elm){
        s += elm;
    });
    return s;
}

function getRandomInt(min,max){
    var rand = Math.floor(Math.random()*(max+1-min))+min;
    return rand;
}

function deepCopyArray(sourceArray){
    var newArray = [];
    for(s of sourceArray){
        newArray.push(s);
    }
    return newArray;
}


export class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    eq(point){
        if(this.x == point.x && this.y == point.y){
            return true;
        }
        return false;
    }
    set(x,y){
        this.x = x;
        this.y = y;
    }
}