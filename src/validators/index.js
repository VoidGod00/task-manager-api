const Joi = require("joi")

const registerSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
});

const createTaskSchema = Joi.object({
    title : Joi.string().max(100).required(),
    description : Joi.string().max(500).optional().allow(' '),
    dueDate : Joi.date().iso().required(),
    status : Joi.string().valid('pending', 'completed').default('pending'),
});


const updateTaskSchema = Joi.object({
    title : Joi.string().max(100).optional(),
    description : Joi.string().max(500).optional().allow(' '),
    dueDate : Joi.date().iso().optional(),
    status : Joi.string().valid('pending', 'completed').optional(),
}).min(1);

function validate(schema){
    return(req,res,next) => {
        const {error, value} = schema.validate(req.body, {abortEarly : false});
        if(error){
            const message = error.details.map(d => d.message);
            return res.status(400).json({succes : false, errors : message});
        }
        req.body = value;
        next();
    };
}


module.exports = {
    validateRegister : validate(registerSchema),
    validatelogin : validate(Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required(),
    })),
    validateCreateTask : validate(createTaskSchema),
    validateUpdateTask : validate(updateTaskSchema),
};