const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDb = require('./config/connectdb')
const path = require('path')
const app = express()
dotenv.config()

connectDb()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/api/v1/user', require('./routes/userRoute'))
app.use('/api/v1/user/transactions', require('./routes/transcationRoutes'))

//static files
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//port
const PORT = process.env.PORT || 8000


//listen server
app.listen(PORT, () =>{
    console.log(`Server is running on PORT = ${PORT}`);
})