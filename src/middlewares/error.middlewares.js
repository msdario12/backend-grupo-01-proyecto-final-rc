const errorHandler = (error, req, res, next) => {
    console.error(error.stack);

    res.status(500).json({
        status: 500,
        method: req.method,
        path: req.url,
        response: error.message,
    });

};

module.exports = { errorHandler };
