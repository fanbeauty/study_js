var http = require("http"),url = require("url"),fs = require("fs");
var server = http.createServer(function (request,response) {
    var urlObj = url.parse(request.url,true),
        pathname = urlObj.pathname;

    //前端路由：根据不同的 url 地址展示不同的内容或页面

    //->处理静态资源文件的请求(HTML/CSS/JS...)
    var reg=/\.(HTML|JS|CSS|JSON|TXT|ICO)/i;
    if(reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixMIME = "text/html";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JSON":
                suffixMIME = "application/json";
                break;
            case "ICO":
                suffixMIME = "application/octet_stream";
                break;
        }

        try {
            var content = fs.readFileSync("."+pathname,"utf-8");
            response.writeHead(200,{'content-type':suffixMIME+";charset=utf-8"});
            response.end(content);
        }catch (e) {
            response.writeHead(404,{'content-type':'text/plain'});
            response.end("response file is not find");
        }
    }

    // if(reg.test(pathname)){
    //     //获取请求文件的后缀名
    //     var suffix =  reg.exec(pathname)[1].toUpperCase();
    //     console.log(suffix);
    //     //根据请求文件的后缀名获取文件的类型
    //     var suffixMIME = "text/plain";
    //     switch (suffix)
    //     {
    //         case "HTML":
    //             suffixMIME = "text/html";
    //             break;
    //         case "CSS":
    //             suffixMIME = "text/css";
    //             break;
    //         case "JS":
    //             suffixMIME = "text/javascript";
    //             break;
    //         case "JSON":
    //             suffixMIME = "application/json";
    //             break;
    //         case "ICO":
    //             suffixMIME = "application/octet-stream";
    //             break;
    //     }
    //     //->按照指定的目录读取文件中的内容(读取出来的内容都是字符串格式的)
    //     try{
    //         var content = fs.readFileSync("."+pathname,"utf-8");
    //         //重写响应头信息，告诉客户端的浏览器我返回的内容是什么类型,并制定返回的内容是"utf-8"编码
    //         console.log(content);
    //         response.writeHead(200,{'content-type':suffixMIME+";charset=utf-8"});
    //         response.end(content);
    //     }catch(e){  //try-catch捕获异常，防止当前请求的文件不存在，导致服务器崩溃
    //         response.writeHead(404,{'content-type':'text/plain'});
    //         response.end("request file is not find");
    //     }
}).listen(8080,function () {
    console.log("The server is started at 8080 port!");
});


/*
状态码
100:
200:
201:
301：
302：
400：
403:
404:
500:
503:
 */