const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoClient=require('mongodb').MongoClient;

var db;

mongoClient.connect('mongodb://localhost:27017/inventory', (err,database) =>{
    if(err)
    {
        return console.log(err);
    }
    db=database.db('inventory');
    app.listen(4000, ()=>{
        console.log("Listening at port number 4000....");
    });
});

app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req,res) =>{
    db.collection('stockDetails').find().toArray((err, result) =>{
        if(err)
        {
            return console.log(err);
        }
        res.render('homepage.ejs',{data: result});
    });
});


app.get('/updateData', (req,res) =>{
    var pID=req.query.pID;
    db.collection('stockDetails').findOne({productID: pID}, (err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        res.render('updatePage.ejs',{data: result});
    });
});

app.post('/updatePage', (req,res) => {
    console.log('Im in update');
    var pID=req.body.pID;
    var pName=req.body.pName;
    var category=req.body.category;
    var stock=Number(req.body.stock);
    var newCp=Number(req.body.newCp);
    var newSp=Number(req.body.newSp);

    var existingStock=0;
    db.collection('stockDetails').findOne({productID: pID}, (err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        existingStock=result.stockAvailable;

        var idToBeUpdated={productID: pID};
        var newStock=existingStock+stock;
        var values={$set: {name: pName, category: category, stockAvailable: newStock, costPrice: newCp, sellingPrice: newSp}};
        db.collection('stockDetails').updateOne(idToBeUpdated, values, (err,result) =>{
            if(err)
            {
                return console.log(err);
            }
            console.log('1 document updated');
            res.redirect('/');
        });
    });
});

app.get('/deleteData', (req,res) =>{
    var pID=req.query.pID;
    db.collection('stockDetails').findOne({productID: pID}, (err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        res.render('deletePage.ejs',{data: result});
    });
});

app.post('/deletePage', (req,res) =>{
    var pID=req.body.pID;

    db.collection('stockDetails').deleteOne({productID: pID}, (err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        console.log('1 document deleted');
        res.redirect('/');
    });
});

app.get('/addData', (req,res) =>{
    res.render('addPage.ejs');
});

app.post('/addPage', (req,res) =>{
    var pID=req.body.pID;
    var pName=req.body.pName;
    var category=req.body.category;
    var stock=Number(req.body.stock);
    var cp=Number(req.body.cp);
    var sp=Number(req.body.sp);

    var values={productID: pID, name: pName, category: category, stockAvailable: stock, costPrice: cp, sellingPrice: sp};
    db.collection('stockDetails').insertOne(values, (err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        console.log('1 document added');
        res.redirect('/');
    });
});

app.get('/salesData', (req,res) =>{
    db.collection('salesDetails').find().sort({stocksSold: -1}).toArray((err,result) =>{
        if(err)
        {
            return console.log(err);
        }
        res.render('salesPage.ejs', {data: result});
    });
});