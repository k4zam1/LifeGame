
// ステージの追加
/*
var STAGE = document.getElementById("stageSelect");
var stageLayout = [];   // 二次元配列を入れるための配列
STAGE.stageFile.addEventListener("change", function(e) {
    var result = e.target.files[0];

    //FileReaderのインスタンスを作成する
    var reader = new FileReader();

    //読み込んだファイルの中身を取得する
    reader.readAsText(result);

    //ファイルの中身を取得後、二次元配列でstageLayoutに代入
    reader.addEventListener("load", function() {

        // 改行を区切りとして行を要素とした配列を生成
        var tmp = reader.result.split("\n");

        // 各行ごとカンマで区切った文字列を要素とした二次元配列を生成
        for(var i=0;i<tmp.length;++i){
            stageLayout[i] = tmp[i].split(",");
        }
    })
})
*/

function createStage(){
    var CREATEFUNC = {
        0 : function(p){ },
        1 : function(p){ Wall.create(p) },
        2 : function(p){ Bug.randomSpawn(p) },
        3 : function(p){ Herbivores.randomSpawn(p) },
        4 : function(p){ Carnivore.randomSpawn(p) },
        5 : function(p){ Predator.randomSpawn(p) }
    }
    for(var i=0; i<stageLayout.length; i++){
        for(var j=0; j<stageLayout[i].length; j++){
            var blocktype = stageLayout[i][j];
            var create = CREATEFUNC[blocktype];
            if(create){
                var point = new Point(j,i);
                create(point);
            }
        }
    }
    INFO.remainingWalls = 20;
}