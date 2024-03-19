const jwt = require("jsonwebtoken");


const secret = "Capstone2";


module.exports.createAccessToken = (user) => {

    // The data will be received from the registration form
    // When the user logs in, a token will be created with user's information
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    // Generate a JSON web token using the jwt's sign method
    // Generates the token using the form data and the secret code with no additional options provided
    return jwt.sign(data, secret, {});

}


module.exports.verify = (req,res, next) => {

    console.log(req.headers.authorization);
    // "req.headers.authorization" contains sensitive data and especially our token

    let token = req.headers.authorization; // we saved our token to a variable token

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No token"})
    }
    else{
        console.log(token); // "Bearer eysqowksdldxkasd.alkdasdkla.asdklas"
        token = token.slice(7, token.length); // "Bearer eysqowksdldxkasd.alkdasdkla.asdklas"
        // This will remove the unecessary characters such as the Bearer:, so that the token will only remain and be evaluated.
        console.log(token); // eysqowksdldxkasd.alkdasdkla.asdklas"

        //[SECTION] Token decryption
        /*
        Analogy
            Open the gift and get the content
        - Validate the token using the "verify" method decrypting the token using the secret code.
        - token - the jwt token passed from the request headers.
        - secret - the secret word from earlier which validates our token
        - function(err,decodedToken) - err contains the error in verification, decodedToken contains the decoded data within the token after verification
        */
        // "err" is a built-in variable of express to handle errors
        jwt.verify(token, secret, function(err, decodedToken){

            //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
            if(err){
                return res.send(
                {
                    auth: "Failed",
                    message: err.message
                });
            }
            else{
                console.log("result from verify method: ");
                console.log(decodedToken);

                // Else, if our token is verified to be correct, then we will update the request and add the user's decoded details.
                req.user = decodedToken;

                next(); // run the next middleware
            }
        })
    }
}


module.exports.verifyAdmin = (req, res, next) =>{

    // Checks if the owner of the token is an admin.
    if(req.user.isAdmin){
        // If it is, move to the next middleware/controller using next() method.
        next();
    }
    // Else, end the request-response cycle by sending the appropriate response and status code.
    else{
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }

}

module.exports.isLoggedIn = (req, res, next) => {

    if(req.user){
        next();
    } else {
        res.sendStatus(401);
    }
}