//使用惰性思想（JS高阶编程技巧之一）来封装我的常用方法库：第一次在给utils赋值的时候我们就已经把兼容处理好，
//把最后的结果保存在flag变量中，以后再每一个方法中，只要IE6~8不兼容，我们不需要重新检测，只需要使用flag的值即可
var utils = (function () {
    var flag = "getComputedStyle" in window; //->flag这个变量不销毁，存储的是判断当前浏览器是否兼容getComputedStyle,兼容的话是标准浏览器，但是如果flag=false说明当前的浏览器是IE6~8

    //用兼容的方法，将类数组，转换为数组
    function listToArray(likeArray) {
        var ary = [];
        if (flag) {
            ary = Array.prototype.slice.call(likeArray);
        } else {
            for (var i = 0; i < likeArray.length; i++) {
                ary[ary.length] = likeArray[i];
            }
        }
        return ary;
    }

    // ->jsonParse :把json格式字符串转化为JSON对象
    function jsonParse(str) {
        var val = null;
        try {
            val = JSON.parse(str);
        } catch (e) {
            eval("(" + str + ")");
        }
        return val;
    }

    //->getDistance: 获取当前元素距离父级参照物的长度
    function getDistance(culEle) {
        var left = culEle.offsetLeft;
        var top = culEle.offsetTop;
        while (culEle.offsetParent) {
            var culElePar = culEle.offsetParent;
            left += culElePar.clientLeft;
            top += culElePar.clientTop;

            left += culElePar.offsetLeft;
            top += culElePar.offsetTop;
            culEle = culElePar;
        }
        return {left: left, top: top};
    }


    //win ->所有操作浏览器
    function win(attr, value) {
        if (typeof value === "undefined") {
            //获取
            return document.documentElement[attr] || document.body[attr];
        }
        //设置
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    //children:获取curEle下所有元素子节点(兼容所有浏览器),如果传递了tagname,可以在获取中进行二次筛选，把所有tagname标签都获取到
    function children(curEle, tagname) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0; i < nodeList.length; i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType === 1) {//当前节点是元素节点
                    ary.push(curNode);
                }
            }
        } else {
            ary = [].slice.call(curEle.children);
        }
        //二次筛选：过滤掉tagname元素
        if (typeof tagname === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagname.toLowerCase()) {
                    //不是我想要的标签
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }

    //获取当前元素的哥哥节点
    function prev(curEle) {
        if (!flag) {
            var pre = curEle.previousSibling;
            while (pre && pre.nodeType !== 1) {
                pre = pre.previousSibling;
            }
        } else {
            var pre = curEle.previousElementSibling;
        }
        return pre;
    }

    //获取当前元素下一个弟弟节点
    function next(curEle) {
        if (!flag) {
            var next = curEle.nextSibling;
            while (next && next.nodeType !== 1) {
                next = next.nextSibling;
            }
        } else {
            var next = curEle.nextElementSibling;
        }
        return next;
    }

    //获取所有的哥哥节点
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    //获取所有的弟弟节点
    function nextAll(curEle) {
        var ary = [];
        var nextEle = this.next(curEle);
        while (nextEle) {
            ary.push(nextEle);
            nextEle = this.next(nextEle);
        }
        return ary;
    }

    //获取相邻的两个兄弟元素
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nextEle = this.next(curEle);
        var arr = [];
        pre ? arr.push(pre) : null;
        nextEle ? arr.push(nextEle) : null;
        return arr;
    }

    //获取所有的兄弟节点
    function siblings(culEle) {
        var pres = this.prevAll(culEle);
        var nexts = this.nextAll(culEle);
        return pres.concat(nexts);
    }

    //获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //获取元素的第一个子节点
    function firstChild(curEle) {
        return this.children(curEle) ? this.children(curEle)[0] : null;
    }

    //获取元素的最后一个子节点
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //prepend:向指定容器的开头追加元素：
    //->把新元素添加到容器的第一个子元素节点的前面，如果一个元素子节点都没有，就放在末尾
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return
        }
        container.appendChild(newEle);
    }

    //->insertBefore:把新元素追加到指定元素（老元素）的前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //insertAfter:把新元素追加到指定元素（老元素）的后面
    //->找到老元素的后面一个兄弟，把新元素插入到后面兄弟的前面，如果没有后面兄弟，则直接append
    function insertAfter(newEle, oldEle) {
        var nextEle = this.next(oldEle);
        if (nextEle) {
            nextEle.parentNode.insertBefore(newEle, nextEle);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }

    //判断是否有这个class
    function hasClass(curEle, className) {
        var cn = curEle.className.replace(/(^ +| +$)/g, "");
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(cn);
    }

    //增加类名
    function addClass(curEle, className) {
        var class_arr = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < class_arr.length; i++) {
            if (this.hasClass(curEle, class_arr[i])) {
                return;
            }
            curEle.className += " " + class_arr[i];
        }

    }

    //移除类名
    function removeClass(curEle, className) {
        var class_arr = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < class_arr.length; i++) {
            if (this.hasClass(curEle, class_arr[i])) {
                var reg = new RegExp("(^| +)" + class_arr[i] + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(className, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(className));
        }
        //IE6~8
        var ary = [];
        var classNameAry = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*"); //->获取指定上下文中的所有元素标签
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var curNodeClassName = curNode.className;
            var flag = true;
            for (var j = 0; j < classNameAry.length; j++) {
                var curClassName = classNameAry[j];
                var reg = new RegExp("(^| +)" + curClassName + "( +|$)");
                if (!reg.test(curNodeClassName)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                ary.push(curNode);
            }
        }
        return ary;
    }

    //->getCss:获取当前元素的计算样式
    function getCss(attr) {
        var val = null;
        var reg = null;
        if (flag) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            //如果传递进来的是opacity，说明我们要获取透明度，但是在IE6~8下，获取透明度需要用filter
            if (attr === 'opacity') {
                val = this.currentStyle["filter"]; //->例如 alpha(opacity=10) ，对这个结果进行处理
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                reg.test(val) ? reg.exec(val)[1] / 100 : 1;

            } else {
                val = this.currentStyle[attr];
            }
        }
        reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->setCss:给当前元素的某一个样式属性设置值（增加在行内样式上）
    function setCss(attr, value) {
        //在JS中设置float样式值的话也需要处理兼容
        if (attr === "float") {
            this["style"]["cssFloat"] = value;
            this["style"]["styleFloat"] = value;
            return;
        }
        //如果打算设置的是元素的透明度，我们需要设置两套样式来兼容所有的浏览器
        if (attr === "opacity") {
            this["style"]["opacity"] = value;
            this["style"]["filter"] = "alpha(opacity+" + value * 100 + ")";
            return;
        }
        //对于某些样式属性，如果传递进来的值没有加单位，我们需要把单位默认的补充上，这样更人性化。
        var reg = /^(width|height|left|top|right|bottom|((margin|padding)(Top|Bottom|left|right)?))$/i;
        if (reg.test(attr)) {
            if (!isNaN(value)) { //判断传递进来的值是不是有效数字，如果是有效数字的话，证明当前传递进来的值没有加单位，我们给补充单位
                this["style"][attr] = value + "px";
                return;
            }
        }
        this["style"][attr] = value;
    }

    //->setGroupCss:给元素批量设置属性
    function setGroupCss(options) {
        //->通过检测options的数据类型,如果不是一个对象，则不能进行批量设置
        options = options || 0;
        if (options.toString() !== "[object Object]") {
            return;
        }
        //->遍历对象中的每一项，调取setCss方法一个一个的进行设置即可
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]);
            }
        }
    }

    //->css:此方法实现了获取，单独设置，批量设置元素的样式值
    function css(curEle) {
        var ary = Array.prototype.slice.call(arguments, 1);
        var argTwo = arguments[1];
        if (typeof argTwo === "string") { //->第二个参数值是一个字符串，这样的话很有可能是在获取样式；为什么说很有可能，因为还要判断第三个参数，如果存在第三个参数，就不是获取了，而是在单独的设置样式属性值
            if (typeof arguments[2] === "undefined") { //->第三个参数不存在
                // return this.getCss(curEle,argTwo);
                return getCss.apply(curEle, ary);
            }
            //第三个参数存在则为单独设置样式值
            setCss.apply(curEle, ary);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            //->批量设置样式属性值
            setGroupCss.apply(curEle, ary);
        }
    }

    return {
        listToArray: listToArray,
        jsonParse: jsonParse,
        getDistance: getDistance,
        win: win,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        css: css
    }
})();