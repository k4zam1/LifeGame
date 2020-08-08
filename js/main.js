
function main(){
    menuScreenIID  = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
        gameMenu.draw();

        // ステージが選択されたあとの処理
        if(INFO.modeNumber != INFO.MODE_SELECT_STAGE){
            clearInterval(menuScreenIID);
            try {
                // 配信サーバーからステージを取得
                STAGE_FILE_URL = "http://localhost:9000/api?query={}".format(INFO.STAGE);
                d3.csv(STAGE_FILE_URL,function(error,stage){
                    if(error){
                        console.warn(error);
                    }
                    var CREATEFUNC = {
                        0 : function(p){ },
                        1 : function(p){ Wall.create(p) },
                        2 : function(p){ Bug.randomSpawn(p) },
                        3 : function(p){ Herbivores.randomSpawn(p) },
                        4 : function(p){ Red.randomSpawn(p) },
                        5 : function(p){ Blue.randomSpawn(p) }
                    }
                    for(var i=0; i<MAP.height; i++){
                        for(var j=0; j<MAP.width; j++){
                            var blocktype = stage[i][j];
                            var create = CREATEFUNC[blocktype];
                            if(create){
                                var point = new Point(j,i);
                                create(point);
                            }
                        }
                    }
                    Wall.soundon = true;
                    INFO.remainingWalls = 150;
                });
                gameLoop();
            }
            catch(e){
                console.error(e);
                return;
            }
        }
    },20);

}


function gameLoop(gameSpeed=INFO.gameSpeed){
    var finish = 1000;

    // 以下の内容をループする
    INFO.screenIID = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);

        // 各情報を更新して再描画する
        INFO.day += 1;
        Plant.add();
        Resource.add();
        MAP.update();
        INFO.box.update();

        MAP.draw();

        // ゲーム終了
        if(INFO.day >= finish){
            var na = 0;
            var np = 0;
            for(var h=0;h<MAP.height;h++){
                for(var w=0;w<MAP.width;w++){
                    if(MAP.map[h][w] == 0) continue;
                    if(MAP.map[h][w].type == "Red") na++;
                    if(MAP.map[h][w].type == "Blue") np++;
                }
            }
            var text = (na >= np) ? "YOU WIN" : "YOU LOSE";
            INFO.context.font = "48px serif";
            INFO.context.fillStyle = 'rgb(255,255,0)';
            INFO.context.fillText(text,INFO.canvas.height/2,INFO.canvas.width/2-50);
            clearInterval(INFO.screenIID);
        }

        // 速度が変わった場合再読み込み
        if(gameSpeed != INFO.gameSpeed){
            clearInterval(INFO.screenIID);
            gameLoop(INFO.gameSpeed);
        }
    },gameSpeed);
}