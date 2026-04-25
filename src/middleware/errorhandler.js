function errorHandler(err, req, res, next ){
    console.error('[ERROR]', err.message);

    if(err.name === 'SequelizeUniqueConstraintError'){
        return res.status(400).json({ message : 'Emial already registered'});

    }
    if(err.name === 'CastError'){
        return res.status(400).json({message : 'Invalide ID format'});

    }
    res.status(err.statusCode || 500).json({message : err.message || 'Internal Server Error'});

}

module.exports = errorHandler;