const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require("../auth");
require("dotenv").config();
const nodemailer = require("nodemailer");

const { sendRegistrationNotification, sendUpdatePasswordNotification } = require("../emailService");



module.exports.registerUser = async (req, res) => {
    try {
        if (!req.body.email.includes("@") || req.body.mobileNo.length !== 11 || req.body.password.length < 8) {
            return res.status(400).send({ error: 'Invalid Registration Data' });
        }

        // Check if the email already exists in the database
        /*const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already registered' });
        }*/

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        await newUser.save();
        await sendRegistrationNotification(req.body.email, req.body.firstName, req.body.lastName);

        res.status(201).send({ message: 'Registered Successfully' });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).send({ error: 'Error in registration', details: error.message });
    }
};



module.exports.loginUser = (req,res) => {

    if(req.body.email.includes("@")){

        return User.findOne({ email : req.body.email })
        .then(result => {

            if(result == null){

                // return res.send("No Email Found");
                return res.status(404).send({ error: 'No Email Found'
            });

            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if (isPasswordCorrect) {

                    return res.status(200).send({ access : auth.createAccessToken(result)});

                } else {
                    console.error()
                    // return res.send("Email and password do not match");
                    return res.status(401).send({ error: 'Email and password do not match'
                });

                }

            }

        })
        .catch(err => {
            console.error('Error in Find' , err);   
            res.status(500).send({ error: 'Error in Find' });
        });

    } else {

        return res.status(400).send({ error: 'Invalid in email'
    });

    }
};



module.exports.getProfile = (req, res) => {
 
    return User.findById(req.user.id)
    .then(user => {

        if(user) {
            user.password = "";
            return res.status(200).send({user});
        } else {
            return res.status(404).send({ error: 'User not found' });
        }
        
    })
    .catch(err => {
        console.error('Failed to fetch user profile' , err);    
        res.status(500).send({ error: 'Failed to fetch user profile' });
    });
};


module.exports.updateUserToAdmin = async (req, res) => {

    let updateToAdmin = {
        isAdmin: true
    }

    if(req.user.isAdmin === true){
        return User.findByIdAndUpdate(req.params.userId, updateToAdmin)
        .then(admin => {
            if (admin) {
                return res.status(200).send({
                    message: 'Successfully updated as admin', 
                    updateUserToadmin: admin 
                });
            } else {
                return res.status(404).send({ error: 'Id not found' });
            }
        })
        .catch(err => {
            console.error('Failed to update as an admin', err);  
            res.status(500).send({ error: 'Failed to update as an admin' });
        });
    }
    else{
        return res.status(403).send(false);
    }
};


module.exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id, email } = req.user; // Extracting user ID and email from the authorization header

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Updating the user's password in the database
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        // Sending the update password notification
        await sendUpdatePasswordNotification(email);

        // Sending a success response
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

