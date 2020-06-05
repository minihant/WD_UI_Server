var cs_status = 0;
var reverse_status = '0';
var socket = io.connect();
var deviceid=""

function load(){
    socket.emit('NewClient',{web:"/ESCPOS"});
    document.getElementById("initial").addEventListener("click", initial_Fn);
    document.getElementById("clear").addEventListener("click", clear_Fn);
    document.getElementById("selftest").addEventListener("click", selftest_Fn);
    document.getElementById("setfont").addEventListener("click", setfont_Fn);
    document.getElementById("setsjis").addEventListener("click", setsjis_Fn);
    document.getElementById("setjis").addEventListener("click", setjis_Fn);
    document.getElementById("inputstr").addEventListener("click", inputstr_Fn);
    document.getElementById("st_reverse").addEventListener("click", st_reverse_Fn);
    document.getElementById("clear_cs_line").addEventListener("click", clear_cs_line_Fn);
    document.getElementById("brightness").addEventListener("click", brightness_Fn);
    document.getElementById("blink").addEventListener("click", blink_Fn);
    document.getElementById("st_overwrite").addEventListener("click", st_overwrite_Fn);
    document.getElementById("st_Vscroll").addEventListener("click", st_Vscroll_Fn);
    document.getElementById("st_Hscroll").addEventListener("click", st_Hscroll_Fn);
    document.getElementById("st_time").addEventListener("click", st_time_Fn);
    document.getElementById("displaytime").addEventListener("click", displaytime_Fn);
    document.getElementById("btcs_on").addEventListener("click", cs_onoff_Fn);
    document.getElementById("cs_mvXY").addEventListener("click", cs_mvXY_Fn);
    document.getElementById("cs_mvR").addEventListener("click", cs_mvR_Fn);
    document.getElementById("cs_mvL").addEventListener("click", cs_mvL_Fn);
    document.getElementById("cs_mvU").addEventListener("click", cs_mvU_Fn);
    document.getElementById("cs_mvD").addEventListener("click", cs_mvD_Fn);
    document.getElementById("cs_mvLM").addEventListener("click", cs_mvLM_Fn);
    document.getElementById("cs_mvRM").addEventListener("click", cs_mvRM_Fn);
    document.getElementById("cs_mvH").addEventListener("click", cs_mvH_Fn);
    document.getElementById("cs_mvB").addEventListener("click", cs_mvB_Fn);
    document.getElementById("st_codetable").addEventListener("click", stcodetable_Fn);
    document.getElementById("cpr1").addEventListener("click", cpr1_Fn);
    document.getElementById("cpr2").addEventListener("click", cpr2_Fn); 
    document.getElementById("cpr3").addEventListener("click", cpr3_Fn);
    document.getElementById("cpr4").addEventListener("click", cpr4_Fn);
    document.getElementById("st_charset").addEventListener("click", stcharset_Fn);
    document.getElementById("recordmacro").addEventListener("click", recordmacro_Fn);
    document.getElementById("setmacro").addEventListener("click", setmacro_Fn);
    document.getElementById("sel_device").addEventListener("click", sel_device_Fn);
    document.getElementById("rdfontcode").addEventListener("click", rdfontcode_Fn);
    document.getElementById("rdboot").addEventListener("click", rdboot_Fn);
    document.getElementById("rdfw").addEventListener("click", rdfw_Fn);
    document.getElementById("rdmf").addEventListener("click", rdmf_Fn);
    document.getElementById("rdpname").addEventListener("click", rdpname_Fn);
    document.getElementById("rdser").addEventListener("click", rdser_Fn);
    // document.getElementById("wrmf").addEventListener("click", wrmf_Fn);
    // document.getElementById("wrpname").addEventListener("click", wrpname_Fn);
    // document.getElementById("wrser").addEventListener("click", wrser_Fn);
    document.getElementById("muti_win").addEventListener("click", muti_win_Fn);
    // document.getElementById("basic_win").addEventListener("click", basic_win_Fn);
    document.getElementById("dl_bitimg").addEventListener("click", dl_bitimg_Fn);
    // document.getElementById("dl_rastimg").addEventListener("click", dl_rastimg_Fn);
    // document.getElementById("dl_colimg").addEventListener("click", dl_colimg_Fn);
    // document.getElementById("dl_style").addEventListener("click", dl_style_Fn);
    // document.getElementById("dl_layout").addEventListener("click", dl_layout_Fn);
    // document.getElementById("defwin").addEventListener("click", defwin_Fn);
    // document.getElementById("selwin").addEventListener("click", selwin_Fn);
    // document.getElementById("setwin").addEventListener("click", setwin_Fn);

}
function sendCmd(e, incmd, v1,v2,v3){
    e.preventDefault();
    socket.emit('EPOS_CMD', {
        id: deviceid,
        cmd: incmd,
        p1: v1,
        p2:v2,
        p3:v3,
    });
}
function initial_Fn(e) {
    sendCmd(e,'INITIAL')
}
function clear_Fn(e) {
    sendCmd(e, 'CLEAR')
}
function selftest_Fn(e) {
    sendCmd(e, 'SELFTEST')
}
function setfont_Fn(e) {
    var val = document.getElementById("fcode_val").value;
    sendCmd(e, 'SETFONT',val)
}
function setsjis_Fn(e) {
    sendCmd(e, 'SETSJIS')
}
function setjis_Fn(e) {
    sendCmd(e, 'SETJIS')
}
function inputstr_Fn(e) {
    var val = document.getElementById("in_text").value;
    sendCmd(e, 'INPUT_TEXT',val)
}
function st_reverse_Fn(e) {
    if (reverse_status == '0') {
        reverse_status = '1';
        document.getElementById("st_reverse").value = "Reverse Char OFF";
        document.getElementById("st_reverse").style.background = '#700000';
    } else {
        reverse_status = '0';
        document.getElementById("st_reverse").value = "Reverse Char ON";
        document.getElementById("st_reverse").style.background = '#308000';
    }
    sendCmd(e, 'SET_REVERSE',reverse_status)
}
function clear_cs_line_Fn(e) {
    sendCmd(e, 'CLR_CS_LINE')
}
function brightness_Fn(e) {
    var val = document.getElementById("britnesss_val").value;
    sendCmd(e, 'BRIGHTNESS', val)
}
function blink_Fn(e) {
    var val = document.getElementById("blink_val").value;
    sendCmd(e, 'BLINK', val)
}
function st_overwrite_Fn(e) {
    sendCmd(e, 'OVERWRITE')
}
function st_Vscroll_Fn(e) {
    sendCmd(e, 'VSCROLL')    
}
function st_Hscroll_Fn(e) {
    sendCmd(e, 'HSCROLL')    
}
function st_time_Fn(e) {
    var currentdate = new Date();
    var hr = currentdate.getHours().toString();
    var minute = currentdate.getMinutes().toString();
    var nowtime = hr + ": " + minute;
    sendCmd(e, 'SET_TIME',nowtime)
}
function displaytime_Fn(e) {
    sendCmd(e, 'DISPLAY_TIME')
}
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
    sendCmd(e, 'CS_ONOFF',cs_status)
}
function cs_mvXY_Fn(e) {
    var x_val = document.getElementById("pos_x").value;
    var y_val = document.getElementById("pos_y").value;
    sendCmd(e, 'MV_CS_XY',x_val,y_val)
}
function cs_mvR_Fn(e) {
    sendCmd(e, 'MV_CS_R')
}
function cs_mvL_Fn(e) {
    sendCmd(e, 'MV_CS_L')
}
function cs_mvU_Fn(e) {
    sendCmd(e, 'MV_CS_UP')
}
function cs_mvD_Fn(e) {
    sendCmd(e, 'MV_CS_DN')
}
function cs_mvLM_Fn(e) {
    sendCmd(e, 'MV_CS_LM')
}
function cs_mvRM_Fn(e) {
    sendCmd(e, 'MV_CS_RM')
}
function cs_mvH_Fn(e) {
    sendCmd(e, 'MV_CS_H')
}
function cs_mvB_Fn(e) {
    sendCmd(e, 'MV_CS_B')
}
function stcodetable_Fn(e) {
    var el = document.getElementById("codetable_val");
    var cs = el.options[el.selectedIndex].value;
    sendCmd(e, 'CODEPAGE',cs)
}
function cpr1_Fn(e) {
    sendCmd(e, 'SHOW_CP',1)
}
function cpr2_Fn(e) {
    sendCmd(e, 'SHOW_CP',2)
}
function cpr3_Fn(e) {
    sendCmd(e, 'SHOW_CP',3)
}
function cpr4_Fn(e) {
    sendCmd(e, 'SHOW_CP',4)
}
function stcharset_Fn(e) {
    e.preventDefault();
    var el = document.getElementById("charset_val");
    var cs = el.options[el.selectedIndex].value;
    sendCmd(e, 'SET_CHARSET',cs)
}
function recordmacro_Fn(e) {
    var val =  document.getElementById("recordmacro");
    var step;
    if(val == 'Start Macro') {
        document.getElementById("macrostage").value = "End Macro";
        step = 'start';
    }
    else {
        document.getElementById("macrostage").value = "Start Macro";
        step = 'end';
    }
    sendCmd(e, 'STARTSTOP_MACRO',step)
}
function setmacro_Fn(e) {
    // e.preventDefault();
    var v1 = document.getElementById("c_delay_id").value;
    var v2 = document.getElementById("exc_delay_id").value;
    sendCmd(e, 'SET_MACRO',v1,v2)
    // socket.emit('EPOS_CMD', {
    //     id: socket.id,
    //     cmd:'SET_MACRO',
    //     p1: v1,
    //     p2: v2
    // });
}
function sel_device_Fn(e) {
        // e.preventDefault();
        var el = document.getElementById("device_val");
        var cs = el.options[el.selectedIndex].value;
        sendCmd(e, 'PERIPHERAL_DEVICE',cs)
        // socket.emit('EPOS_CMD', {
        //     id: socket.id,
        //     cmd: 'PERIPHERAL_DEVICE',
        //     parm: cs
        // });
    }
function rdfontcode_Fn(e) {
    sendCmd(e, 'RDFONTCODE')
}
function rdboot_Fn(e) {
    sendCmd(e, 'RDBOOT')
}
function rdfw_Fn(e) {
    sendCmd(e, 'RDFW')
}
function rdmf_Fn(e) {
    sendCmd(e, 'RDMF')
}
function rdpname_Fn(e) {
    sendCmd(e, 'RDPNAME')
}
function rdser_Fn(e) {
    sendCmd(e, 'RDSERIAL')
}
function wrmf_Fn(e) {
    var val = document.getElementById("mf_txt").value;
    sendCmd(e, 'WRMF',val)
}
function wrpname_Fn(e) {
    e.preventDefault();
    var val = document.getElementById("pname_txt").value;
    sendCmd(e, 'WRPNAME',val)
    // Post_Message('wrpname', val);
}
function wrser_Fn(e) {
    e.preventDefault();
    var val = document.getElementById("serial_txt").value;
    sendCmd(e, 'WRSER',val)
    // Post_Message('wrserial', val);
}
function muti_win_Fn(e) {
    sendCmd(e, 'MULTI_WIN')
}
function basic_win_Fn(e) {
    sendCmd(e, 'BASIC_WIN')
}
function dl_bitimg_Fn(e) {
    sendCmd(e, 'BMP_IMG')
}
function dl_rastimg_Fn(e) {
    sendCmd(e, 'RASTER_IMG')
}
function dl_colimg_Fn(e) {
    sendCmd(e, 'COLUMN_IMG')
}
function dl_style_Fn(e) {
    sendCmd(e, 'DEMO_STYLE')
}
function dl_layout_Fn(e) {
    sendCmd(e, 'DEMO_LAYOUT')
}
function defwin_Fn(e) {
    e.preventDefault();
    var v1 = selected_winno();
    var v2 = document.getElementById("winx_val").value;
    var v3 = document.getElementById("winy_val").value;
    var v4 = document.getElementById("winx_size").value;
    var v5 = document.getElementById("winy_size").value;
    var v6 = selected_winmode();
    var v7 = selected_winbkg();
    socket.emit('EPOS_CMD', {
        id: socket.id,
        cmd : 'DEF_WIN',
        wno: v1,
        x: v2,
        y: v3,
        sx: v4,
        sy: v5,
        m: v6,
        bkg:v7,
    });
}
function selwin_Fn(e) {
    e.preventDefault();
    var v1 =selected_winno();
    var v2 = selected_winmode();
    socket.emit('EPOS_CMD', {
        id: socket.id,
        cmd : 'SEL_WIN',
        wno: v1,
        m: v2,
    });
}
function setwin_Fn(e) {
    e.preventDefault();
    var v1 =selected_winno();
    var v2 = selected_winbkg();
    socket.emit('EPOS_CMD', {
        id: socket.id,
        cmd : 'SET_WIN',
        m: v1,
        bkg: v2,
    });
}  

function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
}    
//---------------------------------------------
socket.on('done', function(data) {
    // $('#ID_Prnstatus').val(data.cmd);
    // if(data.msg != ''){
    //     $('#ID_Prnstatus').val(data.msg);
    // }
    switch(data.cmd){
        case 'RDMF':
        case 'RDPNAME':
        case 'RDSERIAL':
        case 'RDFONTCODE':
        case 'RD_BOOT':
        case 'RD_FW':
            $('#ID_Prnstatus').val(data.msg);
            break;    
        default:
            if(data.p1 != null && data.p2 != null){
                $('#ID_Prnstatus').val(data.cmd+': '+data.p1+', '+data.p2);
            }
            else if(data.p1 != null){
                $('#ID_Prnstatus').val(data.cmd+': '+data.p1);
            }
            else{
                $('#ID_Prnstatus').val(data.cmd);
            }
            break;
    }
});
// socket.on('rcvmf', function(data) {
//     // document.getElementById("mf_txt").value = data.p1;
//     $('#ID_Prnstatus').val(data)=data.p1;
// });
// socket.on('rcvpname', function(data) {
//     // document.getElementById("pname_txt").value = data.p1;
//     $('#ID_Prnstatus').val(data)=data.p1;
// });
// socket.on('rcvserial', function(data) {
//     // document.getElementById("serial_txt").value = data.p1;
//     $('#ID_Prnstatus').val(data)=data.p1;
// });
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
//--------------------------------------
function selected_winno(){
    var obj=document.getElementsByName("win_no");
    var val;
    for (var i=0; i<obj.length; i++) {
        if (obj[i].checked) {
            val=obj[i].value;
            break;
        }
    }
    console.log(val);
    return val;
}
function selected_winmode(){
    var obj=document.getElementsByName("w_mode");
    var val;
    for (var i=0; i<obj.length; i++) {
        if (obj[i].checked) {
            val=obj[i].value;
            break;
        }
    }
    console.log(val);
    return val;
}
function selected_winbkg(){
    var obj=document.getElementsByName("w_bkg");
    var val;
    for (var i=0; i<obj.length; i++) {
        if (obj[i].checked) {
            val=obj[i].value;
            break;
        }
    }
    console.log(val);
    return val;
}
// function Post_Message(cmd, val) {
//     $.ajax({
//         url: "http://localhost:8081/api/postman",
//         type: "POST",
//         data: JSON.stringify({
//             "cmd": cmd,
//             "parm": val
//         }),
//         dataType: "json",
//         contentType: "application/json",
//         error: function(xhr, ajaxOptions, thrownError) {
//             alert("send cmd fail : " + thrownError);
//         }
//     });
// }
