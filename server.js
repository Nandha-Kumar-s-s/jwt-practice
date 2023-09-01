require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json())


const posts = [
    {
        username:'nandhu',
        title:'post1'
    },
    {
        username:'sathish',
        title:'post2'
    }
]
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

jwt.verify(token,process.env.TOKEN,(err,user)=>{
        if(err) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}
app.get('/posts',authenticateToken,(req,res)=>{
    console.log(req.user.name);
    res.json(posts.filter(post => post.username === req.user.name))
})
app.post('/login',(req,res)=>{
    const username = req.body.username
    const user = {
        name:username
    }
   const accesstoken =  jwt.sign(user,process.env.TOKEN)
   res.json({accesstoken:accesstoken})
})


app.listen(3000,()=>{
    console.log(`app is running`);
})