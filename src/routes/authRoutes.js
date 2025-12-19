import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()
//Register new user endpoint
router.post('/register', async (req,res)=>{
  
 const { username , password } = req.body

 //encrpyting the password
 const hashedPassword = bcrypt.hashSync(password,8)
 console.log(hashedPassword)

 //saving the new useer and hashed password to the db
 try{
    

   const user = await prisma.user.create({
      data : {
         username,
         password : hashedPassword
      }
   })

    //after the username and hashedpassword has been inserted.
    //Iadd their first todo for the user !

    const defaultTodo = 'Hello :) Add your first todo..'
   await prisma.todo.create({
      data : {
         task : defaultTodo,
         userId : user.id
      }
   })

    //creating-a-token
    const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn:'24h'})
    res.json({token}) //ie send the token as a response THIS JWT AUTH

 }catch(err){
    console.log(err.message)
    res.sendStatus(503)
 }

 

})

router.post('/login',async (req,res)=>{

 const {username,password} = req.body
 
 try{

   const user = await prisma.user.findUnique({
     
      where : {
             username : username
      }

   })

   //if the user is not even found then return

   if(!user){
      return res.status(404).send({message : "User not found"})
   }

   const passwordIsValid=bcrypt.compareSync(password,user.password)
   
   //if password doesnt match return out of the function.
   if(!passwordIsValid){
      return res.status(401).send({message : "Invalid password"})
   }
   console.log(user)
   
   //then we have a sucessfully login.
   const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn : '24h'})
   res.json({token})

 }catch(err){
    console.log(err.message)
    res.sendStatus(503)
 }

})


export default router