const DIMMING = [0x04,0xff];
const BACKSPACE = [0x08];
const HORIZONTAL = [0x09];
const LINE_FEED = [0x0A];
const RETURN = [0x0D];
const POSITION = [0x10,0x00];
const OVERIDE_MODE = [0x11];
const VERTICAL_SCROLL_MODE = [0x12];
const CURSOR_ON = [0x13];
const CURSOR_OFF = [0x14];
const CLEAR_END_LINE = [0x18];
const CURSOR_END_DISPLAY = [0x19];
const FLASH_START = [0x1C];
const FLASH_END = [0x1D];
const RESET_DISPLAY = [0x1F];
const HOME_CLEAR = [0x1E];
const UTC_ENHANCE_MODE = [0x1B, 0x64];
//--- Enhanced Mode --------------------
const FLASH_E_START = [0x0F];
const FLASH_E_END = [0x0E];
const UPPER_LINE = [0x1B,0x75,0x41];
const BOTTOM_LINE = [0x1B,0x75,0x42];
const LINE_SCROLL_CONTINUE = [0x1B,0x75,0x44];
const DISPLAY_TIME = [0x1B,0x75,0x45];
const LINE_SCROLL_ONCEPASS = [0x1B,0x75,0x46];
const ATTENTION_CODE = [0x1B,0x75,0x48,0x1B,0x75,0x0d];
const TWO_LINE = [0x1B,0x75,0x49];
const UTC_STANDARD_MODE = [0x1B, 0x0F, 0x0D];
//-------------
var WP = require('./WP_Global.js');

module.exports = {
    _CmdParser(data){
        var msg;
        switch(data.cmd){
            case 'RESET':
                msg = WP.WriteStream( _ResetDisplay(),data);
                break;
            case 'CLR_END_LINE':
                msg = WP.WriteStream( _CleartoEndLine(),data);
                break;
            case 'CLR_END_DISPLAY':
                msg = WP.WriteStream( _CleartoEndDisplay(),data);
                break;
            case 'HOME_CLR_DISPLAY':
                msg = WP.WriteStream( _HomeClearDisplay(),data);
                break;
            case 'OVERWRITE':
                msg = WP.WriteStream( _OverwriteMode(),data);
                break;
            case 'VSCROLL':
                msg = WP.WriteStream( _VerticalScrollMode(),data);
                break;
            case 'STANDARD':
                msg = WP.WriteStream( _StandardMode(),data);
                break;
            case 'ENHANCE':
                msg = WP.WriteStream( _EnhanceMode(),data);
                break;
            case 'CS_ONOFF':
                if(data.parm =="1")
                    msg = WP.WriteStream( _CursorON(),data);
                else
                msg = WP.WriteStream( _CursorOFF());
                break;
            case 'MOVE_X':
                msg = WP.WriteStream( _Position(data.parm),data);
                break;
            case 'DIMMING':
                msg = WP.WriteStream( _Dimming(data.parm),data);
                break;
            case 'BACKSPACE':
                msg = WP.WriteStream( _Backspace(),data);
                break;
            case 'HORI_TAB':
                msg = WP.WriteStream( _Horizontal(),data);
                break;
            case 'LINE_FEED':
                msg = WP.WriteStream( _LineFeed(),data);
                break;
            case 'RETURN':
                msg = WP.WriteStream( _Return(),data);
                break;
            case 'FLASHING_TEXT_START':
                msg = WP.WriteStream( _FlashTextStart(),data);
                break;
            case 'FLASHING_TEXT_END':
                msg = WP.WriteStream( _FlashTextEnd(),data);
                break;
            case 'LINE1':
                msg = WP.WriteStream( _UpperLine(data.parm),data);
                break;
            case 'LINE2':
                msg = WP.WriteStream( _BottomLine(data.parm),data);
                break;
            case 'SCROLL_CONTINUE':
                msg = WP.WriteStream( _ScrollContinue(data.parm),data);
                break;
            case 'SCROLL_ONCEPASS':
                msg = WP.WriteStream( _ScrollOncePass(data.parm),data);
                break;
            case 'E_FLASH_TEXT_START':
                msg = WP.WriteStream( _E_FlashTextStart(),data);
                break;
            case 'E_FLASH_TEXT_END':
                msg = WP.WriteStream( _E_FlashTextEnd(),data);
                break;
            case 'TWO_LINE':
                msg = WP.WriteStream( _TwoLine(data.parm),data);
                break;
            case 'DISPLAY_TIME':
                msg = WP.WriteStream( _DisplayTime(data.parm),data);
                break;
            case 'ATTENTION_CODE':
                msg = WP.WriteStream( _AttentionCode(data.p1,data.p2),data);
                break;
        }
        WP.UI_Send('done', {msg:msg,id:data.id});
    },
}
function _Dimming(n){
    var b = Array.from(DIMMING);
    var level;
    switch(n){
        case "20":
            b[1]=0x20;
            break;
        case "40":
            b[1]=0x40;    
            break;
        case "60":
            b[1]=0x60;
            break;
        default:
            level=0xff;
            break;
    }
    return [b,'dimming: '+n];
}
function _Backspace(){
    var b = Array.from(BACKSPACE);
    return [b,'backspace'];
}
function _Horizontal(){
    var b = Array.from(HORIZONTAL);
    return [b,'horizontal'];
}
function _LineFeed(){
    var b = Array.from(LINE_FEED);
    return [b,'line feed'];
}
function _Return(){
    var b = Array.from(RETURN);
    return [b,'return'];
}
function _Position(n){
    var b = Array.from(POSITION);
    if(n > 39) 
        return b;
    b[1] = n;
    return [b,'position: '+n];
}
function _OverwriteMode(){
    var b = Array.from(OVERIDE_MODE);
    return [b,'overwrite'];
}
function _VerticalScrollMode(){
    var b = Array.from(VERTICAL_SCROLL_MODE);
    return [b,'vertical scroll'];
}
function _CursorON(){
    var b = Array.from(CURSOR_ON);
    return [b,'cursor on'];
}
function _CursorOFF(){
    var b = Array.from(CURSOR_OFF);
    return [b,'cursor off'];
}
function _CleartoEndLine(){
    var b = Array.from(CLEAR_END_LINE);
    return [b,'clear to end line'];
}
function _CleartoEndDisplay(){
    var b = Array.from(CURSOR_END_DISPLAY);
    return [b,'clear to end display'];
}
function _FlashTextStart(){
    var b = Array.from(FLASH_START);
    return [b,'flash text start'];
}
function _FlashTextEnd(){
    var b = Array.from(FLASH_END);
    return [b,'flash text end'];
}
function _ResetDisplay(){
    var b = Array.from(RESET_DISPLAY);
    return [b,'reset'];
}
function _HomeClearDisplay(){
    var b = Array.from(HOME_CLEAR);
    return [b,'move home and clear display'];
}
function _EnhanceMode(){
    var b = Array.from(UTC_ENHANCE_MODE);
    return [b,'set ehhanced mode'];
}
//--- Enhanced Mode -------------------------
function _E_FlashTextStart(){
    var b = Array.from(FLASH_E_START);
    return [b,'Ehance: flash text start'];
}
function _E_FlashTextEnd(){
    var b = Array.from(FLASH_E_END);
    return [b,'Enhance: flash text end'];
}
function _UpperLine(s){
    var b = Array.from(UPPER_LINE);
    var str = s;
    if(str.length > 20)
         return;
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'write upper line: '+s];
}
function _BottomLine(s){
    var b = Array.from(BOTTOM_LINE);
    var str = s;
    if(str.length > 20){
         return;
    }
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'write bottom line: '+s];
}
function _ScrollContinue(s){
    var b = Array.from(LINE_SCROLL_CONTINUE);
    var str = s;
    if(str.length > 40){
         return;
    }
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'scorll continue:'+s];
}
function _DisplayTime(time){
    var b = Array.from(DISPLAY_TIME)
    var str = time;
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'display time '+time];
}
function _ScrollOncePass(s){
    var b = Array.from(LINE_SCROLL_ONCEPASS);
    var str = s;
    if(str.length > 40){
         return;
    }
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'scroll oncepass'];
}
function _AttentionCode(stn,stm){
    var b = Array.from(ATTENTION_CODE);
    var n= parseInt(stn);
    var m=parseInt(stm);
    if( (n >= 32) && (m>=32) ) {
        b[3]= n;
        b[4] = m;
    }
    return [b,'attention code: '+stn+','+stm];
}
function _TwoLine(s){
    var b = Array.from(TWO_LINE);
    if(s.length > 40){
         return;
    }
    for(var i=0; i<s.length; i++) {
        b.push(s.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'write two line: '+s];
}
function _StandardMode(){
    var b = Array.from(UTC_STANDARD_MODE);
    return [b,'standard mode'];
}
