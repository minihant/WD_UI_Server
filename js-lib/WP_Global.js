const jwt = require('jsonwebtoken');
exports.STATE_IDLE = 0;
exports.STATE_GETBAUDRATE = 1;
exports.STATE_GETCMDTYPE = 2;
exports.STATE_GETFIRMWARE = 3;
exports.STATE_GETCHARSET = 4;
exports.STATE_DOWNLOADFONT = 5;
exports.STATE_READ_BOOT = 6;
exports.STATE_READ_FW = 7;
exports.STATE_READ_MANUFACTURE = 8;
exports.STATE_READ_MODELNAME = 9;
exports.STATE_READ_SERIAL = 10;
exports.STATE_READ_FONTCODE = 11;
exports.STATE_GETCODEPAGE = 12;
exports.STATE_READ_PRNMODELNAME = 13;
exports.STATE_READ_FLASHID = 14;
exports.RcvState=this.STATE_IDLE;

exports.configuratron = require('configuratron')
    .buildConfiguratron({ filePath: './config.json' });
exports.CONFIG = this.configuratron.getConfig();

exports.CmdType= 'ESC/POS';
exports.comMap = new Map();
exports.ComPortPresent = null;
exports.gMacroStep = "0";
exports.token=null;
exports.ComIsOpen = false;
exports.JIS_Mode = 'sjis';
exports.FrameTimeout = false;
exports.resMsg = '';
// exports.CDC_Port = null;
exports.Font_code = 'sjis'; //'gb2312' , 'KSC5601 , 'sjis' , 'gbk'
// exports.SerialPort = require('serialport');
exports.express = require('express');
exports.app = this.express();
exports.server = require('http').createServer(this.app);
exports.UI_io = require('socket.io').listen(this.server);
exports.IF_server = require('http').createServer(this.app);
exports.IF_io = require('socket.io').listen(this.IF_server);
exports.UIsocket_no=0;
exports.UIsocket = new Map();
exports.connectedDev = new Map();


exports.scanalarm = null;
exports.msg_expire = 'Time Expired, login again!!!';
exports.msg_login = 'Please Login!!';
exports.msg_setcmd = 'You need to Set command Type: '
exports.ExpireTime = '10m';
exports.rcvok = false
exports.deviceID=""; 
exports.device_info = {UI_s:'', IF_s:'',id:'',status:'3',port:'',user:'',pwd:'',loguser:'',token:'',filename:'',web:''};
exports.UI_info= {IF_s: '', id: ''};

exports._delay = function (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
// exports.CheckExpire = function(token){
//     //--- check current token is within valid time ?
//     const nowtoken = this.JwtVerify(token);
//     return nowtoken;
// }
exports.CheckToken= async function(id) {
    var token="";
    for(let[key,obj] of this.connectedDev){
        if(obj.id == id){
            token = obj.token;
            break;
        }
    }
    if(token == "") return null;
    //--- Check need login  ?? 
    if (process.env.LOGIN_CHECK.toUpperCase() != "ENABLE") 
        return EngineeringID;
    else {
        const nowtoken = this.JwtVerify(token);
        return nowtoken;
    }
    
}
exports.UI_Send= function(cmd,msg){
    const io = this.UI_io; 
    const socket = this.connectedDev;
    for(let[key,value] of socket){
        if(value.id == msg.id){
            if(value.UI_s === ''){
                console.log("Error, Socker empty");
            }
            io.to(value.UI_s).emit(cmd,msg);
            break;
        }
    }
}

exports.IF_SocketSend= function(cmd,msg){
    const io = this.IF_io; 
    const socket = this.connectedDev;
    for(let[key,value] of socket){
        if(value.id == msg.id){
            io.to(key).emit(cmd,msg);
            break;
        }
    }
}
exports.WriteStream= function(arr,msg){
    const io = this.IF_io; 
    const socket = this.connectedDev;
    for(let[key,value] of socket){
        if(value.id == msg.id){
            io.to(key).emit('RAW',arr[0]);
            break;
        }
    }
    var msg;
    if( msg ==  '') {
        msg = arr[1];
    }
    return msg;
}
exports.PortWrite= function(buf,msg){
    const io = this.IF_io; 
    const socket = this.connectedDev;
    for(let[key,value] of socket){
        if(value.id == msg.id){
            io.to(key).emit('WRT',buf);
            break;
        }
    }
}

exports.ShowMsg = function(str){
    if (process.env.MSG_DEBUG == "ENABLE"){
        console.log(str);
    }      
}
exports.ConvertTimeStamp= function(timestamp){
    //new Date(1513598707*1000)          // 因為一般 timestamp 取得的是秒數，但要帶入的是毫秒，所以要乘 1000 或者
    let date = new Date(timestamp * 1000)
    dataValues = [
    date.getFullYear(),
    date.getMonth()+1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    ];
    console.log(dataValues);
}
exports.ClearDeviceUISocket = function(targetMap,target_id){
    for(let[key,obj] of targetMap){
        if(obj.id == target_id){
           obj.UI_s = ""; // clear device socket UI_s
           targetMap.set(key,obj);
           break;
        }
    }
}
exports.JwtVerify = function(token, expiretime){
    let _data;
    try{ 
        if(expiretime == undefined){
            _data = jwt.verify(
                token,
                process.env.TOKEN_SECRET
            );
        }else{
            _data = jwt.verify(
                token,
                process.env.TOKEN_SECRET,
                {maxAge: expiretime}
            );
        }
       
    }catch(e)
    {
        console.log(e);
        _data = token;
    }
    return _data;
}
exports.JwtSign = function(data, expiretime){
    const _id = data;
    const _privatekey = process.env.TOKEN_SECRET;
    const _expire = expiretime;
    const token = jwt.sign(_id,_privatekey, _expire) 
    return token;
}