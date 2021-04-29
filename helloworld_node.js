const http=require('http');
const server=http.createServer(
    function f1(request, response)
    {
        response.write("Hello This is my hello world of node js");
        response.end();
    }
);

server.listen(9000,
    function()
    {
        console.log("Server started at port 9000");
    }
);