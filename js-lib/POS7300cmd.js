const WR_STRING_UPPER_LINE = [0x1B, 0x46, 0x41];
const WR_STRING_LOWER_LINE = [0x1B, 0x46, 0x42];
const UPPERLINE_SCROLL_CONTINUE = [0x1B,0x46,0x44];
const BOTTOMLINE_SCROLL_CONTINUE = [0x1B,0x46,0x4F];
const MOV_CS_TO_XY = [0x1B, 0x50, 0x01,0x01];
const SET_CS_ONOFF = [0x1B, 0x5f,0x00];
const OVERWRITE_MODE = [0x1B, 0x11];
const VERTICAL_SCROLL_MODE = [0x1B, 0x12];
const HORIZONTAL_SCROLL_MODE = [0x1B, 0x13];
const INITIALIZE = [0x1B, 0x40];
const VERTICAL_UPPER_SCROLL_CONTINUE = [0x1F, 0x01,0x01];
const VERTICAL_DOWN_SCROLL_CONTINUE = [0x1F, 0x02,0x01];
const SET_BLINKING_LINE = [0x1F, 0x11,0x31];
const CLR_BLINKING_LINE = [0x1F, 0x12,0x31];
const BLINK = [0x1F, 0x45, 0x00];
const MOV_CS_UP = [0x00, 0x48];
const MOV_CS_LEFT = [0x00, 0x4B];
const MOV_CS_RIGHT = [0x00, 0x4D];
const MOV_CS_DOWN = [0x00, 0x50];
const MOV_CS_LEFT_MARGIN = [0x00, 0x47];
const MOV_CS_RIGHT_MARGIN = [0x00, 0x4F];
const BACKSPACE = [0x08];
const HT = [0x09];
const LF = [0x0A];
const HOME = [0x0B];
const CLR = [0x0C];
const CR = [0x0D];
const CAN = [0x18];
const PERIPHERAL_DEVICE = [0x1B, 0x3D, 0x01];
const SELFTEST = [0x1F, 0x40];
const DISPLAY_TIME =[0x1F, 0x54, 0x00, 0x00];
const SHOW_TIME =[0x1F, 0x55];
const BRIGHNTESS=[0x1F, 0x58,0x04];
const SET_REVERSE=[0x1f, 0x72,0x00];
const DISPLAY_POSITION=[0x10,0x00];
const WINDOW_RANGE=[0x1B, 0x57, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01];
const ICHAR = [0x1B, 0x52,0x00];
const CODEPAGE = [0x1B, 0x74,0x00];
//---------------------------
// var USB_CDC= require('./Usb_CDC.js');
var WP = require('./WP_Global.js');

//---------------------------
function _UpperLine(str) {
    var b = Array.from(WR_STRING_UPPER_LINE);
    for (let i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    b.push(0x0d);
    return [b,'write upper line string: '+str];
}
function _BottomLine(data) {
    var b = Array.from(WR_STRING_LOWER_LINE);
    for (let i = 0; i < data.length; i++) {
        b.push(data.charCodeAt(i));
    }
    b.push(0x0d);
    return [b,'write bottom line string: '+data];
}
function _UpperLineScrollContinue(data) {
    var b = Array.from(UPPERLINE_SCROLL_CONTINUE);
    for (let i = 0; i < data.length; i++) {
        b.push(data.charCodeAt(i));
    }
    b.push(0x0d);
    return [b,'upper line scroll:'+data];
}
function _ButtomLineScrollContinue(data) {
    var b = Array.from(BOTTOMLINE_SCROLL_CONTINUE);
    for (let i = 0; i < data.length; i++) {
        b.push(data.charCodeAt(i));
    }
    b.push(0x0d);
    return [b,'bottom line scroll:'+data];
}
function _MovCS_to_XY(x, y) {
    var b = Array.from(MOV_CS_TO_XY);
    var nx = parseInt(x);
    var ny = parseInt(y);
    if (nx > 20) nx = 20;
    else if (nx < 1) nx = 1;
    if (ny > 2) ny = 2;
    else if (ny < 1) ny = 1;
    b[2]=nx;
    b[3]=ny;
    return [b,'move cs to '+x+','+y];
}
function _SetCursorOnOff(n) {
    var b = Array.from(SET_CS_ONOFF);
    if(n > 0)
        b[2] =1;
    return [b,'cursor ON/OFF: '+n];
}
function _MoveCS_UP() {
    var b = Array.from(MOV_CS_UP);
    return [b,'move cs up'];
}
function _MoveCS_LEFT(data) {
    var b = Array.from(MOV_CS_LEFT);
    return [b,'move cs left'];
}
function _MoveCS_RIGHT(data) {
    var b = Array.from(MOV_CS_RIGHT);
    return [b,'move cs right'];
}
function _MoveCS_DOWN(data) {
    var b = Array.from(MOV_CS_DOWN);
    return [b,'move cs down'];
}
function _MoveCS_LeftMost(data) {
    var b = Array.from(MOV_CS_LEFT_MARGIN);
    return [b,'move cs to left margine'];
}
function _MoveCS_RightMost(data) {
    var b = Array.from(MOV_CS_RIGHT_MARGIN);
    return [b,'move cs to right margine'];
}
function _MoveCS_Home(data) {
    var b = Array.from(HOME);
    return [b,'move cs to home'];
}
function _CR(data) {
    var b = Array.from(CR);
    return [b,'carriage return'];
}
function _BackSpace(data) {
    var b = Array.from(BACKSPACE);
    return [b,'backspace'];
}
function _HorizontalTab(data) {
    var b = Array.from(HT);
    return [b,'Horizontal Tab'];
}
function _LineFeed(data) {
    var b = Array.from(LF);
    return [b,'line feed'];
}
function _Initial(data) {
    var b = Array.from(INITIALIZE);
    return [b,'initial'];
}
function _ClearDisplay(data) {
    var b = Array.from(CLR);
    return [b,'clear display'];
}
function _Overwrite(data) {
    var b = Array.from(OVERWRITE_MODE);
    return [b,'over write'];
}
function _VerticalScroll(data) {
    var b = Array.from(VERTICAL_SCROLL_MODE);
    return [b,'vertical scroll'];
}
function _HorizontalScroll(data) {
    var b = Array.from(HORIZONTAL_SCROLL_MODE);
    return [b,'horizontal scroll'];
}
function _Blink(n) {
    var b = Array.from(BLINK);
    b[2]=parseInt(n);
    return [b,'blink: '+n];
}
function _SetBlinkLine(n) {
    var b = Array.from(SET_BLINKING_LINE);
    b[2]=n;
    return [b,'set blinking line: '+n];
}
function _ClrBlinkLine(n) {
    var b = Array.from(CLR_BLINKING_LINE);
    b[2]=n;
    return [b,'clear blinking line: '+n];
}
function _VscrollUp(n) {
    var b = Array.from(VERTICAL_UPPER_SCROLL_CONTINUE);
    b[2]=n;
    return [b,'vertical scroll upper: '+n];
}
function _VscrollDown(n) {
    var b = Array.from(VERTICAL_DOWN_SCROLL_CONTINUE);
    b[2]=n;
    return [b,'vertical scroll down: '+n];
}
function _Brightness(n) {
    var b = Array.from(BRIGHNTESS);
    b[2]=parseInt(n);
    return [b,'brightness: '+n];
}
function _Device(n) {
    var b = Array.from(PERIPHERAL_DEVICE);
    b[2]=parseInt(n);
    return [b,'select device: '+n];
}
function _ClrCSLine() {
    var b = Array.from(CAN);
    return [b,'clear cursor Line'];
}
function _SelfTest() {
    var b = Array.from(SELFTEST);
    return [b,'self test'];
}
function _SetTime(str) {
    var d = str.split(":");
    var h = parseInt(d[0]);
    var m = parseInt(d[1]);
    var b = Array.from(DISPLAY_TIME);
    b[2]=h;
    b[3]=m;
    return [b,'set time '+h +':'+m];
}
function _ShowTime() {
    var b = Array.from(SHOW_TIME);
    return [b,'show time'];
}
function _SetReverse(n) {
    var b = Array.from(SET_REVERSE);
    b[2]=parseInt(n);
    return [b,'reverse: '+n];
}
function _DisplayPosition(n) {
    var b = Array.from(DISPLAY_POSITION);
    b[1]=parseInt(n)-1;
    return [b,'display position: '+n];
}
function _WindwoRange(wno,set,x1,y1,x2,y2){
    var b = Array.from(WINDOW_RANGE);
    var s_no = wno ;
    var s_set ;
    var s_x1 = parseInt(x1);
    var s_x2 = parseInt(x2);
    var s_y1 = parseInt(y1);
    var s_y2 = parseInt(y2);
    if(s_no >4) s_no=4;
    else if(s_no<1) s_no=1;
    if(set == true ) 
        s_set=1;
    else 
        s_set=0;
    if(s_x1<1)  s_x1=1;
    else if(s_x1>20) s_x1=20;
    if(s_x2> s_x1) s_x2=s_x1;
    else if(s_x2> 20) s_x2=20;
    if(s_y1<1)  s_y1=1;
    else if(s_y1>2) s_y1=2;
    if(s_y2> s_y1) s_y2=s_y1;
    else if(s_y2> 2) s_y2=2;
    b[2]= s_no;
    b[3]= s_set;
    b[4]= s_x1;
    b[5]= s_y1;
    b[6]= s_x2;
    b[7]= s_y2;
    return [b,'window('+wno+'):'+s_set+ ' Range:('+x1+','+y1+'~'+x2+','+y2+')'];
}
function _Ichar(n) {
    var b = Array.from(ICHAR);
    b[2]=parseInt(n);
    return [b,'set international char set: '+n];
}
function _CodePage(n) {
    var b = Array.from(CODEPAGE);
    b[2]=parseInt(n);
    return [b,'set code page: '+n];
}
function _WriteString(data) {
    if (data.length > 40) return null;
    // var b ;
    // for (let i = 0; i < data.length; i++) {
    //     b.push(data.charCodeAt(i));
    // }
    var msg= 'write String: '+data;
    return [data,msg];
}
//--------------------------
module.exports = {
    _CmdParser: function(data){
        var msg;
        switch(data.cmd){
            case 'LINE1':
                msg = WP.WriteStream( _UpperLine(data.p1),data);
                break;
            case 'LINE2':
                msg = WP.WriteStream( _BottomLine(data.p1),data);
                break;
            case 'L1_SCROLL':
                msg = WP.WriteStream( _UpperLineScrollContinue(data.p1),data);
                break;
            case 'L2_SCROLL':
                msg = WP.WriteStream( _ButtomLineScrollContinue(data.p1),data);
                break;
            case 'CS_ONOFF':
                msg = WP.WriteStream( _SetCursorOnOff(data.p1),data);
                break;
             case 'MV_CS_XY':
                 msg = WP.WriteStream( _MovCS_to_XY(data.p1,data.p2),data);
                 break;
             case 'MV_CS_LM':
                msg = WP.WriteStream( _MoveCS_LeftMost(),data);
                break;
            case 'MV_CS_RM':
                msg = WP.WriteStream( _MoveCS_RightMost(),data);
                break;
            case 'MV_CS_UP':
                msg = WP.WriteStream( _MoveCS_UP(),data);
                break;
            case 'MV_CS_R':
                msg = WP.WriteStream( _MoveCS_RIGHT(),data);
                break;
            case 'MV_CS_L':
                msg = WP.WriteStream( _MoveCS_LEFT(),data);
                break;  
            case 'MV_CS_DN':
                msg = WP.WriteStream( _MoveCS_DOWN(),data);
                break;  
            case 'MV_CS_H':
                msg = WP.WriteStream( _MoveCS_Home(),data);
                break; 
            case 'CR':
                msg = WP.WriteStream( _CR(),data);
                break; 
            case 'BS':
                msg = WP.WriteStream( _BackSpace(),data);
                break; 
            case 'HT':
                msg = WP.WriteStream( _HorizontalTab(),data);
                break; 
            case 'LF':
                msg = WP.WriteStream( _LineFeed(),data);
                break; 
            case 'INITIAL':
                msg = WP.WriteStream( _Initial(),data);
                break; 
            case 'CLEAR':
                msg = WP.WriteStream( _ClearDisplay(),data);
                break; 
            case 'SELFTEST':
                msg = WP.WriteStream( _SelfTest(),data);
                break; 
            case 'OVERWRITE':
                msg = WP.WriteStream( _Overwrite(),data);
                break; 
            case 'VSCROLL':
                msg = WP.WriteStream( _VerticalScroll(),data);
                break; 
            case 'HSCROLL':
                msg = WP.WriteStream( _HorizontalScroll(),data);
                break; 
            case 'BLINK':
                msg = WP.WriteStream( _Blink(data.p1),data);
                break; 
            case 'BRIGHTNESS':
                msg = WP.WriteStream( _Brightness(data.p1),data);
                break; 
            case 'CLR_BLINK_LINE':
                msg = WP.WriteStream( _ClrBlinkLine(data.p1),data);
                break; 
            case 'SET_BLINK_LINE':
                msg = WP.WriteStream( _SetBlinkLine(data.p1),data);
                break; 
            case 'VSCROLL_UP':
                msg = WP.WriteStream( _VscrollUp(data.p1),data);
                break; 
            case 'VSCROLL_DN':
                msg = WP.WriteStream( _VscrollDown(data.p1),data);
                break; 
            case 'PERIPHERAL_DEVICE':
                msg = WP.WriteStream( _Device(data.p1),data);
                break; 
            case 'CLR_CS_LINE':
                msg = WP.WriteStream( _ClrCSLine(),data);
                break; 
            case 'SET_TIME':
                msg = WP.WriteStream( _SetTime(data.p1),data);
                break; 
            case 'SHOW_TIME':
                msg = WP.WriteStream( _ShowTime(),data);
                break; 
            case 'SET_REVERSE':
                msg = WP.WriteStream( _SetReverse(data.p1),data);
                break; 
            case 'DISPLAY_POSITION':
                msg = WP.WriteStream( _DisplayPosition(data.p1),data);
                break; 
            case 'ICHAR':
                msg = WP.WriteStream( _Ichar(data.p1),data);
                break; 
             case 'CODEPAGE':
                 msg = WP.WriteStream( _CodePage(data.p1),data);
                 break; 
            case 'WINDOW_RANGE':
                msg = WP.WriteStream( _WindwoRange(data.p1,data.p2,data.p3,data.p4,data.p5,data.p6),data);
                break; 
            case 'INPUT_STRING':
                msg = WP.WriteStream( _WriteString(data.p1),data);
                break;
        }
        // WP.UI_Send('done', {msg:msg,id:data.id});
        WP.UI_Send('done', msg);
    }
}