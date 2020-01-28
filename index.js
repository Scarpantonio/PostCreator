const express = require('express')
const path = require('path')

const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost/blogpost_DB', {useNewUrlParser: true});


// Porque todos mis CSS archivos estan u static directoy llamado public. cuando lo indicamos finalmente lo encontr
app.set('view engine','ejs')
app.use(express.static('public'))

app.listen(3000,() => {
    console.log("listening to port 3000")
})

app.get('/', async (req,res) => {
    // almacenamos en esta varaible la info que viene del Db y luego la ponemos accesible en index para luego poder ser mostrada dinamicamente en index.ejs. 
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    });
})

// Aqui basicamente estamos diciendo => crea un nuevo post basado en lo que recibas de req.body
// data not storing into database. 
app.post('/posts/store',async(req,res) => {
    await BlogPost.create(req.body) 
    res.redirect('/')
    console.log(req.body)
})

app.get('/about',(req,res) => {
    res.render('about')
})

app.get('/contact',(req,res) => {
    res.render('contact')
})

//geenrador de los nuevos posts. 
app.get('/posts/new',(req,res)=>{
    res.render('create')
})







// app.get('/post',(req,res)=>{
//     res.render('post',
//         BlogPost
//     )
// })

// app.get('/post',(req,res)=>{
//     res.render('post')
// })