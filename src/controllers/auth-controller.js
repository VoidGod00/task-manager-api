const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


async function register(req, res, next) {
    try{
        const { email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password : hashed });
        res.status(201).json({ succes : true, user : { id: user.id, email : user.email}});
    }
    catch(err){
        next(err);
    }
    
}

async function login(req, res, next) {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({where : {email}});
        if(!user) return res.status(401).json({ message : 'Invalid Credentials'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message : 'Invalid Credentials'});

        const token = jwt.sign({ id : user.id, email : user.email},
            process.env.JWT_SECRET, { expiresIn : '7d'}
        );
        res.json({success : true, token});
    }
    catch(err){
        next(err);
    }
}

async function getProfile(req, res, next) {
    try{
        const user = await User.findByPk(req.user.id, {
            attributes : ['id', 'email', 'createdAt']
        });
        if(!user) return res.status(404).json({message : 'Not Found'});
        res.json({ success : true, user});
    }
    catch(err){
        next(err);
    }
    
}


module.exports = { register, login, getProfile};