/*
// 实现一个选项卡的封装：我们可以分析出，只要多个选项卡的主体结构一样，那么每一个实现的思想都是一模一样的，唯一不一样的是最外层的盒子
~function () {

     // * tabChange:封装一个选项卡插件，只要大结构保持统一，以后实现选项卡的功能，只需要调取这个方法即可实现
     // * container：当前实现选项卡的这个容器
     // * defaultIndex:默认选中的索引

    function tabChange(container, defaultIndex) {
        var tabFirst = utils.firstChild(container), oLis = utils.children(tabFirst),
            oDivs = utils.children(container, "div");

        defaultIndex = defaultIndex || 0;
        for (let k = 0; k < oDivs.length; k++) {
            k === defaultIndex ? utils.addClass(oDivs[k], "select") : utils.removeClass(oDivs[k], "select");
        }

        for (let i = 0; i < oLis.length; i++) {
            oLis[i].onclick = function () {
                var curSiblings = utils.siblings(this);
                for (let i = 0; i < curSiblings.length; i++) {
                    utils.removeClass(curSiblings[i], "select");
                }
                utils.addClass(this, "select");
                var index = utils.index(this);
                var divList = utils.nextAll(this.parentNode);
                for (let i = 0; i < divList.length; i++) {
                    i === index ? utils.addClass(divList[i], "select") : utils.removeClass(divList[i], "select");
                }
            }
        }
    }

    window.huantab = tabChange;
}();
*/

//优化一下，通过事件委托机制
~function () {

    function tabChange(container, defaultIndex) {
        var tabFirst = utils.firstChild(container);
        var oLis = utils.children(tabFirst);
        var oDivs = utils.children(container, "div");

        defaultIndex = defaultIndex || 0;
        for (let k = 0; k < oDivs.length; k++) {
            k === defaultIndex ? utils.addClass(oDivs[k], "select") : utils.removeClass(oDivs[k], "select");
        }

        //不用循环，用事件委托
        tabFirst.onclick = function (e) {
            e = e || window.event;
            e.target = e.target || e.srcElement;
            //->说明我当前点击的是li标签
            if(e.target.tagName.toLowerCase()==="li"){
                detailFn.call(e.target,oLis,oDivs);
            }
        }


    }
    
    function detailFn(oLis,oDivs) {
        var index = utils.index(this);
        utils.addClass(this, "select");
        for (let i = 0; i < oDivs.length; i++) {
            i === index ? utils.addClass(oDivs[i], "select") : (utils.removeClass(oLis[i], "select"),utils.removeClass(oDivs[i], "select"));
        }

    }

    window.huantab = tabChange;
}();