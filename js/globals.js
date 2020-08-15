
// グローバル変数を登録
var INFO = {}

// ゲーム基本情報
INFO.day = 0;
INFO.tank = 0;
INFO.STAGE = null;
INFO.finish = 1000;
INFO.PLAYER = "Red";
INFO.gameSpeed = 100;
INFO.remainingWalls = 50;
INFO.clickedObj = 0;
INFO.putable = true;


// 描画関連
INFO.canvas = document.getElementById("canvas");
INFO.context = INFO.canvas.getContext("2d");
INFO.bgCanvas = document.getElementById("background");
INFO.bgContext = INFO.bgCanvas.getContext("2d");
INFO.cellSize = 10;
INFO.screenIID = 0;


// マウス関連
INFO.MODE_SELECT_STAGE = -1;
INFO.MODE_INFORMATION = IDAllocator.allocate();
INFO.mouseout = false;
INFO.mousePoint = null;
INFO.mode = "information";
INFO.mouseModes = ["information","createWall","breakWall"];
INFO.modeNumber = INFO.MODE_SELECT_STAGE;

INFO.modeChanging = false;
INFO.mouseMode = INFO.mouseModes[INFO.modeNumber];
INFO.modeChangeTo = function(mode){
    INFO.modeNumber = mode;
    INFO.mouseMode = INFO.mouseModes[INFO.modeNumber];
}
INFO.onKeyDown = function(e){
    var mode_num = 3;
    INFO.modeChanging = true;
    if(e.shiftKey){
        INFO.modeChangeTo((INFO.modeNumber+1)%mode_num);
    }
    else if (e.altKey){
        INFO.modeChangeTo((INFO.modeNumber-1)%mode_num);
    }
}
