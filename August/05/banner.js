//->通过jQuery选择器或者筛选的方法获取到的jQuery集合是不存在DOM的映射机制的，之前获取到的集合，之后在页面中HTML结构
//改变了，集合中的内容不会跟着自动变化（JS获取到的元素集合有DOM映射机制）

~function (jQuery) {
//执行banner  $().banner( , , ,);
    function zhufengBanner(ajaxURL, interval) {
        //1.获取元素
        var $banner = $(this);
        var $bannerInner = $banner.children(".bannerInner"), $divList = null, $bannerImage = null;
        var $bannerTip = $banner.children(".bannerTip"), $bannerTipLi = null;
        var $bannerLeft = $banner.children(".bannerLeft"), $bannerRight = $banner.children(".bannerRight");

        //2.Ajax读取数据
        var jsonData = null;
        $.ajax({
            url: ajaxURL + "?_=" + Math.random(),
            type: 'get',
            dataType: 'json',
            async: false, //->当前请求的是同步
            success: function (data) {
                jsonData = data;
            }
        })

        //3.实现数据绑定
        bindData();

        function bindData() {
            var str = "", str2 = "";
            $.each(jsonData, function (index, item) {
                str += "<div><img src='' trueImg='" + item['img'] + "' alt='" + item['desc'] + "' /></div>";
                0 === index ? str2 += "<li class='bg'></li>" : str2 += "<li></li>";
            });
            $bannerInner.html(str);
            $bannerTip.html(str2);
        }

        //绑定数据后再进行获取
        $divList = $bannerInner.children();
        $bannerImage = $bannerInner.find("img");
        $bannerTipLi = $bannerTip.children();

        //4.图片延迟加载
        window.timer = window.setTimeout(lazyImg, 500);

        function lazyImg() {
            $bannerImage.each(function (index, item) {
                var $Img = $(this); // this === item
                var oImg = new Image;
                oImg.src = $Img.attr('trueImg');
                oImg.onload = function () {
                    $Img.prop('src', this.src).css('display', 'block');
                    oImg = null;
                }
            })
            $divList.eq(0).css("zIndex", 1).animate({opacity: 1}, 300);
        }

        //5.自动轮播
        var interval = interval || 3000, step = 0, autoTimer = null;
        autoTimer = window.setInterval(autoMove, interval);

        function autoMove() {
            if (step === jsonData.length - 1) {
                step = -1;
            }
            step++;
            changeBanner();
        }

        //封装一个轮播图切换和桥店对齐的方法
        function changeBanner() {
            var $curDiv = $divList.eq(step);
            $curDiv.css("zIndex", 1).siblings().css("zIndex", 0);
            $curDiv.animate({opacity: 1}, 300, function () {
                $(this).siblings().animate({opacity: 0}, 300);
            });
            var $curLi = $bannerTipLi.eq(step);
            $curLi.addClass("bg").siblings().removeClass("bg");
        }

        //6.控制左右按钮 显示、隐藏和自动轮播的开始和暂停
        $banner.on("mouseover", function () {
            window.clearInterval(autoTimer);
            $bannerLeft.css("display", "block");
            $bannerRight.css("display", "block");
        }).on("mouseout", function () {
            autoTimer = window.setInterval(autoMove, interval);
            $bannerLeft.css("display", "none");
            $bannerRight.css("display", "none");
        })

        //7.实现点击焦点切换
        $bannerTipLi.on("click", function () {
            step = $(this).index();
            changeBanner();
        })

        //8.实现左右切换
        //右切换
        $bannerRight.on("click", autoMove);
        //左切换
        $bannerLeft.on("click", function () {
            if (step === 0) {
                step = jsonData.length;
            }
            step--;
            changeBanner();
        })
    }

//轮播图封装
    jQuery.fn.extend({
        banner: zhufengBanner,
    });

}(jQuery);