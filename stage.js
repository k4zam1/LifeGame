
// ステージの追加
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

var S_WALL = 1;
var S_BUG = 2;
var S_HERBIVORES = 3;
var S_CARNIVORE = 4;
var S_PREDATOR = 5;

function createStage(){
    for(var i=0; i<stageLayout.length; i++){
        for(var j=0; j<stageLayout[i].length; j++){
            var p = new Point(j,i);

            if(stageLayout[i][j] == S_WALL){
                Wall.create(p);
            }
            else if(stageLayout[i][j] == S_BUG){
                Bug.randomSpawn(p);
            }
            else if(stageLayout[i][j] == S_HERBIVORES){
                Herbivores.randomSpawn(p);
            }
            else if(stageLayout[i][j] == S_CARNIVORE){
                Carnivore.randomSpawn(p);
            }
            else if(stageLayout[i][j] == S_PREDATOR){
                Predator.randomSpawn(p);
            }


        }
    }
    InfoManager.remainingWalls = 20;
}