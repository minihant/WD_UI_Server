const WP = require('../js-lib/WP_Global.js');
const router = WP.express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('./validation');
const emitter = require('../js-lib/emitter.js');
const Expire_Interval = '1d'; // expire in 60 seconds or use '1m' , '1h' , '1d'
var ExpireInterval = process.env.EXPIRE_TIME_MINUTE;

//Register
router.post('/register', async(req, res) => {
    // Lets validate the data before we add a user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log('register in');
    //checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // creat new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        console.log('save to DB fail');
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async(req, res) => {
    if (process.env.LOGIN_CHECK.toUpperCase() == "ENABLE") {
        var userEmail = req.body.name;
        var userPassword = req.body.password;
        var obj  =JSON.parse( process.env.VALID_USER);
        if(obj.user.length> 0){
            for(var i=0; i<obj.user.length;i++){
                var name = obj.user[i].name;
                var password = obj.user[i].password;
                if( userEmail === name && userPassword === password){
                    console.log('Localuser login:'+ name);

                    // create and assign a JWT token
                    if(name === 'winpos'){
                        ExpireInterval = process.env.EXPIRE_TIME_MINUTE;
                        process.env.MSG_DEBUG = "ENABLE";
                        process.env.ENGINEERING_MOD = "OFF";
                    }
                    else if(name === 'hant'){
                        ExpireInterval = process.env.EXPIRE_TIME_WEEK;
                        process.env.MSG_DEBUG = "ENABLE";
                        process.env.ENGINEERING_MOD = "ON";
                    }
                    else {
                        ExpireInterval = process.env.EXPIRE_TIME_SECOND;
                        process.env.MSG_DEBUG = "DISABLE";
                        process.env.ENGINEERING_MOD = "OFF";
                    }
                    str = "expire time = "+ExpireInterval;
                    WP.ShowMsg(str.black.bgYellow);
                    const token = jwt.sign(
                                            {_id: name},
                                            process.env.TOKEN_SECRET, 
                                            {expiresIn: ExpireInterval}
                                        )
                    if(token != null) {
                        res.header('auth-token', token).status(200).send({ "login": req.body.name });
                        // console.log(req.body.name + ' Login : ' + token); // 登入成功
                        emitter.eventBus.sendEvent('LoginSuccess', { token: token, id: req.body.name });
                    }
                    return;
                }
            }
        }
        //--- Validate data -----------------------------
        const { error } = loginValidation(req.body);
        if (error) {
            console.log('Validation error');
            emitter.eventBus.sendEvent('ValidError', { p1: error.details[0].message });
            return res.status(400).send(error.details[0].message);
        }
        //---check username
        var user = await User.findOne({ name: req.body.name });
        //console.log('user= ' + req.body.name);
        if (!user) {
            // console.log('name is not found');
            //emitter.eventBus.sendEvent('LoginError', 'UserName not found');
            // return res.status(401).send('username not found !');
            //--- use email as the username and do again !! -----------------------------------
            const email = await User.findOne({ email: req.body.name }); // not in name, check email
            if (!email) {
                emitter.eventBus.sendEvent('LoginError', 'Username not found');
                res.status(401).send('user not found !')
                return;
            }
            user = await User.findOne({ email: req.body.name });
            // console.log('email found :'+req.body.name);
        }
        //---checking if the email is already in the database
        // const email = await User.findOne({ email: req.body.email });
        // if (!email) return res.status(400).send('Email is not found !');

        //-- check Password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(401).send('Invalid password');
        }

        //create and assign a JWT token
        if(user != null)
            ExpireInterval = process.env.EXPIRE_TIME_DAY;
        else
            ExpireInterval = process.env.EXPIRE_TIME_MINUTE;
        console.log("Expire time = "+ExpireInterval);

        const token = jwt.sign(
                                { _id: user.id },
                                process.env.TOKEN_SECRET, 
                                {expiresIn: ExpireInterval}
                            );
        if(token != null) {    
            res.header('auth-token', token).status(200).send({ "login": req.body.name });
            console.log('Login: ' + req.body.name); // 登入成功
            emitter.eventBus.sendEvent('LoginSuccess', { token: token, id: req.body.name });
        }
    } else {
        res.header('auth-token', req.body.name).status(200).send({ "login": req.body.name });
        console.log('Login : ' + req.body.name); // 登入成功
        emitter.eventBus.sendEvent('LoginSuccess', { token: req.body.name, id: req.body.name });
    }

});

module.exports = router;