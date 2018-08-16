//导入三个常用的NODE内置模块
var http = require("http"),
    fs = require("fs"),
    url = require("url"); //URL模块中提供了一个方法 url.parse()用来解析URL地址
//1.HTTP
//->http.createServer:创建一个服务
//->server.listen() : 为这个服务监听一个端口
var server = http.createServer(function (request,response) {
    //->当客户端向当前服务发起一个请求，并且当前服务已经成功接收到这个请求,执行这个回调函数
    //->request(请求):存放的是所有客户端的请求信息，包含客户端通过问号传递给服务器的数据内容
    // console.log(request.url); request.url 存放的是客户端请求的文件资源的目录和名称以及传递给服务器的数据，
    // console.log(url.parse(request.url,true)); //query字段 存储的是解析后的参数
    var urlObj = url.parse(request.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    //->根据请求的URL地址（具体的是根据地址中的pathname)获取到对应资源文件中的源代码
    if(pathname==="/1.区分同源和非同源.html")
    {
        var con = fs.readFileSync("./1.区分同源和非同源.html","utf-8");
        //->response(响应）：提供了向客户端返回内容和数据的方法
        //->response.write:告诉客户端返回内容
        //->response.end：告诉服务器响应结束了
        response.write(con);
        response.end();

    }

});
server.listen(80,function () {
    //->当服务创建成功，并且端口号创建成功
    console.log("server is create success,listening on 80 port!");
})
