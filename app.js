const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();

dotenv.config()

const customMiddleware = (req, res, next) => {
    console.log('hello from the middleware')
    next()
}

app.use(express.json())

app.use('/', customMiddleware)

app.get('/', (req, res) => {
    console.log('main route')
})

app.get('/users', (req, res) => {
    let users = ["Ben", "Alice", "Orson", "Ella"]

    console.log('here are some users')
    res.json({
        users: users
    })
})

const User = require('./model/user')

app.post('/add-user', async (req, res, next) => {
    const username = req.body.username
    try {
        const user = await new User(req.body)
        user.save();
        // res.send(`User ${req.body.username} saved`)

    } catch (error) {
        res.send({ message: error })
        next(error)
    }

    res.send(`User added: ${username}`)
})

const connection = mongoose.connection;

mongoose.connect(process.env.DB_CONNECTION_STRING, { useUnifiedTopology: true, useUnifiedTopology: true, useNewUrlParser: true }, 
    (req, res) => {
    console.log('MongoDB Connection established')
})

connection.on('open', () => {
    console.log('Mongo connection open for real')
})

connection.on('error', (err) => {
    console.log(`No conection made due to error: ${err}`)
})

app.listen(2000, function() {
    console.log(`App listening on port 2000`)
})