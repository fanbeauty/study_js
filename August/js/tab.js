var oTab = document.getElementById("tab");
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
var tBody = oTab.tBodies[0];  // 获取第一个tBody
var oRows = tBody.rows; //获取tBody下的每一行


var data = null;
// -> 1.首先获取后台(data.txt)中的数据 “json格式的字符串” AJAX -> async javascript and xml
//1)首先创建一个xhr对象
var xhr = new XMLHttpRequest;
//2)打开我们需要请求数据的那个文件地址
xhr.open("get", "../json/data.txt", false);
//3)监听请求的状态
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        data = eval("(" + val + ")");
    }
};
//4.发送请求
xhr.send();


// -> 2.实现我们的数据绑定

function bind() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        var oTr = document.createElement("tr");
        //每一个tr中还需创建四个td
        for (var key in cur) {
            var oTd = document.createElement("td");
            if (key == "sex") {
                oTd.innerHTML = cur[key] === 0 ? "男" : "女";
            } else {
                oTd.innerHTML = cur[key];
            }
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}

bind();

//3 ->实现隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? "bg" : null;
    }
}

changeBg();


//4. -> 编写表格排序的方法：多列排序
function sort(n) {
    // ->把存储所有行的类数组转化为数组
    var ary = Array.prototype.slice.call(oRows);

    // 优化 ，点击当前列，需要让其他列flag初始化为-1,这样在返回点击其它列，才是按照升序排列的
    for (var i = 0; i < oThs.length; i++) {
        if(oThs[i] !== this){
            oThs[i].flag=-1;
        }
    }

    //this -> oThs[1]
    var _this = this;
    _this.flag *= -1;
    ary.sort(function (a, b) {
        //this ->window
        var curInn = a.cells[n].innerHTML;
        var nextInn = b.cells[n].innerHTML;
        var curInnNum = parseFloat(curInn);
        var nextInnNum = parseFloat(nextInn);

        if (isNaN(curInnNum) || isNaN(nextInnNum)) {
            return (curInn.localeCompare(nextInn))* _this.flag;
        } else {
            return (curInnNum - nextInnNum) * _this.flag;
        }
    });
    //按照ary中的最新荀淑，把排序好的数据添加到tBody中去
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}

//5 。 点击排序，所有具有class="cursor"样式的列都可以实现点击排序
//给当前点击这一列增加一个自定义属性
for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    if (curTh.className === "cursor") {
        curTh.index = i; //用来存储索引
        curTh.flag = -1; //用来实现升降序
        curTh.onclick = function () {
            sort.call(this, this.index);
        }
    }
}











