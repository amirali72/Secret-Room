const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const connectDB = require('./config/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const salt = bcrypt.genSaltSync(10);

const app = express();

app.use(cors({ credentials: true, origin: 'https://secret-room-s8pf.onrender.com' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

dotenv.config();
connectDB();

const PORT = process.env.PORT;

app.post('/register', async (req, res) => {

    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    let passOk;
    if (userDoc) {
        passOk = bcrypt.compareSync(password, userDoc.password);
    }
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, process.env.SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json('Wrong Credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.SECRET, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})



app.post('/post', async (req, res) => {

    const { title, summary } = req.body;
    try {
        const postDoc = await Post.create({
            title,
            summary,
        });
        res.json(postDoc);
        console.log(postDoc);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
        .sort({createdAt: -1})
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  });

app.listen(PORT);