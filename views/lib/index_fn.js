var username;
var password;
var output;
var reader;  
var deviceid= "";
var macro_status='start';
// var socket = io.connect();
const socket= io();
let socketid;
socket.on('connect',()=> socketid = socket.io.engine.id);
 
function webstart(){
    socket.emit('NewClient',{web:"index"});
    document.getElementById('MSGstcmd').innerText = MSG_stcmd;
    document.getElementById('MSGmc1').innerText = MSG_mc1;
    document.getElementById('MSGmc2').innerText = MSG_mc2;
    document.getElementById('MSGmc3').innerText = MSG_mc3;
    document.getElementById('MSGmc4').innerText = MSG_mc4;
    // document.getElementById('MSGmconoff').innerText = MSG_mconoff;
    document.getElementById('MSGclrflash').innerText = MSG_clrflash;
    // document.getElementById('MSGastitle').innerText = MSG_astitle;
    //-----------------
    document.getElementById("portstatus").addEventListener("click", openport_Fn);
    document.getElementById("setastitle").addEventListener("click", setastitle_Fn);
    document.getElementById("restart").addEventListener("click", restart_Fn);    
    document.getElementById("comportset").addEventListener("click", comportset_Fn);  
    document.getElementById("setcmdtype").addEventListener("click",setcmdtype_Fn); 
    document.getElementById("rdcmdtype").addEventListener("click", rdcmdtype_Fn);  
    document.getElementById("rdfw").addEventListener("click", rdfw_Fn); 
    document.getElementById("rdbaud").addEventListener("click", rdbaud_Fn); 
    document.getElementById("showfwversion").addEventListener("click", showfwversion_Fn); 
    document.getElementById("rdcharset").addEventListener("click", rdcharset_Fn); 
    document.getElementById("rdcodepage").addEventListener("click", rdcodepage_Fn);
    document.getElementById("chkuser").addEventListener("click", chkuser_Fn);
    document.getElementById("clearflash").addEventListener("click", clearflash_Fn);
    document.getElementById("setmacro").addEventListener("click", setmacro_Fn);
    document.getElementById("execmacro").addEventListener("click", execmacro_Fn);
    document.getElementById("inputstr").addEventListener("click", inputstr_Fn);
    document.getElementById("setcp").addEventListener("click", stcodetable_Fn);  
    document.getElementById("setcharset").addEventListener("click", stcharset_Fn);
    document.getElementById("exemacrofile").addEventListener("click", exemacrofile_Fn);
    document.getElementById("openlogin").addEventListener("click", openLogin_Fn);
     
    
}

function sendCmd(e, command, v1,v2,v3,v4,v5){
    e.preventDefault();
    socket.emit('SYS_CMD', {
        id: deviceid,
        cmd: command,
        p1:v1,
        p2:v2,
        p3:v3,
        p4:v4,
        p5:v5,
    });
}
function openport_Fn(e){
    var status = document.getElementById('portstatus').value;
    if (status == "Open Port") {
        value = true;
    } else {
        value = false;
    }
    sendCmd(e,'OPENPORT',value)
}
function setastitle_Fn(e){
    sendCmd(e,'SAVEAS_TITLE')
}
function restart_Fn(e) {
    sendCmd(e,'RESTART')
}
function comportset_Fn(e) {
    var c = document.getElementById('comname');
    var com="";
    if(c.selectedIndex <0) 
        com ="ANY"
    else 
        com = c.options[c.selectedIndex].value;
    
    var b = document.getElementById('baudid');
    var baud = b.options[b.selectedIndex].value;
    var p = document.getElementById('parityid');
    var parity = p.options[p.selectedIndex].value;
    var l = document.getElementById('datalenid');
    var len = l.options[l.selectedIndex].value;
    var h = document.getElementById('httpid').value;
    var data = com + "," + baud + "," + parity + "," + len + "," + h;
    sendCmd(e,'COMPORTSET',data)
};
function setcmdtype_Fn(e) {
    var el = document.getElementById('selectid');
    var ct = el.options[el.selectedIndex].value;
    sendCmd(e,'SET_CMDTYPE',ct)
}
function rdcmdtype_Fn (e) {
    sendCmd(e,'RD_CMDTYPE')
};        
function rdfw_Fn (e) {
    sendCmd(e,'RD_FWVERSION')
};
function rdbaud_Fn(e) {
    sendCmd(e,'RD_BAUD')
};
function showfwversion_Fn (e) {
    sendCmd(e,'SHOW_FW_VER')
};
function rdcharset_Fn(e) {
    sendCmd(e,'RD_CHARSET')
};
function rdcodepage_Fn(e) {
    sendCmd(e,'RD_CODEPAGE')
};
function clearflash_Fn(e) {
    var el = document.getElementById('clearflashid');
    var ct = el.options[el.selectedIndex].value;
    sendCmd(e,'CLEAR_FLASH',ct)
};
function setmacro_Fn(e) {
    var val = document.getElementById("macrostage").value;
    if(macro_status == 'start') {
        document.getElementById("macrostage").value = "Stop Record Macro";
        var p1 = 'start';
        var p2 = document.getElementById("c_delay_id").value;
        var p3 = document.getElementById("exc_delay_id").value;
        var p4 = document.getElementById("bmp_delay_id").value;
        var p5 = document.getElementById("exec_mode_id").value;
        sendCmd(e,'SET_MACRO',p1,p2,p3,p4,p5);
        macro_status ='stop';
    }
    else {
        document.getElementById("macrostage").value = "Start Record Macro";
        var p1 = 'end';
        sendCmd(e,'SET_MACRO',p1);
        macro_status= 'start';
    }
};
function execmacro_Fn(e) {
    sendCmd(e,'EXEC_MACRO')
};
function inputstr_Fn(e) {
    var str = document.getElementById("in_text").value;
    sendCmd(e,'INPUT_TEXT',str)
};
function stcodetable_Fn(e) {
    var el = document.getElementById("codetable_val");
    var cs = el.options[el.selectedIndex].value;
    sendCmd(e,'CODEPAGE',cs)
};
function stcharset_Fn(e) {
    var el = document.getElementById("charset_val");
    var cs = el.options[el.selectedIndex].value;
    sendCmd(e,'SET_CHARSET',cs)
}; 
function exemacrofile_Fn(e) {
    var p1 = 'start';
    var p2 = document.getElementById("c_delay_id").value;
    var p3 = document.getElementById("exc_delay_id").value;
    var p4 = document.getElementById("bmp_delay_id").value;
    var p5 = document.getElementById("exec_mode_id").value;
    sendCmd(e,'SET_MACRO',p1,p2,p3,p4,p5)
    //-----
    var fpath = document.getElementById('macro_file').files[0];
    // readFile(fpath);
    var len = output.length;
    var arr = output.split(',');
    p1 =output;
    sendCmd(e,'RD_MACRO',p1)

    p1='end'
    sendCmd(e,'SET_MACRO', p1)

    sendCmd(e,'EXEC_MACRO')
}; 
function chkuser_Fn(e) {
    e.preventDefault();
    username = document.getElementById("uname").value;   
    password = document.getElementById("psw").value; 
    var port = location.port;
    document.getElementById('id01').style.display='none';
    var p1 = username
    var p2 = password
    sendCmd(e,'CHKUSER',p1,p2)
};
function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
}
//----------------------------------
socket.on('done', function(data) {
    document.getElementById("ID_Prnstatus").value= data.cmd;
    switch(data.cmd){
        case 'RDMF':
        case 'RDPNAME':
        case 'RDSERIAL':
        case 'RD_BAUD':
        case 'RD_CMDTYPE':
        case 'RD_CHARSET':
        case 'RD_CODEPAGE':
        case 'RD_FWVERSION':
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
socket.on('LoginSuccess', function(data) {
    document.getElementById("user_id").value = data.msg;
});
socket.on('LoginError', function(data) {
    document.getElementById("user_id").value ='';
    alert("Error: "+data.msg);
});
socket.on('Error', function(data) {
    alert("Error: "+data.msg);
});
socket.on('macrostep', function(data) {
    if(data.msg =="1"){
        document.getElementById("macrostage").value = "Stop Record Macro";
    }
    else {
        document.getElementById("macrostage").value = "Start Record Macro";
    }
});
socket.on('comadd', function(data) {
    // document.getElementById("httpid").value = data.http;
    var x = document.getElementById('comname');
    var option = document.createElement("option");
    option.text = data.hid;
    x.add(option);
    if (data.sel == data.hid) {
        option.selected = "selected";
    }
    if (data.b == 4800) {
        document.getElementById('baudid').selectedIndex = '0';
    } else if (data.b == 9600) {
        document.getElementById('baudid').selectedIndex = '1';
    } else if (data.b == 19200) {
        document.getElementById('baudid').selectedIndex = '2';
    } else if (data.b == 38400) {
        document.getElementById('baudid').selectedIndex = '3';
    } else {
        document.getElementById('baudid').selectedIndex = '4';
    }
    if (data.dl == 7) {
        document.getElementById('datalenid').selectedIndex = '0';
    } else {
        document.getElementById('datalenid').selectedIndex = '1';
    }
    var str = data.p;
    if (str == "none") {
        document.getElementById('parityid').selectedIndex = '0';
    } else if (str == "even") {
        document.getElementById('parityid').selectedIndex = '1';
    } else {
        document.getElementById('parityid').selectedIndex = '2';
    }
    document.getElementById('httpid').value = data.http;
});
socket.on('comstatus', function(data) {
    var step = data.step;
    if (step == "1") {
        document.getElementById('portstatus').value = 'Close Port';
        document.getElementById('portstatus').style.background = 'green';
        document.getElementById("ID_Prnstatus").value=('comport is opened');
    }else if (step == "2") {
        document.getElementById('portstatus').value = 'Opening...';
        document.getElementById('portstatus').style.background = 'red';
        document.getElementById("ID_Prnstatus").value=("Opening..."); 
    }
    else {
        document.getElementById('portstatus').value = 'Open Port';
        document.getElementById('portstatus').style.background = 'red';
        document.getElementById("ID_Prnstatus").value=('comport is closed');
    }
});
socket.on('user', function(data) {
    document.getElementById('uname').value = data.user;
    document.getElementById('psw').value = data.pwd; 
});
socket.on('statistics', function(data) {
    document.getElementById('mem_id').value = data.p1;
    document.getElementById('time_id').value = data.p2;
});

socket.on('deviceID', function(data) {
    deviceid = data.id;
    document.getElementById('deviceid').value = data.id;
    document.getElementById('version_id').value = 'V'+data.ver;
    document.getElementById('user_id').value = data.loguser;
    if(data.port != "") {
        var x = document.getElementById('comname');
        var option = document.createElement("option");
        option.text = data.port;
        x.add(option);
    }
    
});
//------------------------------------------------------
function checkFileAPI(e) {
    // e.preventDefault();
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true; 
    } else {
        alert("error check API");
        return false;
    }
}
function readFile(filePath) {
    checkFileAPI();
    if(filePath.files && filePath.files[0]) {     
           reader.readAsText(filePath.files[0]);  // display TEXT 
           reader.onload = function (e) {
            output = e.target.result;
        }; 
    }//end if html5 filelist support
    else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' + 
                 'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
            }
        }       
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }       
    return true;
}     
function openLogin_Fn(e){
    e.preventDefault();
    document.getElementById('id01').style.display='block';
    sendCmd(e,'GETUSER')
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
// };