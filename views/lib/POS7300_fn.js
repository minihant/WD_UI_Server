var rcvToken;
var deviceid="";
var cs_status = 0;
var reverse_status = '0';
var socket = io.connect();

function sendCmd(e, command, v1,v2,v3,v4,v5,v6){
    e.preventDefault();
    socket.emit('POS7300_', {
        id:deviceid,
        cmd: command,
        p1:v1,
        p2:v2,
        p3:v3,
        p4:v4,
        p5:v5,
        p6:v6,
    });
} 
function webstart(require){
    socket.emit('NewClient',{web:"indPOS7300x"});
    document.getElementById("line1").addEventListener("click", line1_Fn);
    document.getElementById("line2").addEventListener("click", line2_Fn);
    document.getElementById("upperscroll").addEventListener("click", upperscroll_Fn);
    document.getElementById("bottomscroll").addEventListener("click", bottomscroll_Fn);
    document.getElementById("insrting").addEventListener("click", insrting_Fn);
    document.getElementById("btcs_on").addEventListener("click", cs_onoff_Fn);
    document.getElementById("cs_mvXY").addEventListener("click", cs_mvXY_Fn);
    document.getElementById("cs_mvR").addEventListener("click", cs_mvR_Fn);
    document.getElementById("cs_mvL").addEventListener("click", cs_mvL_Fn);
    document.getElementById("cs_mvU").addEventListener("click", cs_mvU_Fn);
    document.getElementById("cs_mvD").addEventListener("click", cs_mvD_Fn);
    document.getElementById("cs_mvLM").addEventListener("click", cs_mvLM_Fn);
    document.getElementById("cs_mvRM").addEventListener("click", cs_mvRM_Fn);
    document.getElementById("cs_mvH").addEventListener("click", cs_mvH_Fn);
    document.getElementById("cs_cr").addEventListener("click", cs_cr_Fn);
    document.getElementById("bs").addEventListener("click", bs_Fn);
    document.getElementById("ht").addEventListener("click", ht_Fn);
    document.getElementById("lf").addEventListener("click", lf_Fn);
    document.getElementById("initial").addEventListener("click", initial_Fn);
    document.getElementById("clear").addEventListener("click", clear_Fn);
    document.getElementById("self").addEventListener("click", self_Fn);
    document.getElementById("st_overwrite").addEventListener("click", overwrite_Fn);
    document.getElementById("st_Vscroll").addEventListener("click", vscroll_Fn);
    document.getElementById("st_Hscroll").addEventListener("click", hscroll_Fn);
    document.getElementById("blink").addEventListener("click", blink_Fn);
    document.getElementById("brightness").addEventListener("click", brightness_Fn);
    document.getElementById("clr_bline").addEventListener("click", clr_bline_Fn);
    document.getElementById("st_bline").addEventListener("click", st_bline_Fn);
    document.getElementById("vsup").addEventListener("click", vsup_Fn);
    document.getElementById("vsdn").addEventListener("click", vsdn_Fn);
    document.getElementById("sel_device").addEventListener("click", sel_device_Fn);
    document.getElementById("clr_csline").addEventListener("click", clr_csline_Fn);
    document.getElementById("st_time").addEventListener("click", st_time_Fn);
    document.getElementById("show_time").addEventListener("click", show_time_Fn);
    document.getElementById("st_reverse").addEventListener("click", st_reverse_Fn);
    document.getElementById("position").addEventListener("click", position_Fn);
    document.getElementById("i_char").addEventListener("click", i_char_Fn);
    document.getElementById("cp").addEventListener("click", cp_Fn);
    document.getElementById("wrange").addEventListener("click", wrange_Fn);

}

function wrange_Fn(e){
    var wno = document.getElementById("win_no").value;
    var set = document.getElementById("set_win").checked;
    var x1 = document.getElementById("wx1").value;
    var x2 = document.getElementById("wx2").value;
    var y1 = document.getElementById("wy1").value;
    var y2 = document.getElementById("wy2").value;
    sendCmd(e,'WINDOW_RANGE',wno,set,x1,x2,y1,y2);
}
function cp_Fn(e){
    var val = document.getElementById("cp_val").value;
    sendCmd(e,'CODEPAGE',val);
}
function i_char_Fn(e){
    var val = document.getElementById("charset_val").value;
    sendCmd(e,'ICHAR',val);
}
function position_Fn(e){
    var val = document.getElementById("pos_txt").value;
    sendCmd(e,'DISPLAY_POSITION',val);
}
function st_reverse_Fn(e){
    if (reverse_status == '0') {
        reverse_status = '1';
        document.getElementById("rsv_on").value = "Reverse Char OFF";
        document.getElementById("rsv_on").style.background = '#700000';
    } else {
        reverse_status = '0';
        document.getElementById("rsv_on").value = "Reverse Char ON";
        document.getElementById("rsv_on").style.background = '#308000';
    }
    sendCmd(e,'SET_REVERSE',reverse_status);
}
function show_time_Fn(e){
    sendCmd(e,'SHOW_TIME');
}
function st_time_Fn(e){
    var currentdate = new Date();
    var hr = currentdate.getHours().toString();
    var minute = currentdate.getMinutes().toString();
    var nowtime = hr + ":" + minute;
    sendCmd(e,'SET_TIME',nowtime);
}
function clr_csline_Fn(e){
    sendCmd(e,'CLR_CS_LINE');
}
function sel_device_Fn(e){
    var el = document.getElementById("device_val");
    var cs = el.options[el.selectedIndex].value;
    sendCmd(e,'PERIPHERAL_DEVICE',cs);
}
function vsdn_Fn(e){
    var val = document.getElementById("vscrolldn_txt").value;
    sendCmd(e,'VSCROLL_DN',val);
}
function vsup_Fn(e){
    var val = document.getElementById("vscrollup_txt").value;
    sendCmd(e,'VSCROLL_UP',val);
}
function st_bline_Fn(e){
    var val = document.getElementById("stblk_txt").value;
    sendCmd(e,'SET_BLINK_LINE',val);
}
function clr_bline_Fn(e){
    var val = document.getElementById("clrblk_txt").value;
    sendCmd(e,'CLR_BLINK_LINE',val);
}
function brightness_Fn(e){
    var val = document.getElementById("britnesss_val").value;
    sendCmd(e,'BRIGHTNESS',val);
}
function blink_Fn(e){
    var val = document.getElementById("blink_val").value;
    sendCmd(e,'BLINK',val);
}
function hscroll_Fn(e){
    sendCmd(e,'HSCROLL');
}
function vscroll_Fn(e){
    sendCmd(e,'VSCROLL');
}
function overwrite_Fn(e){
    sendCmd(e,'OVERWRITE');
}
function self_Fn(e){
    sendCmd(e,'SELFTEST');
}
function clear_Fn(e){
    sendCmd(e,'CLEAR');
}
function initial_Fn(e){
    sendCmd(e,'INITIAL');
}
function lf_Fn(e){
    sendCmd(e,'LF');
}
function ht_Fn(e){
    sendCmd(e,'HT');
}
function bs_Fn(e){
    sendCmd(e,'BS');
}
function cs_cr_Fn(e){
    sendCmd(e,'CR');
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
    sendCmd(e,'MV_CS_DN');
}
function cs_mvU_Fn(e){
    sendCmd(e,'MV_CS_UP');
}
function cs_mvL_Fn(e){
    sendCmd(e,'MV_CS_L');
}
function cs_mvR_Fn(e){
    sendCmd(e,'MV_CS_R');
}
function cs_mvXY_Fn(e) {
    var x_val = document.getElementById("pos_x").value;
    var y_val = document.getElementById("pos_y").value;
    sendCmd(e,'MV_CS_XY',x_val,y_val)
};
function cs_onoff_Fn(e) {
    if (cs_status == 0) {
        cs_status = 1;
        document.getElementById("btcs_on").value = "Cursor OFF";
        document.getElementById("btcs_on").style.background = '#700000';
    } else {
        cs_status = 0;
        document.getElementById("btcs_on").value = "Cursor ON";
        document.getElementById("btcs_on").style.background = '#308000';
    }
    sendCmd(e,'CS_ONOFF',cs_status)
};
function bottomscroll_Fn(e) {
    var val = document.getElementById("txt_bottomscroll").value;
    sendCmd(e,'L2_SCROLL',val)
};
function upperscroll_Fn(e) {
    var val = document.getElementById("txt_upscroll").value;
    sendCmd(e,'L1_SCROLL',val)
};
function line2_Fn(e) {
    var str = document.getElementById("txt_line2").value;
    sendCmd(e,'LINE2',str)
};
function line1_Fn(e) {
    var str = document.getElementById("txt_line1").value;
    sendCmd(e,'LINE1',str)
};
function insrting_Fn(e){
    var value = document.getElementById("in_txt").value;
    sendCmd(e,'INPUT_STRING',value);
}
function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
}   
//--------------------------------------- 
socket.on('done', function(data) {
    // $('#ID_Prnstatus').val(data.p1);
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
socket.on('deviceID', function(data) {
    deviceid = data.id;
    document.getElementById('version_id').value = 'V'+data.ver;
    document.getElementById('user_id').value = data.loguser;
});
socket.on('statistics', function(data) {
    document.getElementById('mem_id').value = data.p1;
    document.getElementById('time_id').value = data.p2;
}); 
socket.on('Error', function(data) {
    alert("Error: "+data.msg);
});