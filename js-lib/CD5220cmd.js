const OVERWRITE_MODE = [0x1B, 0x11];
const SCROLL_MODE_VERTICAL = [0x1B, 0x12];
const SCROLL_MODE_HORI = [0x1B, 0x13];
const WR_STRING_UP_LINE = [0x1B, 0x51, 0x41];
const WR_STRING_BOTTOM_LINE = [0x1B, 0x51, 0x42];
const UPLINE_SCROLL = [0x1B, 0x51, 0x44];
const MOV_CS_LEFT = [0x08];
const MOV_CS_RIGHT = [0x09];
const MOV_CS_UP = [0x1b, 0x5b, 0x41];
const MOV_CS_DOWN = [0x0A];
const MOV_CS_HOME = [0x0b];
const MOV_CS_LEFT_MARGIN = [0x0d];
const MOV_CS_LEFT_MARGIN_II = [0x1B, 0x5b, 0x4c];
const MOV_CS_RIGHT_MARGIN = [0x1B, 0x5b, 0x52];
const MOV_CS_BOTTOM = [0x1B, 0x5b, 0x4b];
const MOV_CS_TO_XY = [0x1B, 0x6c];
const INITIALIZE = [0x1B, 0x40];
const CLEAR_DISPLAY = [0x0c];
const CLEAR_CS_LINE = [0x18];
const BRIGHTINESS_ADJ = [0x1B, 0x2a,0x04];
const SET_CS_ONOFF = [0x1B, 0x5f];
const SELECT_CHARSET = [0x1B, 0x66];
const SELECT_CODETABLE = [0x1B, 0x63];
const SELECT_DEVICE= [0x1B,0x3D]

//--------------------------
// var USB_CDC= require('./Usb_CDC.js');
var WP = require('./WP_Global.js');

//---------------------------------
function _SetOverWriteMode() {
    var b = Array.from(OVERWRITE_MODE);
    return [b,'Overwrite'];
}
function _SetScrollVertical() {
    var b = Array.from(SCROLL_MODE_VERTICAL);
    return [b,'Vertical Scroll'];
}
function _SetScrollHori() {
    var b = Array.from(SCROLL_MODE_HORI);
    return [b,'Horizontal Scroll'];
}
function _Initial() {
    var b =  Array.from(INITIALIZE);
    return [b,  'initial display'];
}
function _ClearDisplay() {
    var b = Array.from(CLEAR_DISPLAY);
    return [b,'Clear Display'];
}
function _WriteLine1(data) {
   var b =  Array.from(WR_STRING_UP_LINE);
    for (let i = 0; i < data.length; i++) {
        b.push(data.charCodeAt(i));
    }
    b.push(0x0d);
    var msg= 'write Line 1: '+data;
    return [b,msg];
}
function _WriteLine2(data) {
    if (data.length > 20) return null;
    var b = Array.from(WR_STRING_BOTTOM_LINE);
    for (let i = 0; i < data.length; i++) {
        b.push(data.charCodeAt(i));
    }
    b.push(0x0d);
    var msg= 'write Line 2: '+data;
    return [b,msg];
}

function _WriteStrScroll(str) {
    var b = Array.from(UPLINE_SCROLL);
    for (let i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    b.push(0x0d);
    return [b,'write line1 & scroll: '+str];
}
function _SetCursorOnOff(n) {
    var b = Array.from(SET_CS_ONOFF);
    b.push(n);
    return [b,'Set cursor : '+n];
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
    return [b,'move cs to '+nx+':'+ny];
}
function _MoveCS_Right() {
    var b = Array.from(MOV_CS_RIGHT);
    return [b,'move cs to right'];
}
function _MoveCS_Left() {
    var b = Array.from(MOV_CS_LEFT);
    return [b,'move cs to left'];
}
function _MoveCS_Up() {
    var b = Array.from(MOV_CS_UP);
    return [b,'move cs up'];
}
function _MoveCS_Down() {
    var b = Array.from(MOV_CS_DOWN);
    return [b,'move cs down'];
}
function _MoveCS_Left_Margin() {
    var b = Array.from(MOV_CS_LEFT_MARGIN);
    return [b,'move cs to left most'];
}
function _MoveCS_Right_Margin() {
    var b = Array.from(MOV_CS_RIGHT_MARGIN);
    return [b,'move cs to right most'];
}
function _MoveCS_Home() {
    var b = Array.from(MOV_CS_HOME);
    return [b,'move cs to Home'];
}
function _MoveCS_Bottom() {
    var b = Array.from(MOV_CS_BOTTOM);
    return [b,'move cs to bottom'];
}
function _ClearCS_Line() {
    var b = Array.from(CLEAR_CS_LINE);
    return [b,'clear cursor line message'];
}
function _BrightnessAdj(bt) {
    var n = parseInt(bt);
    if (n > 4) n = 4;
    else if (n < 1) n = 1;
    var b = Array.from(BRIGHTINESS_ADJ);
    b[2]=n;
    return [b,'brightness: '+n];
}
function DeleteDownloadChar(n) {
    var nn = n % 256;
    if (nn > 32) nn = 32;
    var b = Array.from(DELETE_DOWNLOAD_CHAR);
    b.push(n);
    return [b,'delete download char'];
}
function _SetCharset(cs) {
    var b = Array.from(SELECT_CHARSET);
    b.push(cs.charCodeAt(0));
    b.push(cs.charCodeAt(0));
    b.push(0x3D, 0x20, 0x23, 0x24, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x60, 0x7b, 0x7c, 0x7d, 0x7e);
    b.push(0x0d,0x0a); 
    return [b,'set charset: '+cs];
}
function _ShowCodePage(idx) {
    var b = Array.from(MOV_CS_TO_XY);
    b.push(1);
    b.push(1);
    switch (idx) {
        case "P1":
            b.push(0x38, 0x30, 0x48, 0x20); //'80H '
            b.push(0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F);
            b.push(0x39, 0x30, 0x48, 0x20); //'90H '
            b.push(0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F);
            break;
        case "P2":
            b.push(0x41, 0x30, 0x48, 0x20); //'A0H '
            b.push(0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAE, 0xAF);
            b.push(0x42, 0x30, 0x48, 0x20); //'B0H '
            b.push(0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBE, 0xBF);
            
            break;
        case "P3":
            b.push(0x43, 0x30, 0x48, 0x20); //'C0H '
            b.push(0xC0, 0xC1, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xCB, 0xCC, 0xCD, 0xCE, 0xCF);
            b.push(0x44, 0x30, 0x48, 0x20); //'D0H '
            b.push(0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xd7, 0xd8, 0xd9, 0xdA, 0xDB, 0xDC, 0xDD, 0xDE, 0xDF);
            break;
        case "P4":
            b.push(0x45, 0x30, 0x48, 0x20); //'E0H '
            b.push(0xE0, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xEF);
            b.push(0x46, 0x30, 0x48, 0x20); //'F0H '
            b.push(0xF0, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF);
            break;
        default:
            break;
    }
    
    return [b,'show codepage: '+idx];
}
function _SetCodeTable(cb) {
    var b = Array.from(SELECT_CODETABLE);
    b.push(cb.charCodeAt(0));
    return [b,'set code table: '+cb];
}
function _SelectDevice(n) {
    var b = Array.from(SELECT_DEVICE);
    b.push(n);
    return [b,'select device: '+n];
}
function _WriteString(fontcode,str){
    switch (fontcode) {
        case 'TAIWAN BIG-5':
        case 'TAIWAN BIG-5E':
            str = iconv.encode(Buffer.from(str), 'Big5');
            break;
        case 'CHINA GB18030':
            str = iconv.encode(Buffer.from(str), 'gb18030');
            break;
        case 'CHINA GB2312':
            str = iconv.encode(Buffer.from(str), 'gb2312');
            break;
        case 'KANJI JAPANESE':
            var buf = Buffer.from(str);
            if (JIS_Mode == 'sjis')
                str = JISencoding.convert(buf, 'SJIS', 'UTF8');
            else if (JIS_Mode == 'jis')
                str = JISencoding.convert(buf, 'EUCJP', 'UTF8');
            break;
        case 'KOREA KSC5601':
            data.parm = iconv.encode(Buffer.from(str), 'ksc5601');
            break;
        case 'UNICODE':
            // data.parm = iconv.encode(Buffer.from(data.parm), 'utf16');
            break;
        default:
            break;
    }
    return [str, 'write string: '+ str];
} 

//--------------------------
module.exports = {
    _CmdParser: function(data){
        var msg;
        switch(data.cmd){
            case 'INITIAL':
                msg = WP.WriteStream(  _Initial(),data);
                break;
            case 'CLEAR':
                msg = WP.WriteStream(  _ClearDisplay(),data);
                break;
            case 'CLR_CS_LINE':
                msg = WP.WriteStream(  _ClearCS_Line(),data);
                break;
            case 'BRIGHTNESS':
                msg = WP.WriteStream(  _BrightnessAdj(data.p1),data);
                break;
            case 'OVERWRITE':
                msg = WP.WriteStream(  _SetOverWriteMode(),data);
                break;
            case 'VSCROLL':
                msg = WP.WriteStream(  _SetScrollVertical(),data);
                break;
            case 'HSCROLL':
                msg = WP.WriteStream(  _SetScrollHori(),data);
                break;
            case 'CS_ONOFF':
                msg = WP.WriteStream(  _SetCursorOnOff(data.p1),data);
                break;
            case 'MV_CS_XY':
                msg = WP.WriteStream(  _MovCS_to_XY(data.p1,data.p2),data);
                break;
            case 'MV_CS_R':
                msg = WP.WriteStream(  _MoveCS_Right(),data);
                break;
            case 'MV_CS_L':
                msg = WP.WriteStream(  _MoveCS_Left(),data);
                break;
            case 'MV_CS_U':
                msg = WP.WriteStream(  _MoveCS_Up(),data);
                break;
            case 'MV_CS_D':
                msg = WP.WriteStream(  _MoveCS_Down(),data);
                break;
            case 'MV_CS_LM':
                msg = WP.WriteStream(  _MoveCS_Left_Margin(),data);
                break;
            case 'MV_CS_RM':
                msg = WP.WriteStream(  _MoveCS_Right_Margin(),data);
                break;
            case 'MV_CS_H':
                msg = WP.WriteStream(  _MoveCS_Home(),data);
                break;
            case 'MV_CS_B':
                msg = WP.WriteStream(  _MoveCS_Bottom(),data);
                break;
            case 'CHARSET':
                msg = WP.WriteStream(  _SetCharset(data.p1),data);
                break;
            case 'CODETABLE':
                msg = WP.WriteStream(  _SetCodeTable(data.p1),data);
                break;
            case 'SHOW_CP':
                msg = WP.WriteStream(  _ShowCodePage(data.p1),data);
                break;
            case 'WRITE_LINE1':
                msg = WP.WriteStream(  _WriteLine1(data.p1),data);
                break;
            case 'WRITE_LINE2':
                msg = WP.WriteStream(  _WriteLine2(data.p1),data);
                break;
            case 'LINE1_SCROLL':
                msg = WP.WriteStream(  _WriteStrScroll(data.p1),data);
                break;
            case 'INPUT_STRING':
                msg = WP.WriteStream(  _WriteString(WP.Font_code, data.p1),data);
                break;
            case 'PERIPHERAL_DEVICE':
                msg = WP.WriteStream(  _SelectDevice(data.p1),data);
                break;
        }
        // WP.UI_Send('done', {msg:msg,id:data.id});
        WP.UI_Send('done', msg);
    }
}
 