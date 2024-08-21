export function globalErrorHandler(error,req,res,next) {
    console.log("In Error Middleware")
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })
}