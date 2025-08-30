class ExpressError extends Error{
    constructor(status,message){
        super();
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError;

/*Alright — let’s break it down step by step.

You’ve written a custom error class for your Node.js/Express app so you can throw errors with a specific HTTP status code and message, instead of just using the default Error class.

1. class ExpressError extends Error
class ExpressError → This defines a new class called ExpressError.

extends Error → This means your new class inherits from the built-in JavaScript Error class, so it has all the normal error features (like a stack trace).

2. constructor(statusCode, message)
The constructor is a special function that runs when you create a new object from this class.

It takes two parameters:

statusCode → The HTTP status code (e.g., 404, 500, 403).

message → A human-readable error message (e.g., "Page Not Found").

3. super();
super() calls the parent class constructor (Error's constructor).

Normally you would pass the error message to super(message) so the built-in Error properly stores it.
Here you’re just calling super() with no arguments, but still manually setting the message later.

 */