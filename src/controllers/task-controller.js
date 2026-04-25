
const Task = require("../models/task");

async function createTask(req, res, next) {
    try{
        const task = await Task.create({ userId: req.user.id, ...req.body});
        res.status(201).json({success : true, task});
    }
    catch(err){
        next(err);
    }
    
}

async function getAllTask(req, res, next) {
    try{
        const tasks = await Task.find({ userId : req.user.id,}).sort({createAt: -1});
        res.json({success : true, count : tasks.length, tasks});
    }
    catch(err){
        next(err);
    }
    
}


async function getTaskById(req, res, next) {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message : 'Task Not Found'});
        if(task.userId != req.user.id) return res.status(403).json({ message : 'Forbidden'});
        res.json({success : true, task}); 
    }
    catch(err){
        next(err);
    }
    
}

async function updateTask(req, res, next) {
    try{
        const task =await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message : 'Task Not Found'});
        if(task.userId != req.user.id) return res.status(403).json({ message : 'Forbidden'});
        ['title', 'description', 'dueDate', 'status'].forEach(f => {
            if(req.body[f] !== undefined) task[f]= req.body[f];
        });
        await task.save();
        res.json({success : true, task});
    }
    catch(err){
        next(err);
    }
    
}

async function deleteTask(req, res, next) {
    try{
        const task =await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message : 'Task Not Found'});
        if(task.userId != req.user.id) return res.status(403).json({ message : 'Forbidden'});
        await task.deleteOne();
        res.json({success : true, message : 'Task deleted'});
    }
    catch(err){
        next(err);
    }
    
}


module.exports = { createTask, getAllTask, getTaskById, updateTask, deleteTask};