var rcvToken;
var deviceid="";
var cs_status = 0;
var reverse_status = '0';
var socket = io.connect();

function sendCmd(e, command, v1,v2,v3,v4,v5){
    e.preventDefault();
    socket.emit('CD5220_CMD', {
        id: deviceid,
        cmd: command,
        p1:v1,
        p2:v2,
        p3:v3,
    });
}
function webstart(require){
    socket.emit('NewClient',{web:"CD5220"});
    document.getElementById("initial").addEventListener("click", initial_Fn);
    document.getElementById("clear").addEventListener("click", clear_Fn);
    document.getElementById("clear_cs_line").addEventListener("click", clear_cs_line_Fn);
    document.getElementById("brightness").addEventListener("click", brightness_Fn);
    document.getElementById("st_overwrite").addEventListener("click", st_overwrite_Fn);
    document.getElementById("st_Vscroll").addEventListener("click", st_Vscroll_Fn);
    document.getElementById("st_Hscroll").addEventListener("click", st_Hscroll_Fn);
    document.getElementById("cs_onoff").addEventListener("click", cs_onoff_Fn);
    document.getElementById("cs_mvXY").addEventListener("click", cs_mvXY_Fn);
    document.getElementById("cs_mvR").addEventListener("click", cs_mvR_Fn);
    document.getElementById("cs_mvL").addEventListener("click", cs_mvL_Fn);
    document.getElementById("cs_mvU").addEventListener("click", cs_mvU_Fn);
    document.getElementById("cs_mvD").addEventListener("click", cs_mvD_Fn);
    document.getElementById("cs_mvLM").addEventListener("click", cs_mvLM_Fn);
    document.getElementById("cs_mvRM").addEventListener("click", cs_mvRM_Fn);
    document.getElementById("cs_mvH").addEventListener("click", cs_mvH_Fn);
    document.getElementById("cs_mvB").addEventListener("click", cs_mvB_Fn);
    document.getElementById("st_charset").addEventListener("click", st_charset_Fn);
    document.getElementById("st_codetable").addEventListener("click", st_codetable_Fn);
    document.getElementById("cpr1").addEventListener("click", cpr1_Fn);
    document.getElementById("cpr2").addEventListener("click", cpr2_Fn);
    document.getElementById("cpr3").addEventListener("click", cpr3_Fn);
    document.getElementById("cpr4").addEventListener("click", cpr4_Fn);
    document.getElementById("inputstr1").addEventListener("click", inputstr1_Fn);
    document.getElementById("inputstr2").addEventListener("click", inputstr2_Fn);
    document.getElementById("line1scroll").addEventListener("click", line1scroll_Fn);
    document.getElementById("insrting").addEventListener("click", insrting_Fn);
    document.getElementById("seldevice").addEventListener("click", seldevice_Fn);
}
function seldevice_Fn(e){
    var el = document.getElementById("device_val");
    var cs = el.options[el.selectedIndex].value;  
    sendCmd(e,'PERIPHERAL_DEVICE',cs);
}
function insrting_Fn(e){
    var value = document.getElementById("in_txt").value;
    sendCmd(e,'INPUT_STRING',value);
}
function line1scroll_Fn(e){
    var value = document.getElementById("txt_full").value;
    sendCmd(e,'LINE1_SCROLL',value);
}
function inputstr2_Fn(e){
    var value = document.getElementById("txt_line2").value;
    sendCmd(e,'WRITE_LINE2',value);
}
function inputstr1_Fn(e){
    var value = document.getElementById("txt_line1").value;
    sendCmd(e,'WRITE_LINE1',value);
}
function cpr4_Fn(e){ 
    sendCmd(e,'SHOW_CP','P4');
}
function cpr3_Fn(e){ 
    sendCmd(e,'SHOW_CP','P3');
}
function cpr2_Fn(e){ 
    sendCmd(e,'SHOW_CP','P2');
}
function cpr1_Fn(e){ 
    sendCmd(e,'SHOW_CP','P1');
}
function st_codetable_Fn(e){
    var el = document.getElementById("codetable_val");
    var cs = el.options[el.selectedIndex].value;  
    sendCmd(e,'CODETABLE',cs);
}
function st_charset_Fn(e){
    var el = document.getElementById("charset_val");
    var cs = el.options[el.selectedIndex].value;  
    sendCmd(e,'CHARSET',cs);
}
function cs_mvB_Fn(e){
    sendCmd(e,'MV_CS_B');
}
function cs_mvH_Fn(e){
    sendCmd(e,'MV_CS_H');
}
function cs_mvRM_Fn(e){
    sendCmd(e,'MV_CS_RM');
}
function cs_mvLM_Fn(e){
    sendCmd(e,'MV_CS_LM');
}
function cs_mvD_Fn(e){
    sendCmd(e,'MV_CS_D');
}
function cs_mvU_Fn(e){
    sendCmd(e,'MV_CS_U');
}
function cs_mvL_Fn(e){
    sendCmd(e,'MV_CS_L');
}
function cs_mvR_Fn(e){
    sendCmd(e,'MV_CS_R');
}
function cs_mvXY_Fn(e){
    var x_val = document.getElementById("pos_x").value;
    var y_val = document.getElementById("pos_y").value;
    sendCmd(e,'MV_CS_XY',x_val,y_val);
}
function cs_onoff_Fn(e){
    if (cs_status == 0) {
        cs_status = 1;
        document.getElementById("btcs_on").value = "Cursor OFF";
        document.getElementById("btcs_on").style.background = '#700000';
    } else {
        cs_status = 0;
        document.getElementById("btcs_on").value = "Cursor ON";
        document.getElementById("btcs_on").style.background = '#308000';
    }
    sendCmd(e,'CS_ONOFF',cs_status);
}
function st_Hscroll_Fn(e){
    sendCmd(e,'HSCROLL');
}
function st_Vscroll_Fn(e){
    sendCmd(e,'VSCROLL');
}
function st_overwrite_Fn(e){
    sendCmd(e,'OVERWRITE');
}
function brightness_Fn(e){
    var value = document.getElementById("britnesss_val").value;
    sendCmd(e,'BRIGHTNESS',value);
}
function clear_cs_line_Fn(e){
    sendCmd(e,'CLR_CS_LINE');
}
function initial_Fn(e){
    sendCmd(e,'INITIAL');
}
function clear_Fn(e){
    sendCmd(e,'CLEAR');
}
function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
}   
//--------------------------------------- 
socket.on('done', function(data) {
    // document.getElementById("ID_Prnstatus").value= data.cmd;
    if(data.p1 != null && data.p2 != null){
        $('#ID_Prnstatus').val(data.cmd+': '+data.p1+', '+data.p2);
    }
    else if(data.p1 != null){
        $('#ID_Prnstatus').val(data.cmd+': '+data.p1);
    }
    else{
        $('#ID_Prnstatus').val(data.cmd);
    }
});
 
socket.on('statistics', function(data) {
    document.getElementById('mem_id').value = data.p1;
    document.getElementById('time_id').value = data.p2;
}); 
socket.on('deviceID', function(data) {
    deviceid = data.id;
    document.getElementById('version_id').value = 'V'+data.ver;
    document.getElementById('user_id').value = data.loguser;
});
socket.on('Error', function(data) {
    alert("Error: "+data.msg);
});