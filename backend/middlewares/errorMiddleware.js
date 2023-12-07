const notFound = (req,res,next) => {
    const error = new Error(`no such url on server - ${req.originalUrl}`)
    res.status(404)
    next(error) //it will call the 'errorHandler' as 'error' is passed through next() middleware

}

//anywhere in the code if any error is thrown , express will by default call this 'error handling middleware' as it has (error,req,res,next) syntax

const errorHandler = (error,req,res,next) => {

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = error.message

    if(error.name === 'CastError' && error.kind === 'ObjectId'){
        statusCode = 404
        message = "Resource Not Found"
    }

    res.status(statusCode).json({
        message: message,
        statusCode : statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack
    })

}


export {notFound,errorHandler}