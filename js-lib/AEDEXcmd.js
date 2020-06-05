const UPPER_LINE = [0x21,0x23,0x31];
const BOTTOM_LINE = [0x21,0x23,0x32];
const LINE_SCROLL_CONTINUE = [0x21,0x23,0x34];
const DISPLAY_TIME = [0x21,0x23,0x35];
const LINE_SCROLL_ONCEPASS = [0x21,0x23,0x36];
const ATTENTION_CODE = [0x21,0x23,0x38,0x20,0x20,0x0d];
const TWO_LINE = [0x21,0x23,0x39];
var WP = require('./WP_Global.js');
//---------------------
function _UpperLine(s){
    var b = Array.from(UPPER_LINE);
    var str = s;
    if(str.length > 40)
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
    return [b,'line scroll: '+s];
}
function _DisplayTime(time){
    var b = Array.from(DISPLAY_TIME)
    var str = time;
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'show time '+time];
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
    return [b,'scroll once pass'];
}
function _AttentionCode(stn,stm){
    var b = Array.from(ATTENTION_CODE);
    var n= parseInt(stn);
    var m=parseInt(stm);
    if(n<32 || n > 255)
         return;
    if(m<32 || m > 255)
         return;
    b[3]= n;
    b[4] = m;
    return [b,'set attention code: '+stn+','+stm];
}
function _TwoLine(s){
    var b = Array.from(TWO_LINE);
    var str = s;
    if(str.length > 40){
         return;
    }
    for(var i=0; i<str.length; i++) {
        b.push(str.charCodeAt(i))
    }
    b.push(0x0d);
    return [b,'two line display'];
}

//-------------------------
module.exports = {
    _CmdParser(data){
        var msg;
        switch(data.cmd){
            case 'LINE1':
                msg=WP.WriteStream( _UpperLine(data.parm),data);
                break;
            case 'LINE2':
                msg=WP.WriteStream( _BottomLine(data.parm),data);
                break;
            case 'SCROLL_CONTINUE':
                msg=WP.WriteStream( _ScrollContinue(data.parm),data);
                break;
            case 'SCROLL_ONCEPASS':
                msg=WP.WriteStream( _ScrollOncePass(data.parm),data);
                break;
            case 'TWO_LINE':
                msg=WP.WriteStream( _TwoLine(data.parm),data);
                break;
            case 'DISPLAY_TIME':
                msg=WP.WriteStream( _DisplayTime(data.parm),data);
                break;
            case 'ATTENTION_CODE':
                msg=WP.WriteStream( _AttentionCode(data.parm),data);
                break;
        }
        WP.UI_Send('done', {msg:msg,id:data.id});
    },
}