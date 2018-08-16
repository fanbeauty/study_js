(function () {

    var banner = document.getElementById("banner"), bannerInner = utils.firstChild(banner),bannerTip = utils.children(banner,"ul")[0];
    var imgList = bannerInner.getElementsByTagName("img"),oLis = bannerTip.getElementsByTagName("li");
    var bannerLeft = document.getElementsByClassName("bannerLeft")[0],bannerRight = document.getElementsByClassName("bannerRight")[0];


    //1.实现数据绑定：Ajax请求数据、按照字符串拼接上市绑定数据
    var jsonData = null,count = 0;
    //1.数据绑定
    ~function () {
        var xhr = new XMLHttpRequest;
        xhr.open("get", "json/banner.txt?_=" + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {

                jsonData = utils.formatJSON(xhr.responseText);

            }
        };
        xhr.send(null);
    }();

    //2.字符串拼接
    ~function () {
        var strImg = "";
        var strTip = "";
        if (jsonData) {
            for (var i = 0; i < jsonData.length; i++) {
                strImg += "<div><img src=' ' trueImg = " + jsonData[i]["img"] + " alt=" + jsonData[i]["desc"] + "></div>";
                i===0? strTip +='<li class="select"></li>':strTip +='<li></li>';
            }
            strImg+= "<div><img src=' ' trueImg = " + jsonData[0]["img"] + " alt=" + jsonData[0]["desc"] + "></div>"
            count = jsonData.length+1;
        }

        bannerInner.innerHTML = strImg;
        bannerTip.innerHTML = strTip;

        utils.css(bannerInner, "width", count * 1000);
    }();


    //3.实现图片的延迟加载
    window.setTimeout(lazyImg,500);
    function lazyImg() {
        for(var i=0;i<imgList.length;i++){
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    oImg = null;
                    huanAnimate(curImg,{opacity:1},500);
                }
            }(i);
        }
    }


    //4.实现自动轮播
    var step = 0,duration=2000,autoTimer = null;
    autoTimer = window.setInterval(autoMove,duration);
    function autoMove() {
        if(step==count-1){
            step = 0;
            bannerInner.style.left = 0;
        }
        step++;
        huanAnimate(bannerInner,{left:step*(-1000)},500);
        changeTip();
    }

    //5.实现焦点对齐
    function changeTip(){
        var tempStep = step >= oLis.length?0:step;
        for(var i=0;i<oLis.length;i++){
            tempStep === i ? utils.addClass(oLis[i],"select"):utils.removeClass(oLis[i],"select");
        }
    }

    //6.停止和开启自动轮播
    banner.onmousemove = function () {
        window.clearInterval(autoTimer);
    }
    banner.onmouseout = function () {
        autoTimer = window.setInterval(autoMove,duration);
    }

    //7.点击焦点实现轮播图的切换
    ~function () {
        for(var i=0;i<oLis.length;i++){
            var curLi = oLis[i];
            curLi.index = i;
            curLi.onclick = function () {
                step = this.index;
                changeTip();
                huanAnimate(bannerInner,{left:step*(-1000)},500);
            }
        }
    }();

    //8、实现左右切换
    bannerRight.onclick = autoMove;
    bannerLeft.onclick = function () {
        if (step <= 0) {
            step = count - 1;
            bannerInner.style.left = -step*1000;
        }
        step--;
        huanAnimate(bannerInner, {left: -step * 1000}, 500);
        changeTip();
    }


})();