
function main(){
    menuScreenIID  = setInterval(function(){
        INFO.context.clearRect(0,0,INFO.canvas.width,INFO.canvas.height);
        gameMenu.draw();
        if(INFO.modeNumber != INFO.MODE_SELECT_STAGE){
            clearInterval(menuScreenIID);

            // itemの追加
            $.each(INFO.items,function(idx,items){
                var li = $("<button>")
                    .attr("class","el_btn")
                    .attr("value",items.type)
                    .on("click",onItemSelected)
                    .text(items.type);
                INFO.ctab.append(li);
            });
            var li = $("<button>")
                    .attr("class","el_btn")
                    .attr("value","Wall")
                    .text("Wall");
            INFO.dtab.append(li);
            INFO.canvas.dispatchEvent(new Event("stageselected"));

            // speed barの追加
            var speedBar = $("<input>")
                .attr("id","gameSpeedSlider")
                .attr("type","range")
                .attr("name","speed")
                .attr("min","0")
                .attr("max","1000")
                .attr("value",500)
                .on("input",function(){
                    INFO.gameSpeed = 1000 - this.value;
                })
            $(".el_speedBar")
                .append("S")
                .append(speedBar)
                .append("F");
            

            // インタラクションの追加
            // ①タブをクリックしたら発動
            $('.bl_tabs li').hover(function() {
                // ②タブの順番を変数に格納
                var index = $('.bl_tabs li').index(this);
                // ③クリック済みタブのデザインを設定したcssのクラスを一旦削除
                $('.bl_tabs li').removeClass('is_active');
                // ④クリックされたタブにクリック済みデザインを適用する
                $(this).addClass('is_active');
                // ⑤コンテンツを一旦非表示にし、クリックされた順番のコンテンツのみを表示
                $('.bl_tab_contents ul').removeClass('show').eq(index).addClass('show');
            });
        }
    },20);
}

function gameLoop(gameSpeed=INFO.gameSpeed){
    var finish = 1000;
    var intervalID = setInterval(function(){
        INFO.canvas.dispatchEvent(new Event("update"));
        if(INFO.day >= finish){
            clearInterval(intervalID);
            INFO.canvas.dispatchEvent(new Event("gameover"));
        }
        // 速度が変わった場合再読み込み
        if(gameSpeed != INFO.gameSpeed){
            clearInterval(intervalID);
            gameLoop(INFO.gameSpeed);
        }
    },gameSpeed);
}
