/**
 * Created by zdy on 2017/1/18.
 */
var size=0;
var avatar_canvas=document.getElementById("avatar_canvas");
avatar_ctx=avatar_canvas.getContext("2d");
var mx=0;//水平移动
var my=0;//垂直移动
var r=0;//旋转次数
var p1={},p2={};
var zrate=1;//上次缩放倍率
var dis=10;//微移的距离
var moveSign=true;
$("#avatar_file").on("change",function () {
    var avatar_file =document.getElementById("avatar_file");
    var file=avatar_file.files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("请选择图片！");
        return false;
    }
    var reader = new FileReader();
    //将文件以Data URL形式读入页面
    reader.readAsDataURL(file);
    reader.onload=function() {
        var result = document.getElementById("result");
        //显示文件
        result.innerHTML = '<img src="' + this.result + '" alt="" id="img"/>';
        var img =document.getElementById("img");
        img.onload=function(){
            //console.log("载入中(^_^)");
            size=800;
            avatar_canvas.width=size;
            avatar_canvas.height=size;
            avatar_ctx.translate(size/2,size/2);
            $("#avatar_canvas").show();
            reset();
            $("#base_tools").show();
            addEvent();
        };
    }
});
/*绘制*/
function draw(){
    clr();
    var w=img.width;
    var h=img.height;
    w>=h?avatar_ctx.drawImage(img,mx-size*w/h/2,-size/2+my,size*w/h,size):avatar_ctx.drawImage(img,-size/2+mx,my-size*h/w/2,size,size *h/w);
    //console.log("draw");
}
/*清空画布*/
function clr(){
    avatar_ctx.save();
    avatar_ctx.setTransform(1,0,0,1,0,0);
    avatar_ctx.clearRect(0,0,size,size);
    avatar_ctx.restore();
}
/*拖动*/
function move(x,y){//右,下
    if(r%4==0){
        mx+=x;
        my+=y;
    }
    if(r%4==1||r%4==-3){
        my-=x;
        mx+=y;
    }
    if(r%4==2||r%4==-2){
        mx-=x;
        my-=y;
    }
    if(r%4==3||r%4==-1){
        my+=x;
        mx-=y;
    }
    draw();
}
/*旋转*/
function rotate(rs){
    if (rs==0){
        r+=1;
        avatar_ctx.rotate(90*Math.PI/180);
    }
    if (rs==1){
        r-=1;
        avatar_ctx.rotate(-90*Math.PI/180);
    }
    draw();
}
/*缩放*/
function scale(x,y){
    avatar_ctx.scale(x,y);
    //console.log(x+","+y);
    draw();
}
/*重置画布并重绘*/
function reset() {
    avatar_ctx.setTransform(1,0,0,1,size/2,size/2);
    mx=0;
    my=0;
    r=0;
    zrate=1;
    $("#avatar_zoom").val(25);
    draw();
}
/*
function p(e){
    e.preventDefault();
    var zoom=e.wheelDelta?e.wheelDelta:e.detail;
    var rate=Math.pow(1.001,zoom);
    scale(rate,rate);
}*/

function addEvent(){
    /*画布拖动事件绑定*/
    $("#avatar_canvas").on("touchstart",function(e) {
        p1.x=e.touches[0].pageX;
        p1.y=e.touches[0].pageY;
        e.touches[1]&&(p2.x=e.touches[1].pageX);
        e.touches[1]&&(p2.y=e.touches[1].pageY);
        (e.touches.length==1)&&(moveSign=true);
        (e.touches.length==2)&&(moveSign=false);
        e.preventDefault();
    }).on("touchmove",function (e) {
        var t1={},t2={};
        t1.x=p1.x;
        t1.y=p1.y;
        p2.x&&(t2.x=p2.x);
        p2.y&&(t2.y=p2.y);
        p1.x=e.touches[0].pageX;
        p1.y=e.touches[0].pageY;
        e.touches[1]&&(p2.x=e.touches[1].pageX);
        e.touches[1]&&(p2.y=e.touches[1].pageY);
        (e.touches.length==1)&&moveSign&&move(p1.x-t1.x,p1.y-t1.y);
        var r;
        var point2=Math.pow((p2.y-p1.y),2)+ Math.pow((p2.x-p1.x),2);
        var temp2=Math.pow((t2.y-t1.y),2)+ Math.pow((t2.x-t1.x),2);
        t2.x&&(r=Math.sqrt(point2/temp2));
        r&&(e.touches.length==2)&&scale(r,r);
        e.preventDefault();
    }).on("touchend",function(e) {

    }).on("touchcancel",function () {

    });
    /*缩放*/
    $("#avatar_zoom").on("input change",function () {
        var zoom=$(this).val()*1/50+0.5;
        scale(zoom/zrate,zoom/zrate);
        zrate=zoom;
    });
    /*旋转 逆时针，顺时针*/
    $("#avatar_spin_anticlockwise").on("click",function () {
        rotate(1);
    });
    $("#avatar_spin_clockwise").on("click",function(){
        rotate(0);
    });
    /*重置*/
    $("#avatar_reset").on("click",function () {
        reset();
    }).hover(function () {
        $(this).tooltip("toggle");
    });
    /*微 移动*/
    $("#avatar_up").on("click",function () {
        move(0,-dis);
    });
    $("#avatar_right").on("click",function () {
        move(dis,0);
    });
    $("#avatar_down").on("click",function () {
        move(0,dis);
    });
    $("#avatar_left").on("click",function () {
        move(-dis,0);
    });
    /*微 缩放*/
    $("#avatar_zoomin").on("click",function () {
        // $("#avatar_zoom").val(parseInt($("#avatar_zoom").val())+1);
        // $("#avatar_zoom").change();
        scale(1.01,1.01);
    });
    $("#avatar_zoomout").on("click",function () {
        // $("#avatar_zoom").val(parseInt($("#avatar_zoom").val())-1);
        // $("#avatar_zoom").change();
        scale(0.99,0.99);
    });
    $("#avatar_more").on("click",function () {
        $('#more_tools').toggle();
    }).hover(function(){
        $(this).tooltip("toggle");
    });
    $("#avatar_save").on("click",function () {
        var dataurl=avatar_canvas.toDataURL('image/png');
        // var w=window.open('about:blank','image from canvas');
        var w=window.open('','','');
        w.document.write("<img src='"+dataurl+"' style='width: 100%;left: 0;top:0;' alt='avatar'/>");
        //console.log(dataurl);
    })
}


