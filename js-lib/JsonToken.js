const jwt = require('jsonwebtoken');

//--- JWT option define -------------------------
// * algorithm (default: HS256)
// * expiresIn (n seconds) or "2 days", "10h", "7d"
// * notBefore
// * audience
// * issuer
// * jwtid
// * subject
// * noTimestamp
// * header
// * keyid
// * mutatePayload
const Expire_Interval = '1m'; // expire in 60 seconds or use '1m' , '1h' , '1d'

module.exports = {
    JsonTokenSign: function(name, interval){
        try{
            var token =jwt.sign(
                {
                    _id: name,
                },
                process.env.TOKEN_SECRET, 
                {expiresIn: interval }
            )
            return token;
        }catch(e){
            console.log(e);
            return null;
        }
    },

    JsonTokenVerify: function(token){
        try{ 
            const nowtoken = jwt.verify(
                token,
                process.env.TOKEN_SECRET,
                process.env.TOKEN_OPTION
            );
            // convert_timeStamp(nowTokenTime.exp);
            // convert_timeStamp(nowTokenTime.iat);
            return nowtoken; 
        }catch(e)
        {
            console.log(e);
            return null;
        }
    }
}
 