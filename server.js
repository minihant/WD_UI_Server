/* eslint-disable no-undef */
const fs = require('fs');
var path = require('path');
var WP = require('./js-lib/WP_Global.js');
// var open = require('open');
var fileUpload = require('express-fileupload');
var CONFIG = WP.CONFIG;
var FONT_update_process = false;
// var APP_socket=null;
var tmp_id;
// var tmp_sid;

//--- Https setting -----------------------------------------
//var security = {
//    key: fs.readFileSync('../public/privatekey.pem'),
//    cert: fs.readFileSync('../public/certificate.pem'),
//   rejectUnauthorized: false
//};
//var server_s = require('https').createServer(security,app);
//var io_s = require('socket.io').listen(server_s); 
//server_s.listen(https_port);
// var sleep = require('system-sleep');
//---- Bluetooth serial port function ------------------
//var util = require('util');
//var BluetoothSerialPort = require("bluetooth-serial-port").BluetoothSerialPort;
//var Serial   = new BluetoothSerialPort();

//---Auth router-------------------------------
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//-- Import auth router
const postRoute = require('./routes/posts');
// const mongoDBRoute = require('./routes/auth');
// const firebaseRouter = require('./firebase-admin/admin');
// const apitestRoute = require('./routes/postmanAPI');
const EngineeringID = 'winpos';
dotenv.config();
//--- Data base connect ---------------------------
if (process.env.LOGIN_CHECK.toUpperCase() == "ENABLE") {
    if(process.env.DBTYPE == "MONGODB") {
        // connect to mongoDB
        mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (err) =>{
            if(err)  
                console.log('connect to mongoDB fail!')
            else
                console.log('connect to mongoDB!')
        } );
    }
}
 
//----------------------------------------
// Get Exit signal from Ctrl-C 
//----------------------------------------
// process.on('SIGINT', () => {
//     // WP.CDC_Port.close();
//     WP.server.close(() => {
//       console.log("SIGINT exit Server");
//       process.exit();
//     })
// })
// process.on('SIGTERM', () => {
//     // WP.CDC_Port.close();
//     WP.server.close(() => {
//       console.log("SIGTERM exit Server");
//       process.exit();
//     })
// })
// process.on('SIGQUIT', () => {
//     // WP.CDC_Port.close();
//     WP.server.close(() => {
//       console.log("SIGQUIT exit Server");
//       process.exit();
//     })
// })
// process.on('SIGKILL', () => {
//     // WP.CDC_Port.close();
//     WP.server.close(() => {
//         console.log("SIGKILL exit Server");
//         process.exit();
//     })
// })

//------------------------------------------------------------------------------------
// server.listen(CONFIG.http_port, '127.0.0.1', async function() { // this will allow localhost only
//-------------------------------------------------------------------------------------
WP.server.listen(CONFIG.http_port, async function() { // this allow all web brwoser      
    console.log('server start :'+CONFIG.http_port);
  
});

WP.IF_server.listen(CONFIG.IF_port, async function() { // this allow all web brwoser      
    console.log('IF server start :' + CONFIG.IF_port);
});

//------------------------------------------
// Express Router method 
//-------------------------------------------
// Router Middleware
var router = WP.express.Router();
WP.app.use(WP.express.json());
WP.app.use('/api/posts', postRoute);
WP.app.use(fileUpload());
WP.app.use(WP.express.static(path.join(__dirname, './views')), router);
//-----------------------------------------------
WP.app.post('/Upload', function(req, res) {
    const  nid = req.headers.referer.split('id=')[1];
    if (req.files == null) {
        console.log('No file selected !!!');
        WP.UI_Send('done', {msg:'No file selected !!!',id: nid});
        // return res.redirect('/Tools'+'?'+"id="+nid);
        return res.redirect('back');
    }
    let sampleFile = req.files.sampleFile;
    sampleFile.mv('upload/' + sampleFile.name, async function(err) {
        if (err){
            console.log("move file :%s error",f_name);
            return res.status(500).send(err);
        }
    });
    //---updata file into connection socket-------------------------
    for(let[key,obj] of WP.connectedDev){
        if(obj.id == nid){
            obj.filename = sampleFile.name;
            WP.connectedDev.set(key,obj);
            break;
        }
    }
    console.log("Upload file: "+ sampleFile.name);
    // return res.redirect('/Tools'+'?'+"id="+nid);
    return res.redirect('back');
});
WP.app.post('/FW_upload', function(req, res) {
    var f_name = req.body.fname;
    const  nid = req.headers.referer.split('id=')[1];
    if (f_name == "") {
        console.log('No file selected !!!');
        WP.UI_Send('done', {msg:'No file selected !!!',id: nid});
        // return res.sendStatus(200);
        return res.redirect('back');
    }
    WP.UI_Send('download_start', {id: nid});
    // var f_name = req.files.contex.name;
    // var fdata = req.files.contex.data;  
    
    var fdata = Buffer.from(req.body.contex);
    console.log( "receive file("+ f_name+")"+ " size:"+fdata.length);
    //---updata file into connection socket-------------------------
    for(let[key,obj] of WP.connectedDev){
        if(obj.id == nid){
            obj.filename = f_name;
            WP.connectedDev.set(key,obj);
            //---Send file data to device buffer --------------
            var SYSCMD = require('./js-lib/Syscmd.js');
            var data={cmd:'SENDFILE', fdata:fdata, id:obj.id,type:"FW"};
            SYSCMD._SysCmdParser(data);
            break;
        }
    }
    // return res.sendStatus(200);
    return res.redirect('back');
}); 
 
WP.app.post('/WPFileUpload', function(req, res) {
    const  nid = req.headers.referer.split('id=')[1];
    //------------------------------------------
    if (req.files == null) {
        console.log('No file selected !!!');
        WP.UI_Send('done', {msg:'No file selected !!!',id: nid});
        return res.redirect('back');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    //--- backup file to default filename ----
    // var f_ext = path.extname(sampleFile.name);
    // if (f_ext == '.hex')
    //     f_back = 'fw.hex';
    // else if (f_ext == '.Tsk')
    //     f_back = 'font.Tsk';
    // else if (f_ext == '.bmp')
    //     f_back = 'b0.bmp';
    // sampleFile.mv('upload/' + f_back, async function(err) {
    //     if (err){
    //         console.log("move file :%s error",f_name);
    //         return res.status(500).send(err);
    //     }
    // });
    //--- Use the mv() method to place the file somewhere on your server----
    var f_name = sampleFile.name;
    sampleFile.mv('upload/' + f_name, async function(err) {
        if (err){
            console.log("move file :%s error",f_name);
            return res.status(500).send(err);
        }
        FW_NAME = './upload/' + f_name;
        WP.ShowMsg("File uploaded success !! " + FW_NAME);
        msg = ("File uploaded success !!");
        WP.ShowMsg('file length = ' + sampleFile.size);
    
        //---updata file into connection socket-------------------------
        for(let[key,obj] of WP.connectedDev){
            if(obj.id == nid){
                obj.filename = f_name;
                WP.connectedDev.set(key,obj);
                console.log(FW_NAME);
                //---Send file to device buffer --------------
                var SYSCMD = require('./js-lib/Syscmd.js');
                var data={cmd:'SENDFILE', file:f_name, id:obj.id};
                SYSCMD._SysCmdParser(data);
                break;
            }
        }

        // WP.UI_Send('done', {msg:msg,id: nid});
        // res.redirect('/WPFontloader'+'?'+"id="+nid);
        res.redirect('back');
    });
}); 
 
//----------------------------------
// For POSTMAN API test function
//----------------------------------
WP.app.post('/api/postman', async function(req, res) {
    var POSTAPI = require('./js-lib/postmanAPI.js');
    POSTAPI._PostmanCmdParser(req,res);
});
//----------------------------------
// router function  
//----------------------------------
router.get('/ESCPOS', async function(req, res) {
    //-- check the correct cmdtype -----
    if(WP.CmdType != 'ESC/POS'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'ESC/POS',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/ESCPOS.html'));
    WP.ShowMsg('ESCPOS.html');  
    
});
router.get('/CD5220', async function(req, res) {
    // const  nid = req.headers.referer.split('id=')[1];
    if(WP.CmdType != 'CD5220'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'CD5220',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/CD5220.html'));
    WP.ShowMsg('CD5220.html');
});
router.get('/POS7300', async function(req, res) {
    if(WP.CmdType != 'POS7300'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'POS7300',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- Clear old UI socket in Dvice obj -----
    // WP.ClearDeviceUISocket(WP.connectedDev,req.query.id);
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/POS7300.html'));
    WP.ShowMsg('POS7300.html');
});
router.get('/UTCP', async function(req, res) {
    const  nid = req.headers.referer.split('id=')[1];
    if(WP.CmdType != 'UTC/P'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'UTC/P',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- Clear old UI socket in Dvice obj -----
    // WP.ClearDeviceUISocket(WP.connectedDev,req.query.id);
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/UTC.html'));
    WP.ShowMsg('UTC.html');
});
router.get('/UTC', async function(req, res) {
    if(WP.CmdType != 'UTC/S'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'UTC/S',id:req.query.id});
        res.redirect('back');
        return;
    }
    ///--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- Clear old UI socket in Dvice obj -----
    // WP.ClearDeviceUISocket(WP.connectedDev,req.query.id);
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/UTC.html'));
    WP.ShowMsg('UTC.html');
});
router.get('/Windows', async function(req, res) {
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/Windows.html'));
    WP.ShowMsg('Windows.html');
});
router.get('/AEDEX', async function(req, res) {
    if(WP.CmdType != 'AEDEX'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'AEDEX',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/AEDEX.html'));
    WP.ShowMsg('AEDEX.html');
});
router.get('/WDA5000', async function(req, res) {
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/WDA5000.html'));
    WP.ShowMsg('WDA5000.html');
});
router.get('/ADM788', async function(req, res) {
    if(WP.CmdType != 'ADM788'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'ADM788',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/ADM788.html'));
    WP.ShowMsg('ADM788.html');
});
router.get('/DSP800', async function(req, res) {
    if(WP.CmdType != 'DSP800'){
        WP.UI_Send('Error', {msg:WP.msg_setcmd+'DSP800',id:req.query.id});
        res.redirect('back');
        return;
    }
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/DSP800.html'));
    WP.ShowMsg('DSP800.html');
});
router.get('/Tools', async function(req, res) {
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/Tools.html'));
    WP.ShowMsg("tools.html "+req.query.id);
});
router.get('/WPFontloader', async function(req, res) {
    //--- Check user token --------
    const result = await WP.CheckToken(req.query.id);
    if (result == null) {
        WP.UI_Send('Error', {msg:WP.msg_login,id:req.query.id});
        res.redirect('back');
        return;
    } 
    //--- reload web page ---------
    res.sendFile(path.join(__dirname, './views/WP_Fontloader.html'));
    WP.ShowMsg("WP_Fontloader.html ");
});
// async function WebRedirect(res,msg,nid ){
//     res.redirect('/');
//     await WP._delay(200);
//     WP.UI_Send('Error', {msg:msg,id:nid});
// }
//---------------------------------------------------
// UI socket command set 
//---------------------------------------------------
WP.UI_io.sockets.on('connection', function(socket) {
    // var clientPort = socket.request.connection.remotePort;
    // var clientIP = socket.request.connection.remoteAddress;
    const os = require('os')
    SECOND = 1000
    setInterval(() => {
        var platform = os.platform();
        var totalmem= formatBytes(os.totalmem());
        var freemem= formatBytes(os.freemem());
        var currentdate = new Date();
        var hr = currentdate.getHours().toString().padStart(2, "0");  
        var minute = currentdate.getMinutes().toString().padStart(2, "0");
        var second = currentdate.getSeconds().toString().padStart(2, "0");
        var nowtime = hr + ":" + minute+":"+second;
        socket.emit('statistics', 
            { p1: freemem + '/'+platform , p2:nowtime}
        )
    }, SECOND)
       
    //-----------------------------------------------
    // Socket io function 
    //-----------------------------------------------
    socket.on('NewClient', async function(data) {
        var remoteIP = socket.conn.remoteAddress.replace('::ffff:','');
        console.log("IP address: "+ remoteIP);
        if( remoteIP === '::1' || remoteIP === CONFIG.CONTAINER_IP){
            remoteIP = 'localhost';
        }
        else{
            remoteIP = CONFIG.DNSNAME;
        }
        console.log("new UIsocket coming:(%s) DNS(%s) ",socket.id ,remoteIP);

        //--------------------------
        if(WP.UIsocket.size === 0){
            //--- has many IF connection
            for(let[key,value] of WP.connectedDev){
                    if(value.UI_s === ''){
                        var obj =JSON.parse(JSON.stringify(WP.UI_info));
                        obj.IF_s = value.IF_s;
                        obj.id      = value.id;
                        WP.UIsocket.set(socket.id, obj);
                        value.UI_s = socket.id;
                        WP.connectedDev.set(key,value);
                        console.log("add UI_socket(%s), IF_s(%s), id(%s)" , value.UI_s , value.IF_s , value.id);
                        socket.emit('comstatus', {
                            step: value.status, 
                            id: value.id
                        }); 
                        socket.emit( 'deviceID', {
                            id: value.id, 
                            port: value.port,
                            ver: process.env.APP_VERSION, 
                            loguser: value.loguser,
                            ip:remoteIP
                        });
                        break;
                    }
            }
             
        }
        else{
            //-- have many UI connection
            for(let[key,value] of WP.connectedDev){
                //--- check htis is real new UI socket in -----------
                if(value.UI_s != socket.id && value.UI_s == ''){
                    var obj =JSON.parse(JSON.stringify(WP.UI_info));
                    obj.IF_s = value.IF_s;
                    obj.id      = value.id;
                    WP.UIsocket.set(socket.id, obj);
                    value.UI_s = socket.id;
                    WP.connectedDev.set(key,value);
                    console.log("add UI_socket(%s), IF_s(%s), id(%s)" , value.UI_s , value.IF_s , value.id);
                    //--- send comport status to UI ------
                    socket.emit('comstatus', {
                        step: value.status, 
                        id: value.id
                    }); 
                    //--- Send device status to UI ------
                    socket.emit( 'deviceID',{
                        id: value.id, 
                        port: value.port,
                        ver: process.env.APP_VERSION, 
                        loguser: value.loguser,
                        ip:remoteIP
                    });
                    return;;
                }
            } 
            //---- connection full , not allow new UI connection
            console.log("-----Connection full : "+socket.id);
            socket.emit('LoginError', {msg:'Connection full',id:this.id});
        }
        //-------------------
        // WP.UI_Send( 'macrostep', {msg: WP.gMacroStep,id:value.id});
        
    });
    
    socket.on('disconnect', async function() {
        FONT_update_process = false;

        WP.UIsocket.forEach(function(value,key){
            if(key == socket.id){
                console.log('delete UI_socket(%s)',key);
                WP.UIsocket.delete(key);
                //---- Delete device socket UI_s
                for(let[key2,obj] of WP.connectedDev){
                    if(obj.UI_s == socket.id){
                        obj.UI_s ='';
                        // obj.loguser='';
                        // obj.token ='';
                        WP.connectedDev.set(key2,obj);
                    }
                }
                if(WP.UIsocket.size == 0){
                    // UI socketis empty, close IF socket
                    //TODO
                    console.log("UI socket is empty");
                }
                // tmp_id = value.id;

            } 
        })
    });
    socket.on('reconnect', async function() {
            WP.ShowMsg('reconnect :'+ socket.id);
    });
 
    //------------------------------
    //   RRINTER command  
    //------------------------------
    socket.on('PRN_CMD',async function(data) {
        if(data.id != ""){
            var PRNcmd = require('./js-lib/Prncmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_login, id:data.id});
                return;
            } 
            PRNcmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });   
    //----------------------------------------
    //  System command
    //---------------------------------------
    socket.on('SYS_CMD', async function(data){
        var SYSCMD = require('./js-lib/Syscmd.js');
        if(data.id != ""){
            if(data.cmd != 'GETUSER' && 
                data.cmd != 'OPENPORT' && 
                data.cmd != 'RESTART' &&
                data.cmd != 'CHKUSER' ){
                const result = await WP.CheckToken(data.id);
                if (  result == null) {
                    WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                    return;
                } 
            }
            SYSCMD._SysCmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });

    //------------------------------------------
    //  ESC/POS command process 
    //------------------------------------------
    socket.on('EPOS_CMD',async function(data) {
        if(data.id != ""){
            var EPOScmd =  require('./js-lib/Epsoncmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            EPOScmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });

    //-----------------------------------
    //    CD5220 command 
    //------------------------------------
    socket.on('CD5220_CMD',async function(data) {
        if(data.id != ""){
            var CD5220CMD = require('./js-lib/CD5220cmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            CD5220CMD._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
    //-------------------------------------
    //   POS7300 
    //-------------------------------------
    socket.on('POS7300_', async function(data) {
        if(data.id != ""){
            var POS7300cmd=require('./js-lib/POS7300cmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            POS7300cmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
    //------------------------------------------
    //  UTC command process 
    //------------------------------------------
    socket.on('UTC_', async function(data) {
        if(data.id != ""){
            var UTCcmd = require('./js-lib/UTCcmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            UTCcmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
     
    //---- AEDEX commnad socket -----------------------------
    socket.on('AEDEX_', async function(data) {
        if(data.id != ""){
            var AEDEXcmd = require('./js-lib/AEDEXcmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            AEDEXcmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
    
    //------ ADM788 ------------------------------
    socket.on('ADM788_', async function(data) {
        if(data.id != ""){
            var ADM788cmd = require('./js-lib/ADM788cmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            ADM788cmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
    
    //------- DSP800 ---------------------
    socket.on('DSP800_',async function(data) {
        if(data.id != ""){
            var DSP800cmd = require('./js-lib/DSP800cmd.js');
            const result = await WP.CheckToken(data.id);
            if (  result == null) {
                WP.UI_Send('LoginError', {msg:WP.msg_expire, id:data.id});
                return;
            } 
            DSP800cmd._CmdParser(data);
        }
        else{
            socket.emit('LoginError', {msg:WP.msg_login,id:this.id});
        }
    });
    
});
WP.UI_io.sockets.on('connect',function(socket){
    console.log('connect: '+socket.id);
    //  tmp_id = socket.id;
});
//---------------------------------------------------
// Device socket command set 
//---------------------------------------------------
WP.IF_io.sockets.on('connection', function(skt_IF) {
    //-----------------------------------------------
    skt_IF.on('NewClient', async function(data) {
        var info =JSON.parse(JSON.stringify(WP.device_info));
        info.IF_s = skt_IF.id;
        info.id = data.id;
        //---------------------------------------
        // const usr = WP.JwtVerify(data.usr);
        // const pwd = WP.JwtVerify(data.pwd);
        //---------------------
        info.user = data.usr;
        info.pwd = data.pwd;
        WP.connectedDev.set(skt_IF.id, info);
        //----------------------------
        console.log("add connectedDevice("+ skt_IF.id + "): " , data.id); 
    });
    skt_IF.on('disconnect', async function() {
        FONT_update_process = false;
        for(let[key,value] of WP.connectedDev){
            if(key == skt_IF.id){
                console.log('delete IF_socket('+ key +'): '+ skt_IF.id);
                WP.connectedDev.delete(key);
                break;
            }   
        }
    });
    skt_IF.on('reconnect', async function() {
            WP.ShowMsg('reconnect :'+ skt_IF.id);
    });
    skt_IF.on('comadd',async function(data){
        for(let[key,value] of WP.connectedDev){
            if(value.id == data.id){
                value.port = data.sel;
                WP.connectedDev.set(key,value);
                break;
            }
        }
        console.log("com find: "+data.hid +' at: '+data.id); 
        WP.UI_Send('comadd', data);
    });
    skt_IF.on('comstatus',async function(data){
        for(let[key,value] of WP.connectedDev){
            if(value.id == data.id){
                console.log("comstatus: "+data.step+"(" + value.IF_s+")"+ "device= "+data.id); 
                value.status = data.step;
                WP.connectedDev.set(key,value);
                WP.UI_Send('comstatus', {step:value.status, id: value.id}); 
                break;
            }
        }

    }); 
    skt_IF.on('done',async function(data){
        // console.log(data); 
        WP.UI_Send('done', data);
    });

    skt_IF.on('ACK',async function(){
        WP.rcvok= true; 
    });
    skt_IF.on('NAK',async function(){
        FONT_update_process = false; 
    });
    skt_IF.on('flashid',async function(data){
        WP.UI_Send('flashid', data);
    });
    skt_IF.on('rcvpname',async function(data){
        WP.UI_Send('rcvpname', data);
    });
    skt_IF.on('fontcode',async function(data){
        WP.UI_Send('fontcode', data);
    }); 
    skt_IF.on('datain',async function(data){
        WP.UI_Send('done', data);
    });
    skt_IF.on('GETFILE',async function(data){
        var FontName = './resource/font/'+ data.msg;
        if (fs.existsSync(FontName)) {
            var FontData = fs.readFileSync(FontName);
            console.log("file size = "+ FontData.length );
            WP.IF_SocketSend('FSIZE',{msg:FontData.length, id: data.id});
            var BufferSize = FontData.length;
            var PktSize= 1024;
            var BufferIndex = 0;
            while (BufferSize > 0)
            {
                SendCnt = BufferSize - PktSize;
                if (SendCnt <= 0) SendCnt = BufferSize; 
                else SendCnt = PktSize;
                var SendBuf = Buffer.alloc(SendCnt);
                // copy a page data form file buffer
                FontData.copy(SendBuf,0,BufferIndex, SendCnt+BufferIndex);
                BufferIndex += SendCnt;
                BufferSize -= SendCnt;
                
                // WP.PortWrite(SendBuf,data);
                WP.IF_SocketSend('FPACK',{msg:SendBuf, id: data.id});
                // console.log("send: " + SendBuf.length); 
                WP._delay(50);
            }
            WP.IF_SocketSend('PACK_FINISH',{msg:SendBuf, id: data.id});
            console.log("send file Finish !!!"); 
           
        }
        
    }); 
    skt_IF.on('progress',async function(data){
        WP.UI_Send('progress', {msg:data.msg, id:data.id});
    });
    skt_IF.on('download_finish',async function(data){
        WP.UI_Send('download_finish', {id: data.id});
        console.log("download finish !!!");
        //----------------------------------------
        for(let[key,obj] of WP.connectedDev){
            if(obj.id == data.id){
                const check = await WP.CheckToken(data.id);
                if (  check != null) {
                    if( data.type === "FW"){
                        WP.IF_io.to(key).emit('WRT_FW');
                    }
                    else if(data.type === "FONT"){
                        WP.IF_io.to(key).emit('WRT_FONT');
                    }
                    
                }
                else{               
                    msg = 'Time Expire ,Please Login again';
                    console.log(msg);
                }
                break;
            }
        }

         
    });
    skt_IF.on('write_finish',async function(data){
        WP.UI_Send('write_finish', {id: data.id});
        console.log("Write finish !!!");
   
    });

});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]+' '
}

//---------------------------------------------
//   emitter function  
//--------------------------------------------
var emitter = require('./js-lib/emitter.js');
emitter.eventBus.on('LoginSuccess', function(data) {
    //--- Update valid_user -------------------------
    WP.token = data.token;
    WP.UI_Send('LoginSuccess', {id:data.id});

});
emitter.eventBus.on('ValidError',  function(data) {
    WP.token = null;
    WP.UI_Send('Error', {data:msg,id:data.id});
});
emitter.eventBus.on('LoginError',function(data) {
    WP.token = null;
    WP.UI_Send('LoginError', {data:msg,id:data.id});
});

//----------------------------------
//     API middleware 
//-----------------------------------
// function StringToByteArray(hexString) {
//     var result = [];
//     for (var i = 0; i < hexString.length; i += 2) {
//         result.push(parseInt(hexString.substr(i, 2), 16));
//     }
//     return result;
// }

/*
! hello
? hi
TODO
*/