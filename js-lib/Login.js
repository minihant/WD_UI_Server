const WP = require('../js-lib/WP_Global.js');
const emitter = require('../js-lib/emitter.js');
const admin = require('firebase-admin');
const serviceAccount = require("../resource/Fontloader-2f77564fc94c.json"); 
const path = 'gs://fontloader-3a034.appspot.com/'
const colors = require('colors');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: path
});
const bucket = admin.storage().bucket();
 

module.exports = {
    _CheckUser: async function(usr,pwd,device_id){
        // let Base64 = require('js-base64').Base64;
        var str;
        const FirebaseAuth = require('firebaseauth'); // or import FirebaseAuth from 'firebaseauth';
        const firebase = new FirebaseAuth(process.env.FIREBASE_ID);
        let userEmail = WP.JwtVerify(usr);  
        let userPassword = WP.JwtVerify(pwd);  

        if (process.env.LOGIN_CHECK == "ENABLE") {
            //--- Check local user database in .env  
            var obj  =JSON.parse( process.env.VALID_USER);
            if(obj.user.length> 0){
                for(var i=0; i<obj.user.length;i++){
                    var name = obj.user[i].name;
                    var password = obj.user[i].password;
                    if( userEmail === name && userPassword === password){
                        str = 'Login user:'+ name;
                        WP.ShowMsg(str.black.bgYellow);
                        switch(name){
                            case 'hant':
                                WP.ExpireTime = process.env.EXPIRE_TIME_WEEK;
                                process.env.MSG_DEBUG = "ENABLE";
                                process.env.ENGINEERING_MOD = "ON";
                                break;
                            case 'jimmy':
                                WP.ExpireTime = process.env.EXPIRE_TIME_DAY;
                                process.env.MSG_DEBUG = "ENABLE";
                                process.env.ENGINEERING_MOD = "ON";
                                break;
                            case 'winpos':
                                WP.ExpireTime = process.env.EXPIRE_TIME_MINUTE;
                                process.env.MSG_DEBUG = "ENABLE";
                                process.env.ENGINEERING_MOD = "OFF";
                                break;
                            default:
                                WP.ExpireTime = process.env.EXPIRE_TIME_SECOND;
                                process.env.MSG_DEBUG = "DISABLE";
                                process.env.ENGINEERING_MOD = "OFF";
                                break;
                        }
                        str = "expire time = "+WP.ExpireTime;
                        WP.ShowMsg(str.black.bgYellow);      
                        //--- create and assign a JWT token ----
                        const _id = {_id: name};
                        const _privatekey = process.env.TOKEN_SECRET;
                        const _expire = {expiresIn: WP.ExpireTime };
                        const token = WP.JwtSign(_id, _expire);
                        if(token != null) {
                            // res.header('auth-token', token).status(200).send({ "login": req.body.name });
                            str = 'Login : ' + usr;
                            WP.ShowMsg( str.black.bgYellow ); // 登入成功
                            // emitter.eventBus.sendEvent('LoginSuccess', { token: token, id: usr });
                            for(let[key,value] of WP.connectedDev){
                                if(value.id == device_id){
                                    value.user = usr;
                                    value.token = token;
                                    value.loguser = userEmail;
                                    WP.connectedDev.set(key, value);
                                    WP.UI_Send('LoginSuccess', {msg: name, id:value.id});
                                    break;
                                }
                            }
                        }
                        return token;
                    }
                }
            }
            //---- Check firebase user / password  
            firebase.signInWithEmail(userEmail, userPassword, function(err, result){
                if (err){
                    WP.ShowMsg(err.message);
                    // emitter.eventBus.sendEvent('LoginError', err.message);
                    WP.UI_Send('LoginError', {msg:'Wrong user', id:device_id});
                    process.env.MSG_DEBUG = "DISABLE";
                    process.env.ENGINEERING_MOD = "OFF";
                }
                else {
                    //--- Get User information Eample ----
                    // var newtoken = result.token;
                    // firebase.getProfile(newtoken, function(err, result) {
                    //     if (err)
                    //         console.log(err);
                    //     else{
                    //         console.log(result); //array of connected accounts
                    //         console.log(result[0].profileUrls);
                    //     }
                    // });
                    //---Example to get User information -----------------
                    // admin.auth().getUser(result.user.id)
                    //     .then(function(userRecord) {
                    //         // See the UserRecord reference doc for the contents of userRecord.
                    //         console.log('Successfully fetched user data:', userRecord.toJSON());
                    //     })
                    //     .catch(function(error) {
                    //         console.log('Error fetching user data:', error);
                    //     });
                    //-------------------
                    str = 'Login cloudDB: '+ result.user.email;
                    WP.ShowMsg(str.black.bgMagenta);
                    if(result.user.email != null)
                        WP.ExpireTime = process.env.EXPIRE_TIME_DAY;
                    else
                        WP.ExpireTime = process.env.EXPIRE_TIME_MINUTE;
                    str = "expire time = " + WP.ExpireTime;
                    WP.ShowMsg(str.black.bgMagenta);
                    process.env.MSG_DEBUG = "ENABLE";
                    process.env.ENGINEERING_MOD = "ON";
                    //--- create and assign a JWT token -------------------
                    const _id = {_id: result.user.id};
                    const _privatekey = process.env.TOKEN_SECRET;
                    const _expire = {expiresIn: WP.ExpireTime };
                    const token = WP.JwtSign(_id, _expire);
                    if(token != null) {
                        // res.header('auth-token', token).status(200).send({ "login": req.body.name });
                        str = 'Login : ' + userEmail;
                        WP.ShowMsg(str.black.bgMagenta); // 登入成功
                        // emitter.eventBus.sendEvent('LoginSuccess', { token: token , id: usr });
                        for(let[key,obj] of WP.connectedDev){
                            if(obj.id == device_id){
                                obj.user = usr;
                                obj.token = token;
                                obj.loguser = userEmail;
                                WP.connectedDev.set(key, obj);
                                WP.UI_Send('LoginSuccess', {msg: userEmail , id:obj.id});
                                break;
                            }
                        }
                        //---- get firebase DB ---------
                        const db = admin.firestore();
                        const userRef = db.collection('fontloader');
                        //--- find 'uid' in DB ------
                        userRef.where('uid', '==', result.user.id).get()
                            .then(snapshot => {
                                if (snapshot.empty) {
                                    WP.ShowMsg('No matching documents.');
                                    return;
                                }  
                                snapshot.forEach(doc => {
                                    //--- Get expire time ------------
                                    var expireTime = doc.data().expired;
                                    if(expireTime != null){
                                        // WP.ConvertTimeStamp(expireTime);
                                        // WP.ShowMsg('expired time = ' + expireTime);
                                        const dateTime = Date.now();
                                        const nowTime = parseInt(Math.floor(dateTime)/1000);
                                        // WP.ShowMsg('now time = ' + nowTime);
                                        if(nowTime > expireTime){
                                            console.log('DB limit,Time Expire');
                                            msg = 'User DB expired'
                                            emitter.eventBus.sendEvent('LoginError', msg);
                                            process.env.MSG_DEBUG = "DISABLE";
                                            process.env.ENGINEERING_MOD = "OFF";
                                            WP.token = null;
                                            return 
                                        }
                                        //----- Download file from Firebasestore---------------
                                        if(WP.CONFIG.DOWNLOAD_FONT === 'ENABLE'){
                                            var path= process.env.STORAGE_PATH;  
                                            global.filepath = doc.data().filepath.replace(path,"").trim();
                                            bucket.file(global.filepath)
                                                .download({
                                                    destination : './upload/font.Tsk'
                                                }, function(err){
                                                if(err)
                                                    WP.ShowMsg('download file error:'+ err)
                                                else
                                                    WP.ShowMsg('file download: ' + global.filepath );
                                                }
                                            );
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                WP.ShowMsg('Error getting documents', err);
                            }
                        );
                    }
                }    
            });
        } 
        //--- always allow login -------------
        else {
            res.header('auth-token', req.body.name).status(200).send({ "login": req.body.name });
            WP.ShowMsg('Login : ' + req.body.name); // 登入成功
            process.env.MSG_DEBUG = "DISABLE";
            process.env.ENGINEERING_MOD = "OFF";
            // emitter.eventBus.sendEvent('LoginSuccess', { token: req.body.name, id: req.body.name });
            for(let[key,value] of WP.connectedDev){
                if(value.id == req.body.name){
                    value.user = usr;
                    value.token = req.body.name;
                    WP.connectedDev.set(key, value);
                    WP.UI_Send('LoginSuccess', {msg: usr , id:value.id});
                    break;
                }
            }
        }
    }
}