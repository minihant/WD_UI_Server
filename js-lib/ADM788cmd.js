const CLR=[0x0c];
const CR = [0x0d];
const SLE1=[0x0E];
const SLE2 = [0x0f];
const DC0=[0x10];  //n=0x31~0x44
const DC1= [0x11]; // n=0x31, upper line, n=0x32 low line
const DC2=[0x12];  // n=0x31, upper line, n=0x32 low line
const SF1 = [0x1E];
const SF2 = [0x1F];
//-------------
var WP = require('./WP_Global.js');

function _CLR(){
    var b = Array.from(CLR);
    return [b,'clear display'];
}
function _CR(){
    var b = Array.from(CR);
    return [b,'carriage return'];
}
function _SLE1(){
    var b = Array.from(SLE1);
    return [b,'clear line1'];
}
function _SLE2(){
    var b = Array.from(SLE2);
    return [b,'clear line2'];
}
function _DC0(n){
    var b = Array.from(DC0);
    var str = n
    b.push(str.charCodeAt(0));
    return [b,'set lin1 period: '+n];
}
function _DC1(n){
    var b = Array.from(DC1);
    var str = n
    b.push(str.charCodeAt(0));
    return [b,'set lin2 period: '+n];
}
function _DC2(n){
    var b = Array.from(DC2);
    var str = n
    b.push(str.charCodeAt(0));
    return [b,'clear blinking line: '+n];
}
function _SF1(){
    var b = Array.from(SF1);
    return [b,'clear field1'];
}
function _SF2(){
    var b = Array.from(SF2);
    return [b,'clear field2'];
}
module.exports = {
    _CmdParser(data){ 
        var msg;
        switch(data.cmd){
            case 'CLR':
                msg=WP.WriteStream( _CLR(),data);
                break;
            case 'CR':
                msg=WP.WriteStream( _CR(),data);
                break;
            case 'SLE1':
                msg=WP.WriteStream( _SLE1(),data);
                break;
            case 'SLE2':
                msg=WP.WriteStream( _SLE2(),data);
                break;
                case 'DC0':
                msg=WP.WriteStream( _DC0(data.parm),data);
                break;
            case 'DC1':
                msg=WP.WriteStream( _DC1(data.parm),data);
                break;
            case 'DC2':
                msg=WP.WriteStream( _DC2(data.parm),data);
                break;
            case 'SF1':
                msg=WP.WriteStream( _SF1(),data);
                break;
            case 'SF2':
                msg=WP.WriteStream( _SF2(),data);
                break;
        }
        WP.UI_Send('done', {msg:msg,id:data.id}); 
    }
}