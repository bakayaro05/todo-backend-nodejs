import express from 'express'
import path,{dirname} from 'path'
import {fileURLToPath} from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authmiddleware.js'

const app = express()

const PORT =  process.env.PORT || 5000


//GET filepath from the URL of the current module.
const __filename=   fileURLToPath(import.meta.url)
//GET the directory name from the file path.
const __dirname=dirname(__filename)

//MIDDLEWARE

// Serves the html file from the /public directory.
//tells express to serve all files from the public folder as static assets. Any requests 
//for the css files will be resolved to the public directory.

app.use(express.static(path.join(__dirname,'../public'))) //this line is necessary since it tells node.js to inform that public directory is not in the same level i.e. public is above src.
app.use(express.json())


//this endpoint is for serving the HTML file from the /public directory.
app.get('/',(req,res)=>{

res.sendFile(path.join(__dirname,'public','index.html'))

})

//routes
app.use('/auth',authRoutes)
app.use('/todos',authMiddleware,todoRoutes)


app.listen(PORT,()=>{
    console.log(`Sever has started on port : ${PORT}`)
})
