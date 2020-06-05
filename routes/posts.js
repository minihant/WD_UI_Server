
const WP = require('../js-lib/WP_Global.js');
const router = WP.express.Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const emitter = require('../js-lib/emitter.js');

router.get('/', verify, async(req, res) => {
    res.send(req.user);
    const findusr = await User.findOne({ _id: req.user });
    console.log('found user in dB :' + findusr.name);

    emitter.eventBus.sendEvent('LoginSuccess', { token: req.user, id: req.body.name });
});

module.exports = router;