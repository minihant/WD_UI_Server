const INITIALIZE = [0x04, 0x01, 0x25, 0x17];
const SELF_TEST = [0x04, 0x01, 0x40, 0x17];
const SEL_ICS = [0x04, 0x01, 0x49, 0x31, 0x17]; //04 01 49 n 17 
const MV_CS_TO_X = [0x04, 0x01, 0x50, 0x31, 0x17]; //04 01 50 n 17 ( 0x31<= n<= 0x58)
const CLR_RANGE = [0x04, 0x01, 0x43, 0x31,0x31, 0x17]; 
const SHOW_SAVE_DATA = [0x04,0x01,0x44,0x31,0x31,0x17];
const BRIGHTNESS = [0x04, 0x01, 0x41, 0x32, 0x17];
const BLINK = [0x04, 0x01, 0x46, 0x00, 0x17];
const DEVICE = [0x04, 0x01, 0x3D, 0x31, 0x17]; 
const SAVE_LAYER = [0x04, 0x01, 0x53, 0x31, 0x17];

//-------------
var WP = require('./WP_Global.js');
function _INIT(){
    var b = Array.from(INITIALIZE);
    return [b,'initial'];
}
function _SELFTEST(){
    var b = Array.from(SELF_TEST);
    return [b,'selftest'];
}
function _SEL_ICS(n){
    var b = Array.from(SEL_ICS);
    b[3] =  n.charCodeAt(0);
    return [b,'Internal charset set: '+n];
}
function _MV_CS_TO_X(n){
    var b = Array.from(MV_CS_TO_X);
    var x= parseInt(n)+0x30;
    b[3]=x;
    return [b,'move cursor to: '+x];
}
function _CLR_RANGE(n,m){
    var nn = parseInt(n);
    var mm = parseInt(m);
    var b = Array.from(CLR_RANGE);
    b[3]= nn + 0x30;
    b[4] = mm + 0x30;
    return [b,'clear range '+n+'~'+m];
}
function _BRIGHTNESS(n){
    var b = Array.from(BRIGHTNESS);
    var x= n.charCodeAt(0);
    if( x >= 0x34) x= 0x34;
    if(x <= 0x31) x =0x31;
    b[3] = x;
    return [b,'brightness: '+n];
}
function _BLINK(n){
    var b = Array.from(BLINK);
    b[3] = n;
    return [b,'blinking: '+n];
}
function _DEVICE(n){
    var b = Array.from(DEVICE);
    var x= n.charCodeAt(0);
    if( x >= 0x32) x= 0x32;
    if(x <= 0x31) x =0x31;
    b[3] = x;
    return [b,'select device: '+n];
}
function _SAVE_LAYER(n){
    var b = Array.from(SAVE_LAYER);
    var nn = parseInt(n);
    if(nn  < 1) nn=1;
    if(nn >3) nn =3;
    b[3] = nn+0x30;
    return [b, 'save layer: '+n];
}
function _SHOW_SAVE_DATA(n,m){
    var b = Array.from(SHOW_SAVE_DATA);
    var nn = parseInt(n);
    var mm= parseInt(m);
    if(nn< 1) nn=1;
    if(nn > 7) nn=7;;
    if(mm< 1) mm=1;
    if(mm > 7) mm=7;
    b[3]= nn+0x30;
    b[4] = mm+0x30 ;
    return [b,'show save data '+n+'~'+m];
}
module.exports = {
    _CmdParser(data){
        var msg;
        switch(data.cmd){
            case 'INITIAL':
                msg=WP.WriteStream( _INIT(),data);
                break;
            case 'SELFTEST':
                msg=WP.WriteStream( _SELFTEST(),data);
                break;
             case 'BLINK':
                msg=WP.WriteStream( _BLINK(data.parm),data);
                break;
            case 'DEVICE':
                msg=WP.WriteStream( _DEVICE(data.parm),data);
                break;
            case 'CLR_RANGE':
                msg=WP.WriteStream( _CLR_RANGE(data.p1,data.p2),data);
                break;
            case 'SAVE_LAYER':
                msg=WP.WriteStream( _SAVE_LAYER(data.parm),data);
                break;
            case 'SHOW_SAVE_DATA':
                msg=WP.WriteStream( _SHOW_SAVE_DATA(data.p1,data.p2),data);
                break;
            case 'SEL_ICS':
                msg=WP.WriteStream( _SEL_ICS(data.parm),data);
                break;
            case 'BRIGHTNESS':
                msg=WP.WriteStream( _BRIGHTNESS(data.parm),data);
                break;
            case 'MV_CS':
                msg=WP.WriteStream( _MV_CS_TO_X(data.parm),data);
                break;
        }
        WP.UI_Send('done', {msg:msg,id:data.id}); 
    }
}