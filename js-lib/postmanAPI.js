var WP = require('./WP_Global.js');
var SYSCMD = require('./Syscmd.js');
var EPOScmd =  require('./Epsoncmd.js');
// var CD5220CMD = require('./CD5220cmd.js');
// var USB_CDC= require('./Usb_CDC.js');
//--------------------
function StringToByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return result;
}
function _RAWBUFFER(buf) {
    var buf = StringToByteArray(buf);
    WP.PortWrite(buf);
}
function _HexString(str) {
    var b=[];
    var hexString = str.replace(/[\x2c,\x20,\x0d,\x0a]/g,'');
    for (var i = 0; i < hexString.length; i += 2) {
        b.push(parseInt(hexString.substr(i, 2), 16));
    }
    return [b, 'send Hex data'];
}
module.exports = {
    _PostmanCmdParser: async function(req,res){
        const cmd = req.body.cmd;
        const data = req.body;
        var msg;
        var resp = 'ok';
        WP.ShowMsg('API_cmd : ' + cmd);
        switch (cmd) {
            case 'restart':
                SYSCMD._SysCmdParser(data);
                break;
            case 'initial':
            case 'clear':
            case 'selftest':
                EPOScmd._CmdParser(data); 
                break;
            case 'hexdata':
                WP.ShowMsg(' : ' + data.p1);
                WP.WriteStream( _HexString(data.p1),data);  
                break;
            // case 'selftest':
            //     WP.WriteStream(EPOScmd._SelfTest(),data); 
            //     break;
            // case 'ststring':
            //     WP.WriteStream(CD5220CMD._WriteString(WP.Font_code,  data.parm),data);
            //     break;
            // case 'stfontmode':
            //     WP.WriteStream(EPOScmd._SetKanjiMode(),data); 
            //     break;
            // case 'stcmdtype':
            //     WP.WriteStream(SYSCMD._Restart(),data);
            //     break;
            // case 'showfwversion':
            //     WP.WriteStream(SYSCMD._ShowFWVersion(),data);
            //     break;
            // case 'stnowtime':
            //     WP.WriteStream(EPOScmd._SetTime(data.parm),data);
            //     break;
            // case 'showtime':
            //     WP.WriteStream(EPOScmd._DisplayTime(),data);
            //     break;
            // case 'stcodetb':
            //     WP.WriteStream(CD5220CMD._SetCodeTable(data.parm),data);
            //     break;
            // case 'selIchart':
            //     WP.WriteStream(EPOScmd._SetCharset(data.parm),data); 
            //     break;
            // case 'selIcharacter':
            //     WP.WriteStream(CD5220CMD._SetCharset(data.parm),data);
            //     break;
            // case 'setcharacterset':
            //     WP.WriteStream(EPOScmd._SetCharset(data.parm),data); 
            //     break;
            // case 'selcodepage':
            //     WP.WriteStream(CD5220CMD._ShowCodePage(data),data);
            //     break;
            // case 'stbrigtiness':
            //     WP.WriteStream(CD5220CMD._BrightnessAdj(data.parm),data);
            //     break;
            // case 'stblink':
            //     WP.WriteStream(EPOScmd._Blink(data.parm),data);
            //     break;
            // case 'stoverwrite':
            //     WP.WriteStream(CD5220CMD._SetOverWriteMode(),data);
            //     break;
            // case 'stvscroll':
            //     WP.WriteStream(CD5220CMD._SetScrollVertical(),data);
            //     break;
            // case 'sthscroll':
            //     WP.WriteStream(CD5220CMD._SetScrollHori(),data);
            //     break;
            // case 'stcs':
            //     WP.WriteStream(CD5220CMD._SetCursorOnOff(data.parm),data);
            //     break;
            // case 'mvcs2xy':
            //     WP.WriteStream(CD5220CMD._MovCS_to_XY(data.X,data.Y),data);
            //     break;
            // case 'mvcshome':
            //     WP.WriteStream(EPOScmd._MoveCS_home(),data); 
            //     break;
            // case 'mvcsend':
            //     WP.WriteStream(EPOScmd._MoveCS_bottom(),data); 
            //     break;
            // case 'mvcsup':
            //     WP.WriteStream(EPOScmd._MoveCS_up(),data); 
            //     break;
            // case 'mvcsleft':
            //     WP.WriteStream(EPOScmd._MoveCS_leff(),data); 
            //     break;
            // case 'mvcsright':
            //     WP.WriteStream(CD5220CMD._MoveCS_Right(),data);
            //     break;
            // case 'mvcsdown':
            //     WP.WriteStream(EPOScmd._MoveCS_down(),data); 
            //     break;
            // case 'mvcslmost':
            //     WP.WriteStream(EPOScmd._MoveCS_left_margin(),data); 
            //     break;
            // case 'mvcsrmost':
            //     WP.WriteStream(EPOScmd._MoveCS_right_margin(),data); 
            //     break;
            // case 'streverse':
            //     WP.WriteStream(EPOScmd._SetReverse(data.parm),data); 
            //     break;
            // case 'hexdata':
            //     _RAWBUFFER(data.parm);
            //     console.log('hexdata : ' + data.parm);
            //     break;
            // case 'test':
            //     API_TEST(data);
            //     break;
            
            //     //----- Read function -----------------
            // case 'rdmf':
            //     global.WP.RcvState = WP.STATE_READ_MANUFACTURE;
            //     msg = WP.WriteStream(EPOScmd._ReadManufacture(),data); 
            //     WP.ShowMsg(msg);
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     WP.resMsg = '';
            //     resp = WP.resMsg;
            //     break;
            // case 'rdbootv':
            //     WP.RcvState = WP.STATE_READ_BOOT;   
            //     msg = WP.WriteStream(EPOScmd._ReadBootVer(data.parm),data);  
            //     WP.ShowMsg(msg);
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     resp = WP.resMsg;
            //     break;
            // case 'rdfwv':
            //     WP.RcvState = WP.STATE_READ_FW;   
            //     msg = WP.WriteStream(EPOScmd._ReadFirmwareVer(data.parm),data);
            //     WP.ShowMsg(msg);
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     resp = WP.resMsg;
            //     break;
            // case 'rdpname':
            //     WP.RcvState = WP.STATE_READ_MODELNAME;  
            //     msg = WP.WriteStream(EPOScmd._ReadPname(),data); 
            //     WP.ShowMsg(msg);
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     resp = WP.resMsg;
            //     break;
            // case 'rdserial':
            //     WP.RcvState = WP.STATE_READ_SERIAL;
            //     msg = WP.WriteStream(EPOScmd._ReadSerial(),data); 
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     resp = WP.resMsg;
            //     break;
            // case 'rdfontcode':
            //     WP.RcvState = WP.STATE_READ_FONTCODE;
            //     msg = WP.WriteStream(EPOScmd._ReadFontCode(data.parm),data);  
            //     WP.ShowMsg(msg);
            //     WP.resMsg = '';
            //     await WP._delay(200);
            //     resp = WP.resMsg;
            //     break;
            //     //---- Write function -----------------
            // case 'wrmf':
            //     msg= WP.WriteStream(EPOScmd._WriteManufacture(data.parm),data);
            //     return;
            // case 'wrpname':
            //     msg = WP.WriteStream(EPOScmd._WritePname(data.parm),data);   
            //     break;
            // case 'wrserial':
            //     msg = WP.WriteStream(EPOScmd._WriteSerialNumber(data.parm),data);  
            //     break;
            default:
                // WP.WriteStream(SYSCMD._Restart(),data);
                res.status(400).send('cmd not support !!');
                return;
        }
        //---- Send response to client -----------------
        try {
        //-- Check the request is from postman ??
        if (req.rawHeaders[8] != "PostMan-Token") {
            WP.UI_Send('done', {msg:msg,id:data.id});
        }
        msg = "{\"" + cmd + "\": \"" + resp + "\"}";
        res.status(200).send(msg);
        // WP.ShowMsg(msg);
        } catch (err) {
        console.log('API test fail');
        res.status(400).send(err);
        }
    }
}