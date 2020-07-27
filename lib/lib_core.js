
// "{}".format
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// ランダムな整数を返す
var getRandomInt = function(min,max){ return Math.floor(Math.random()*(max+1-min))+min; }


class IDAllocator {
    static id = -1;
    static allocate(){
        IDAllocator.id++;
        return IDAllocator.id;
    }
}