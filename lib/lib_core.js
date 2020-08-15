
// "{}".format
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// zeroPadding(1,3) -> 001
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

// ランダムな整数を返す
var getRandomInt = function(min,max){ return Math.floor(Math.random()*(max+1-min))+min; }


class IDAllocator {
    static id = -1;
    static allocate(){
        IDAllocator.id++;
        return IDAllocator.id;
    }
}

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = (message || "");
}
NotImplementedError.prototype = Error.prototype;