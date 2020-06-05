var iconv = require('iconv-lite');
const JISencoding = require('encoding-japanese');
const MOV_CS_RIGHT = [0x09];
const MOV_CS_LEFT = [0x08];
const MOV_CS_UP = [0x1F, 0x0A];
const MOV_CS_DOWN = [0x0A];
const MOV_CS_RIGHT_MARGIN = [0x1f, 0x0d];
const MOV_CS_LEFT_MARGIN = [0x0d];
const MOV_CS_HOME = [0x0B];
const MOV_CS_BOTTOM = [0x1f, 0x42];
const MOV_CS_TO_XY = [0x1f, 0x24];
const CLEAR_DISPLAY = [0x0C];
const CLEAR_CS_LINE = [0x18];
const BRIGHTINESS_ADJ = [0x1f, 0x58];
const BLINK_DISPLAY = [0x1f, 0x45];
const INITIALIZE = [0x1b, 0x40];
const SELECT_CODETABLE = [0x1b, 0x74,0x00];
const SELECT_CHARSET = [0x1b, 0x52,0x00];
const SET_REVERSE = [0x1f, 0x72];
const OVERWRITE_MODE = [0x1f, 0x01];
const SCROLL_MODE_VERTICAL = [0x1f, 0x02];
const SCROLL_MODE_HORI = [0x1f, 0x03];

const SELFTEST = [0x1f, 0x40];
const SET_TIME = [0x1f, 0x54,0x00,0x00];
const DISPLAY_TIME_CONTINU = [0x1f, 0x55];
const SET_CS_ONOFF = [0x1f, 0x43];
const DISPLAY_PERIOD = [0x1f, 0x2e];
const DISPLAY_COMMA = [0x1f, 0x2c];
const DISPLAY_SEMICOLON = [0x1f, 0x3b];
const DEF_DOWNLOAD_CHAR = [0x1b, 0x26, 0x01, 0x20, 0x01];
const DELETE_DOWNLOAD_CHAR = [0x1b, 0x3f, 0x020];
const SELECT_DOWNLOAD_CHAR = [0x1b, 0x25, 0x00];
const SELECT_DEVICE = [0x1b, 0x3d, 0x00];
const DEFINE_USER_FONT = [0x1b, 0x26, 0x00];
const SET_MACRO_DEFINE = [0x1f, 0x3a];
const EXE_QUIT_MACRO = [0x1f, 0x5e, 0x00, 0x00];
const PERIPHERAL_DEVICE = [0x1B, 0x3D, 0x01];

// function AppendBuffer(bb1, bb2) {
//     var buf = Buffer.concat([bb1, bb2]);
//     return buf;
// };

// var USB_CDC= require('./Usb_CDC.js');
var WP = require('./WP_Global.js');

//-----------------------
function _Device(n) {
    var b = Array.from(PERIPHERAL_DEVICE);
    b[2]=parseInt(n);
    return [b,'selece device: '+n];
}
function _MoveCS_right() {
    var b = Array.from(MOV_CS_RIGHT);
    return [b,'move cursor to right'];
}
function _MoveCS_left() {
    var b = Array.from(MOV_CS_LEFT);
    return [b,'move sursor to left'];
}
function _MoveCS_up() {
    var b = Array.from(MOV_CS_UP);
    return [b,'move cs up'];
}
function _MoveCS_down() {
    var b = Array.from(MOV_CS_DOWN);
    return [b,'move cs down'];
}
function _MoveCS_left_margin() {
    var b = Array.from(MOV_CS_LEFT_MARGIN);
    return [b,'move cs to left margine'];
}
function _MoveCS_right_margin() {
    var b = Array.from(MOV_CS_RIGHT_MARGIN);
    return [b,'move cs to right margine'];
}
function _MoveCS_home() {
    var b = Array.from(MOV_CS_HOME);
    return [b,'move cs to home'];
}
function _MoveCS_bottom() {
    var b = Array.from(MOV_CS_BOTTOM);
    return [b,'move cs to bottom'];
}
function _MovCS_to_XY(x, y) {
    var nx = x % 256;
    var ny = y % 256;
    if (nx > 20) nx = 20;
    else if (nx < 1) nx = 1;
    if (ny > 2) ny = 2;
    else if (ny < 1) ny = 1;
    var b = Array.from(MOV_CS_TO_XY);
    b.push(nx);
    b.push(ny);
    return [b,'move cs to '+x+':'+ y];
}
function _ClearDisplay() {
    var b = Array.from(CLEAR_DISPLAY);
    return [b,'clear display'];
}
function _Initilal() {
    var b = Array.from(INITIALIZE);
    return [b,'initial'];
}
function _SetCursorOnOff(n) {
    var b = Array.from(SET_CS_ONOFF);
    b.push(n);
    return [b,'set curse: '+n];
}
function _SetKanjiMode(){
    // var b = [0x1f, 0x28, 0x44, 0x03, 0x00, 0x04, 0x04, 0x10];
    var b = [0x1f, 0x28, 0x47, 0x02, 0x00, 0x60, 0x01];
    return  [b,'Set Kanji Mode'];
}
function _SetSjisMode(){
    var b = [0x1f, 0x28, 0x47, 0x02, 0x00, 0x61, 0x31];
    return  [b, 'Set Shift-JIS Mode'];
}
function _SetJisMode(){
    var b = [0x1f, 0x28, 0x47, 0x02, 0x00, 0x61, 0x30];
    return  [b, 'Set JIS Mode'];
}
function _WriteString(fontcode,str){
    var new_str;
    switch (fontcode) {
        case 'TAIWAN BIG-5':
        case 'TAIWAN BIG-5E':
            new_str = iconv.encode(Buffer.from(str), 'Big5');
            break;
        case 'CHINA GB18030':
            new_str = iconv.encode(Buffer.from(str), 'gb18030');
            break;
        case 'CHINA GB2312':
            new_str = iconv.encode(Buffer.from(str), 'gb2312');
            break;
        case 'KANJI JAPANESE':
            var buf = Buffer.from(str);
            if (WP.JIS_Mode == 'sjis')
                new_str = JISencoding.convert(buf, 'SJIS', 'UTF8');
            else if (WP.JIS_Mode == 'jis')
                new_str = JISencoding.convert(buf, 'EUCJP', 'UTF8');

            break;
        case 'KOREA KSC5601':
            new_str = iconv.encode(Buffer.from(str), 'ksc5601');
            break;
        case 'UNICODE':
           new_str = iconv.encode(Buffer.from(str), 'UTF8');
            break;
        default:
            // var result=[];
            // for (var i = 0; i < str.length; i += 2) {
            //     result.push(parseInt(str.substr(i, 2), 16));
            // }
            new_str= str;
            break;
    }
    return[new_str,'write string: '+ str];
}
function _Clear_CS_line() {
    var b = Array.from(CLEAR_CS_LINE);
    return [b,'clear cursor line'];
}
function _BrightnessAdj(bt) {
    var n = bt % 256;
    if (n > 4) n = 4;
    else if (n < 1) n = 1;
    var b = Array.from(BRIGHTINESS_ADJ);
    b.push(n);
    return [b,'brightness: '+n];
}
function _Blink(rate) {
    var b = Array.from(BLINK_DISPLAY);
    b.push(parseInt(rate));
    return [b,'blinking: '+rate];
}
function _SetCodeTable(n) {
    var b = Array.from(SELECT_CODETABLE);
    b[2]=n;
    return [b,'set codepage: '+n];
}
function _ShowCodePage(idx) {
    var b = Array.from(MOV_CS_TO_XY);
    b.push(1);
    b.push(1);
    switch (idx) {
        case 1:
            b.push(0x38, 0x30, 0x48, 0x20); //'80H '
            b.push(0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F);
            b.push(0x39, 0x30, 0x48, 0x20); //'90H '
            b.push(0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F);
            break;
        case 2:
            b.push(0x41, 0x30, 0x48, 0x20); //'A0H '
            b.push(0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAE, 0xAF);
            b.push(0x42, 0x30, 0x48, 0x20); //'B0H '
            b.push(0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBE, 0xBF);
            break;
        case 3:
            b.push(0x43, 0x30, 0x48, 0x20); //'C0H '
            b.push(0xC0, 0xC1, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF);
            b.push(0x44, 0x30, 0x48, 0x20); //'D0H '
            b.push(0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xd7, 0xd8, 0xd9, 0xdA, 0xDB, 0xDC, 0xDD, 0xDE, 0xDF);
            break;
        case 4:
            b.push(0x45, 0x30, 0x48, 0x20); //'E0H '
            b.push(0xE0, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xEF);
            b.push(0x46, 0x30, 0x48, 0x20); //'F0H '
            b.push(0xF0, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF);
            break;
    }
    return [b,'show codepage: '+idx];
}
function _SetCharset(cs) {
    var b = Array.from(SELECT_CHARSET);
    b[2] =parseInt(cs);
    b.push(parseInt(cs)+0x30);
    b.push(0x3D, 0x20, 0x23, 0x24, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x60, 0x7b, 0x7c, 0x7d, 0x7e);
    b.push(0x0d,0x0a); 
    return [b,'set charset: '+cs];
}
function _SetReverse(n) {
    var data = n.charCodeAt(0) - 0x30;
    var b = Array.from(SET_REVERSE);
    b.push(data);
    return [b,'reverse: '+n];
}
function _OverWriteMode() {
    var b = Array.from(OVERWRITE_MODE);
    return [b,'overwrite mode'];
}
function _SetScrollVertical() {
    var b = Array.from(SCROLL_MODE_VERTICAL);
    return [b,'vertical scroll'];
}
function _SetScrollHori() {
    var b = Array.from(SCROLL_MODE_HORI);
    return [b,'Horizontal scroll'];
}
function _SelfTest() {
    var b = Array.from(SELFTEST);
    return [b,'self test'];
}
function _SetTime(str) {
    var d = str.split(":");
    var h = parseInt(d[0]);
    var m = parseInt(d[1]);
    var b = Array.from(SET_TIME);
    b[2]= h;
    b[3]=m;
    return [b,'set time '+h+':'+m];
}
function _DisplayTime() {
    var b = Array.from(DISPLAY_TIME_CONTINU);
    return [b,'display time'];
}
function _StartStop_Macro() {
    var b = Array.from(SET_MACRO_DEFINE);
    return [b,'start/stop macro: '];
}
function _Set_Macro(n,m) {
    var b = Array.from(EXE_QUIT_MACRO);
    b[2]= parseInt(n);
    b[3]= parseInt(m);
    return [b,'set macro: '+n+','+m];
}

function _ReadFontCode(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x45];
    return [b,'Read Font Code'];
}
function _ReadBootVer(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x40];
    return [b,'Read Boot Version'];
}
function _ReadFirmwareVer(){
    const b =  [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x41];
    return [b,'Read FW Version'];
}
function _ReadManufacture(){
    const b =   [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x42];
    return [b,'Read Manufacture'];
}
function _ReadPname(){
    const b =   [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x43];
    return [b,'Read Product Name'];
}
function _ReadSerial(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x44];
    return [b,'Read Serial Number'];
}
function _WriteManufacture(str){
    const b = [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x00];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Manufacture : '+str];
}
function _WritePname(str){
    const b =  [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x01];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Pname : '+str];
}
function _WriteSerialNumber(str){
    const b =  [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x02];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Serial : '+str];
}
function _DefineWindow(data) {
    //wno, m1, m2, x, y, size_x, size_y
    var wno = parseInt(data.wno);
    var mode = _GetWindowMode(data.m); ; //= parseInt(data.m);
    var bkg = parseInt(data.bkg);
    var x = parseInt(data.x);
    var y= parseInt(data.y);
    var size_x = parseInt(data.sx);
    var size_y = parseInt(data.sy);
     
    // US (D  Function 1:
    //-- 1F 28 44 0D 00 01 wno m1 m2 2 xL xH yL yH dxL dxH dyL dyH
   
    var xL, xH, yL, YH, dxL, dxH, dyL, dyH;
    xL = x % 256;
    xH = x >> 8;
    yL = y % 256;
    yH = y >> 8;
    dxL = size_x % 256;
    dxH = size_x >> 8;
    dyL = size_y % 256;
    dyH = size_y >> 8;
    if (wno > 4) wno = 4;
    var b = [0x1F, 0x28, 0x44, 0x0D, 0x00, 0x01, wno, mode, bkg, 2, xL, xH, yL, yH, dxL, dxH, dyL, dyH];
    return [b,'define win: '+wno];
}
function _SelectWindow(data) {
    // US (D function 4: 
    // -- 1F 28 44 03 00 04 wno  m
    var  wno= parseInt(data.wno);
    // var mode = _GetWindowMode(data.m); //= parseInt(data.m);
    var mode =0;
     
    if (mode == 48) mode = 0;
    if (mode == 49) mode = 1;
    if (wno > 4) return null;
    var b = [0x1F, 0x28, 0x44, 0x03, 0x00, 0x04, wno, mode];
    return [b,'select windows: '+wno+',+mode'];
}
function _SetWindow(data) {
    // US (D function 3: 
    //-- 1F 28 44 04 00 03  m1 m2 02 
    // var mode=parseInt(data.m);
    var mode = _GetWindowMode(data.m);
    var bkg= parseInt(data.bkg);
    var b = [0x1F, 0x28, 0x44, 0x04, 0x00, 0x03, mode, bkg, 0x02];
    return [b,'set window: '+mode+','+bkg];
}
function _GetWindowMode(inmode){
    let mode;
    switch(inmode){
        case "NOCHANGE":
            mode =0;
            break;
        case "GRAPHIC":
            mode =65;
            break;
        case "32X4":
            mode =97;
            break;
        case "42X8":
            mode =98;
            break;
        case "32X3":
            mode =99;
            break;  
        case "32X2":
            mode =100;
            break; 
        case "20X2":
        default:
            mode =101;
            break;       
    }
    return mode;
}
//-----------
module.exports = {
    _CmdParser: function(data){
        var msg;
        switch(data.cmd){
            case 'INITIAL':
            case 'initial':
                msg = WP.WriteStream( _Initilal(),data); 
                break;
            case 'CLEAR':
                msg = WP.WriteStream( _ClearDisplay(),data); 
                break;
            case 'SELFTEST':
            case 'selftest':
            
                msg = WP.WriteStream( _SelfTest(),data); 
                break;
            case  'SETFONT':
                    msg = WP.WriteStream( _SetKanjiMode(),data); 
                    WP.Font_code = data.p1;
                    break;
            case 'SETSJIS':
                msg = WP.WriteStream( _SetSjisMode(),data); 
                WP.JIS_Mode = 'sjis';
                break;
            case 'SETJIS':
                msg = WP.WriteStream( _SetJisMode(),data); 
                WP.JIS_Mode = 'jis';
                break;
            case 'INPUT_TEXT':
                msg = WP.WriteStream( _WriteString(WP.Font_code,data.p1),data); 
                break;
            case 'SET_REVERSE':
                msg = WP.WriteStream( _SetReverse(data.p1),data); 
                break;
            case 'CLR_CS_LINE':
                msg = WP.WriteStream( _Clear_CS_line(),data);
                break;
            case 'BRIGHTNESS':
                msg = WP.WriteStream( _BrightnessAdj(data.p1),data);
                break;
            case 'BLINK':
                msg = WP.WriteStream( _Blink(data.p1),data);
                break;
            case 'OVERWRITE':
                msg = WP.WriteStream( _OverWriteMode(),data);
                break;
            case 'VSCROLL':
                msg = WP.WriteStream( _SetScrollVertical(),data);
                 break;
             case 'HSCROLL':
                msg = WP.WriteStream( _SetScrollHori(),data);
                break;
            case 'SET_TIME':
                msg = WP.WriteStream( _SetTime(data.p1),data);
                break;
            case 'DISPLAY_TIME':
                msg = WP.WriteStream( _DisplayTime(),data);
                break;
            case 'CS_ONOFF':
                msg = WP.WriteStream( _SetCursorOnOff(data.p1),data); 
                break;
            case 'MV_CS_XY':
                msg = WP.WriteStream( _MovCS_to_XY(data.p1,data.p2),data);  
                break;
            case 'MV_CS_R':
                msg = WP.WriteStream( _MoveCS_right(),data);  
                break;
            case 'MV_CS_L':
                msg = WP.WriteStream( _MoveCS_left(),data); 
                break;
            case 'MV_CS_UP': 
                msg = WP.WriteStream( _MoveCS_up(),data); 
                break;
            case 'MV_CS_DN':   
                msg = WP.WriteStream( _MoveCS_down(),data); 
                break;
           case 'MV_CS_LM': 
                msg = WP.WriteStream( _MoveCS_left_margin(),data); 
                break;
            case 'MV_CS_RM':   
                msg = WP.WriteStream( _MoveCS_right_margin(),data); 
                break;
            case 'MV_CS_H': 
                msg = WP.WriteStream( _MoveCS_home(),data); 
                break;
            case 'MV_CS_B':
                msg = WP.WriteStream( _MoveCS_bottom(),data);  
                break;
            case 'CODEPAGE':  
                msg = WP.WriteStream( _SetCodeTable(data.p1),data); 
                break;
            case 'SHOW_CP':
                msg = WP.WriteStream( _ShowCodePage(data.p1),data);   
                break;
            case 'SET_CHARSET':
                msg = WP.WriteStream( _SetCharset(data.p1),data);   
                break;
            case 'STARTSTOP_MACRO': 
                msg = WP.WriteStream( _StartStop_Macro(data.p1),data);   
                break;
            case 'SET_MACRO':  
                msg = WP.WriteStream( _Set_Macro(data.p1,data.p2),data);    
                break;
            case 'PERIPHERAL_DEVICE':
                msg = WP.WriteStream( _Device(data.p1),data);  
                break;
            case 'RDFONTCODE':  
                WP.RcvState = WP.STATE_READ_FONTCODE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadFontCode(data.p1),data);  
                break;
            case 'RDBOOT':
                WP.RcvState = WP.STATE_READ_BOOT;  
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id:data.id});
                msg = WP.WriteStream( _ReadBootVer(data.p1),data);  
                break;
            case 'RDFW':
                WP.RcvState = WP.STATE_READ_FW; 
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id:data.id});
                msg = WP.WriteStream( _ReadFirmwareVer(data.p1),data);  
                break;
            case 'RDMF':  
                WP.RcvState = WP.STATE_READ_MANUFACTURE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
                msg = WP.WriteStream( _ReadManufacture(),data); 
                break;
            case 'RDPNAME':
                WP.RcvState = WP.STATE_READ_MODELNAME; 
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
                msg = WP.WriteStream( _ReadPname(),data); 
                break;
            case 'RDSERIAL':
                WP.RcvState = WP.STATE_READ_SERIAL;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
                msg = WP.WriteStream( _ReadSerial(),data); 
                break;
            case 'WRMF':  
                msg = WP.WriteStream( _WriteManufacture(data.p1),data);   
                break;
            case 'WRPNAME':   
                msg = WP.WriteStream( _WritePname(data.p1),data);   
                break;
            case 'WRSER':   
                msg = WP.WriteStream( _WriteSerialNumber(data.p1),data);  
                break;
            case 'MULTI_WIN':
                msg={id:data.id};
                Demo_MultiWindows(data);
                break;
            case 'BASIC_WIN':
                msg={id:data.id};
                Demo_BaseWindow(data);
                break;
            case 'BMP_IMG':
                msg={id:data.id};
                Demo_image(data);
                break;
            case 'RASTER_IMG':
                msg={id:data.id};
                Demo_Raster(data);
                break;
            case 'COLUMN_IMG':
                msg={id:data.id};
                Demo_Colimage(data);
                break;
            case 'DEMO_STYLE':
                msg={id:data.id};
                Demo_Style(data);
                break;
            case 'DEMO_LAYOUT':
                msg={id:data.id};
                Demo_Layout(data);
                break;
            case 'DEF_WIN':
                msg = WP.WriteStream( _DefineWindow(data),data);  
                break;
            case 'SEL_WIN':
                msg = WP.WriteStream( _SelectWindow(data),data);  
                break;
            case 'SET_WIN':
                msg = WP.WriteStream( _SetWindow(data),data);  
                break;
            
        }
        // WP.UI_Send('done', {msg:msg, id:data.id});
        WP.UI_Send('done', msg);
    }
}
//----------------
function Demo_MultiWindows(data) {
    var Demo = require('./Democmd.js');
    var wno;
    var mode;
    var x, y, size_x, size_y;
    var b;
    var bkg;
    //--- init -------------
    b = Demo.Set_InitDisplay();
    WP.PortWrite(b,data);
    //---define Windows 1 --------------------------------------
    wno = 1;
    mode = Demo.DISPLAY_MODE_GRAPHIC;
    bkg = Demo.TRANSPARENT;
    x = 0;
    y = 0;
    size_x = 64;
    size_y = 32;
    b = Demo._DefineWindow(wno, mode, bkg, x, y, size_x, size_y);
    WP.PortWrite(b,data);
    //---define windows 2 ---------------------------------------
    wno = 2;
    mode = Demo.DISPLAY_MODE_42X8;
    bkg = Demo.NONETRANSPARENT;
    x = 12;
    y = 1;
    size_x = 31;
    size_y = 6;
    b = Demo._DefineWindow(wno, mode, bkg, x, y, size_x, size_y);
    WP.PortWrite(b,data);
    //---define windows 3 ------------------------------------
    wno = 3;
    mode = Demo.DISPLAY_MODE_32X4;
    bkg = Demo.NONETRANSPARENT;
    x = 9;
    y = 4;
    size_x = 24;
    size_y = 1;
    b = Demo._DefineWindow(wno, mode, bkg, x, y, size_x, size_y);
    WP.PortWrite(b,data);

    //---Display windw 1 String ---------
    wno = 1;
    mode = Demo.FORGROUND_WINDOW;
    b = Demo._SelectWindow(wno, mode);
    WP.PortWrite(b,data);
    mode = Demo.DISPLAY_MODE_NOCHANGE;
    bkg = Demo.TRANSPARENT;
    b = Demo._WindowMode(mode, bkg);
    WP.PortWrite(b,data); 
    // b = '//1234567890abcdefghijklmnopqr//';
    b = '//1234567890abcdefghijklmnopqr//';
    WP.PortWrite(b,data);
    //---Display Win 2 String--------------
    wno = 2;
    bkg = Demo.FORGROUND_WINDOW;
    b = Demo._SelectWindow(wno, bkg);
    b = b.concat(Demo.Move_cs(5, 1));
    WP.PortWrite(b,data);
    // b = 'APPLE';
    b = 'APPLE';
    WP.PortWrite(b,data);
    b = Demo.Move_cs(15, 1);
    WP.PortWrite(b,data);
    // b = '2x @$1.50 $3.00';
    b = '2x @$1.50 $3.00';
    WP.PortWrite(b,data);
    b = Demo.Move_cs(5, 2);
    WP.PortWrite(b,data);
    // b = 'ORANGE';
    b = 'ORANGE';
    WP.PortWrite(b,data);
    b = Demo.Move_cs(15, 2);
    WP.PortWrite(b,data);
    // b = '1x @$1.25 $1.25';
    b = '1x @$1.25 $1.25';
    WP.PortWrite(b,data);
    //---Display Win 3 string----------------
    wno = 3;
    bkg = Demo.BACKGROUND_WINDOWS;
    b = Demo._SelectWindow(wno, bkg);
    b = b.concat(Demo.Move_cs(5, 1));
    WP.PortWrite(b,data);
    // b = 'TOTAL';
    b = 'TOTAL';
    WP.PortWrite(b,data);
    b = Demo.Move_cs(20, 1);
    WP.PortWrite(b,data);
    // b = '$4.25';
    b = '$4.25';
    WP.PortWrite(b,data);

    //--- Select Base window ----------------
    // wno = 0;
    // bkg = WP.FORGROUND_WINDOW;
    // b = WP.Set_SelectWindow(wno, bkg);
    // WP.PortWrite(b);
    // b = WP.Set_MoveWindowPosition(WP.REL_VERTICAL_OFFSET, 64);
    // WP.PortWrite(b);
    // b = WP.Set_MoveWindowPosition(WP.REL_HORIZONT_OFFSET, 20);
    // WP.PortWrite(b);
    // mode = WP.DISPLAY_MODE_20X2;
    // bkg = WP.NONETRANSPARENT;
    // b = WP.Set_WindowMode(mode, bkg);
    // WP.PortWrite(b);
    // b = WP.Move_cs(4, 2);
    // WP.PortWrite(b);
    // // // b = 'WINPOS WD-5000';
    // b = 'WINPOS WD-5000';
    // WP.PortWrite(b);

    //-- select windows 1  & make background & transparent
    // wno = 1;
    // bkg = WP.FORGROUND_WINDOW;
    // b = WP.Set_SelectWindow(wno, bkg);
    // WP.PortWrite(b);
    // mode = WP.DISPLAY_MODE_NOCHANGE;
    // bkg = WP.TRANSPARENT;
    // b = WP.Set_WindowMode(mode, bkg);
    // WP.PortWrite(b);
    // //--- select windows 2 & make background & transparent
    // wno = 2;
    // bkg = WP.FORGROUND_WINDOW;
    // b = WP.Set_SelectWindow(wno, bkg);
    // WP.PortWrite(b);
    // mode = WP.DISPLAY_MODE_NOCHANGE;
    // bkg = WP.TRANSPARENT;
    // b = WP.Set_WindowMode(mode, bkg);
    // WP.PortWrite(b);
    // //--- select windows 3 & make background & transparent
    // wno = 3;
    // bkg = WP.FORGROUND_WINDOW;
    // b = WP.Set_SelectWindow(wno, bkg);
    // WP.PortWrite(b);
    // mode = WP.DISPLAY_MODE_NOCHANGE;
    // bkg = WP.TRANSPARENT;
    // b = WP.Set_WindowMode(mode, bkg);
    // WP.PortWrite(b);
    // //--- select windows 0 ---------------------
    // wno = 0;
    // bkg = WP.FORGROUND_WINDOW;
    // b = WP.Set_SelectWindow(wno, bkg);
    // WP.PortWrite(b);
    // mode = WP.DISPLAY_MODE_NOCHANGE;
    // bkg = WP.TRANSPARENT;
    // b = WP.Set_WindowMode(mode, bkg);
    // WP.PortWrite(b);
}
function Demo_image(data) {
    var b;
    var Demo = require('./Democmd.js');
    //--- Download define image ------
    var fn = 2;
    var imgNo = 1;
    b = Demo.Set_BitImage(fn, imgNo, 32, 32);
    WP.PortWrite(b,data);
    b = Demo.BitImage;
    WP.PortWrite(b,data);
    //---- Display image ---------
    fn = 3;
    b = Demo.Set_BitImage(fn, imgNo, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0);
    WP.PortWrite(b,data);
}
function Demo_BaseWindow() {
    var Demo = require('./Democmd.js');
    var wno;
    var mode;
    var b;
    var bkg;
    //--- Select Base window ----------------
    wno = 0;
    bkg = Demo.BACKGROUND_WINDOW;
    b = Demo.Set_SelectWindow(wno, bkg);
    WP.PortWrite(b);
    // b = WP.Set_MoveWindowPosition(WP.REL_VERTICAL_OFFSET, 64);
    // WP.PortWrite(b);
    // b = WP.Set_MoveWindowPosition(WP.REL_HORIZONT_OFFSET, 20);
    // WP.PortWrite(b);
    mode = Demo.DISPLAY_MODE_20X2;
    bkg = Demo.NONETRANSPARENT;
    b = Demo.Set_WindowMode(mode, bkg);
    WP.PortWrite(b);
    b = Demo.Move_cs(4, 2);
    WP.PortWrite(b);
    b = 'WINPOS WD-5000';
    WP.PortWrite(b);
}
function Demo_Raster() {
    var b;
    var Demo = require('./Democmd.js');
    //-- Display defined raster-type bit image-------
    var fn = 4;
    var imgNo = 48;
    var x = 1;
    var y = 2;
    b = Demo.Set_BitImage(fn, imgNo, x, y, 32, 32);
    WP.PortWrite(b);
    b = Demo.RasterImage;
    WP.PortWrite(b);
}
function Demo_Colimage() {
    var b;
    var Demo = require('./Democmd.js');
    //-- Display defined raster-type bit image-------
    var fn = 5;
    var imgNo = 48;
    var x = 2;
    var y = 2;
    b = Demo.Set_BitImage(fn, imgNo, x, y, 32, 32);
    WP.PortWrite(b);
    b = Demo.ColumnImage;
    WP.PortWrite(b);
}
function Demo_Style() {
    var b;
    var fn;
    var m1;
    var Demo = require('./Democmd.js');
    //----move cs down--------------------------
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = 'EPSON';
    WP.PortWrite(b);
    //-- set character size -------
    fn = 32;
    var x = 2;
    var y = 2;
    b = Demo.Set_SelectCharStyle(fn, x, y);
    WP.PortWrite(b);
    fn = 33; 
    m1 = 1;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    b = 'DM-D500';
    WP.PortWrite(b);
    //--- set character size -----
    fn = 32;
    x = 1;
    y = 1;
    b = Demo.Set_SelectCharStyle(fn, x, y);
    WP.PortWrite(b);
    fn = 33; //!
    m1 = 0;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    //--- reverse -------------------
    fn = 34;
    m1 = 1;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    b = 'SERIES';
    WP.PortWrite(b);
    //--- cancel reverse ------
    fn = 34;
    m1 = 0;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    //--- set font B ------
    fn = 64;
    m1 = 1;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSLeftMost();
    WP.PortWrite(b);
    b = '5x7 Font';
    WP.PortWrite(b);

    //--- set font A ------
    fn = 64;
    m1 = 0;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    b = 'KANJI';
    WP.PortWrite(b);
    fn = 96;
    m1 = 49;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    fn = 97;
    m1 = 48;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    b = [0xa3, 0xcb, 0xa3, 0xc1, 0xa3, 0xce, 0xa3, 0xca, 0xa3, 0xc9];
    WP.PortWrite(b);

}
function Demo_Layout() {
    var b;
    var fn;
    var m1, m2;
    var Demo = require('./Democmd.js');
    //--- init -------------
    b = Demo.Set_InitDisplay();
    WP.PortWrite(b);
    //---Specify Kanji code syatem
    fn = 97;
    m1 = 49; //shift JIS
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    //---Specify Kanji mode and send data
    fn = 96;
    m1 = 49;
    b = Demo.Set_SelectCharStyle(fn, m1);
    WP.PortWrite(b);
    //b = 'EPSON';
    b = 'EPSON';
    WP.PortWrite(b);
    // b = [0xa3, 0xc5, 0xa3, 0xd0, 0xa3, 0xd3, 0xa3, 0xcf, 0xa3, 0xce];
    b = [0x82, 0x64, 0x82, 0x6f, 0x82, 0x72, 0x82, 0x6e, 0x82, 0x6d];
    WP.PortWrite(b);

    //--- Set line spacing fun:A1----
    fn = 32;
    m1 = 4;
    b = Demo.Set_DisplayLayout(fn, m1);
    WP.PortWrite(b);
    //-- set character spacing fun:B1, C1----
    fu = 64;
    m1 = 3;
    m2 = 3;
    b = Demo.Set_DisplayLayout(fn, m1, m2);
    WP.PortWrite(b);
    //--- Set line spacing ----
    fn = 96;
    m1 = 8;
    m2 = 8;
    b = Demo.Set_DisplayLayout(fn, m1, m2);
    WP.PortWrite(b);
    //---move cs & send data -----------
    b = Demo.Move_cs(1, 16);
    WP.PortWrite(b);

    b = 'E';
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = 'P';
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = 'S';
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = 'O';
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSDown();
    WP.PortWrite(b);
    b = 'N';
    WP.PortWrite(b);

    b = [0x82, 0x64];
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSUp();
    WP.PortWrite(b);
    b = [0x82, 0x6f];
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSUp();
    WP.PortWrite(b);
    b = [0x82, 0x72];
    WP.PortWrite(b);
    b = WP.Exec_MoveCSUp();
    WP.PortWrite(b);
    b = [0x82, 0x6e];
    WP.PortWrite(b);
    b = Demo.Exec_MoveCSUp();
    WP.PortWrite(b);
    b = [0x82, 0x6d];
    WP.PortWrite(b);
    //---  Move data in current window Fun:A2
    fn = 33;
    var x1 = 0;
    var y1 = 0;
    var dx = 40;
    var dy = 16;
    var x2 = 216;
    var y2 = 40;
    b = Demo.Set_DisplayLayout(fn, x1, y1, dx, dy, x2, y2);
    WP.PortWrite(b);
}
