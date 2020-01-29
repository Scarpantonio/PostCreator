// Quedamos pendiente con heroku ver si nuestro codigo con mongoDB no esta dando error porque no esta conectado live si no local. 
// Talvez el error viene porque estoy tratando de conectar live heroku con local MongoDB,  
// y lo que tengo que hacer es conectar ambos live heroku with live mongo. 


const express = require('express')
const path = require('path')

const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const BlogPost = require('./models/BlogPost')
const fileUpload = require('express-fileupload') 

app.use(fileUpload()) 

mongoose.connect('mongodb://localhost/blogpost_DB', {useNewUrlParser: true});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// Porque todos mis CSS archivos estan u static directoy llamado public. cuando lo indicamos finalmente lo encontr
app.set('view engine','ejs')

app.use(express.static('public'))

app.listen(3000, ()=>{
    console.log('listening to port 3000')
})

//pag 84: validando data. indicamos is no es introducido ningun de los datos que requerimos se manda al cliente devuelta a posts/new
const validateMiddleWare = (req,res,next) => {    
    if(req.files == null || req.body.title == null || req.body.title == null){        
        return res.redirect('/posts/new')
    }    
    next()
}

app.use('posts/store',validateMiddleWare) // leer keepNote Express Middleware

app.get('/', async (req,res) => {
    // almacenamos en esta varaible la info que viene del Db y luego la ponemos accesible en index para luego poder ser mostrada dinamicamente en index.ejs. 
    // Crime-app tip / aqui podeiamos colocar 
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    });
})

app.get('/about',(req,res) => {
    res.render('about')
})

app.get('/contact',(req,res) => {
    res.render('contact')
})

app.get('/post',(req,res)=>{    
    res.render('post')
})


// Pag 70
// Adjuntamos el ID al valor de un parametro en especifioo.  
// Aqui para que cada blog title en home page, nos lleve a la pagina de ese articulo.  
app.get('/post/:id',async (req,res)=>{        
    const blogpost = await BlogPost.findById(req.params.id)
    // console.log(blogpost)
    res.render('post',{
        blogpost
    });    
})

//geenrador de los nuevos posts. 
app.get('/posts/new',(req,res)=>{
    res.render('create')
})

// Pag 78
// Uploading an image to our app. 
app.post('/posts/store', (req,res)=>{ 
    let image = req.files.image;  
    image.mv(path.resolve(__dirname,'public/img',image.name),async (error)=>{
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        })
        res.redirect('/')
    })            
})


// CODIGO ANTEIOR UTILIZADO CREAR SOLAMENT ELOS NUEVOS POSTS SIN LAS IMAGENES. 
// Aqui basicamente estamos diciendo => crea un nuevo post basado en lo que recibas de req.body
// data not storing into database. 
// app.post('/posts/store',async(req,res) => {
//     await BlogPost.create(req.body) 
//     res.redirect('/')
//     console.log(req.body)
// })


















// when deplyig to heroku. => user code that follows. 
// let port = process.env.PORT;
// if(port == null && port == ""){
//     port = 4000;
// }

// app.listen(port, ()=>{
//     console.log('App listening 4000...')    
// })


// app.get('/post',(req,res)=>{
//     res.render('post',
//         BlogPost
//     )
// })


