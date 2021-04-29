const express=require('express');
const app=express();

app.get('/',
    function(req,res)
    {
        res.send("<h1>Hello this is Express hello world</h1>");
    }
);

app.listen(9090,
    function()
    {
        console.log("Server starting at port 9090");
    }
);