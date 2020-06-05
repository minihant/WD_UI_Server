var updateType;
var socket = io.connect();
var deviceid= "";
var output;
var fpath="";
var url="";

function load(e){

        socket.emit('NewClient',{web:"Tools"});
        // document.getElementById('MSGtoolfw').innerText = MSG_fwupdate;
        // document.getElementById('MSGtoolfont').innerText = MSG_fontupdate;
        document.getElementById("FWwrite").addEventListener("click", FWwrite_Fun);
        document.getElementById("fontwrite").addEventListener("click", Fontwrite_Fun);
        document.getElementById("bmpwrite").addEventListener("click", bmpwrite_Fun);
        document.getElementById("chkuser").addEventListener("click", chkuser_Fun);
        document.getElementById("sendhexstr").addEventListener("click", sendhexstr_Fun);
        document.getElementById("dspbmp").addEventListener("click", dspbmp_Fun);
        document.getElementById("rdfontcode").addEventListener("click", rdfontcode_Fn);
        document.getElementById("rdboot").addEventListener("click", rdboot_Fn);
        document.getElementById("rdfw").addEventListener("click", rdfw_Fn);
        document.getElementById("rdmf").addEventListener("click", rdmf_Fn);
        document.getElementById("rdpname").addEventListener("click", rdpname_Fn);
        document.getElementById("rdser").addEventListener("click", rdser_Fn);
        document.getElementById("wrmf").addEventListener("click", wrmf_Fn);
        document.getElementById("wrpname").addEventListener("click", wrpname_Fn);
        document.getElementById("wrser").addEventListener("click", wrser_Fn);
        document.getElementById("fileInputControl").addEventListener("change", fileInputControlChangeEventHandler);
        document.getElementById("fw-uploader").addEventListener("change", FW_Uploader_Fun);
        document.getElementById("myBar").style.width = 0;

}    
function sendCmd(e, incmd, v1,v2,v3){
        e.preventDefault();
        socket.emit('SYS_CMD', {
                id: deviceid,
                cmd: incmd,
                p1: v1,
                p2:v2,
                p3:v3,
        });
}
 
function FW_Uploader_Fun(e) {
        e.preventDefault();
        updateType = 1;
        $('#ID_Prnstatus').val('File Updating ....');
        console.log(e.target.files[0]);
        fpath = e.target.files[0];

};


 
function Fontwrite_Fun(e) {
  updateType = 2;
  $('#ID_Prnstatus').val('Font Updating ....');
  sendCmd(e,'fontwrite');
  DisableButton();
};

function FWwrite_Fun(e){
  DisableButton();
  var reader = new FileReader();
  reader.onload = function(e) {
          output = reader.result;
          let form = new FormData();
          form.append("fname", fpath.name);
          form.append("contex", output);
          var newURL = url +':8081/FW_upload'+'?'+"id="+deviceid;
          fetch(newURL, { 
            method: 'POST',
            body: form,
          })
  }
  reader.readAsBinaryString(fpath);      
}
function bmpwrite_Fun(e) {
        updateType = 3;
        $('#ID_Prnstatus').val('BMP Updating ....');
        var radios = document.getElementsByName('bid');
        for (var i = 0, length = radios.length; i < length; i++)
        {
            if (radios[i].checked)
            {
                var bmpid = i;
                break;
            }
        }
        sendCmd(e,'bmpwrite',bmpid)
};
function chkuser_Fun(e) {
        e.preventDefault();
        username = this.uname.value;
        password = this.psw.value;
        var port = location.port;
        $.ajax({
            url: url + port + "/api/user/login",
            type: "POST",
            data: JSON.stringify({
                "name": username,
                "password": password
            }),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            error: function(xhr, ajaxOptions, thrownError) {
                alert("Login fail : " + thrownError);
            }
        });
};
function sendhexstr_Fun(e) {
        var str = document.getElementById("hexstr").value;
        sendCmd(e,'sendhexstr',str)
};
function dspbmp_Fun(e) {
        var radios = document.getElementsByName('bid');
        for (var i = 0, length = radios.length; i < length; i++)
        {
            if (radios[i].checked)
            {
                var bmpid = i;
                break;
            }
        }
        sendCmd(e,'showbmp',bmpid)
        $('#ID_Prnstatus').val('show bmp: ' + bmpid);
};
 
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
function new_url(url_str){
        location.href = url_str+'?'+"id="+deviceid;
}
function no_Fn(e){
        e.preventDefault();  
}
//--------------------------
socket.on('done', function(data) {
        $('#ID_Prnstatus').val(data.cmd);
        if(data.msg != ''){
                $('#ID_Prnstatus').val(data.msg);
        }
        switch(data.cmd){
                case 'RDMF':
                        $('#mf_txt').val(data.msg);
                        break;    
                case 'RDPNAME':
                        $('#pname_txt').val(data.msg);
                        break; 
                case 'RDSERIAL':
                        $('#serial_txt').val(data.msg);
                        break; 
                // case 'RD_FW':
                //         $('#ID_Prnstatus').val(data.msg);
                //         break; 
                // case 'RD_BOOT':
                //         $('#ID_Prnstatus').val(data.msg);
                //         break;
                // case 'RDFONTCODE':
                //         $('#ID_Prnstatus').val(data.msg);
                //         break;  
        }
});
socket.on('progress', function(data) {
        var elem = document.getElementById("myBar");
        elem.style.width = data.msg + '%';
        elem.innerText = data.msg + '%';
        $('#ID_Prnstatus').val('updateing ...' + data.msg + '%');
}); 
socket.on('LoginSuccess', function(data) {
        $('#ID_Prnstatus').val('Login : ' + data.id);
        if (updateType == 1) {
            socket.emit('FWwrite', {
                id: socket.id,
            });
        } else if(updateType == 2){
            socket.emit('fontwrite', {
                id: socket.id,
            });
        }else if(updateType == 3){
            var radios = document.getElementsByName('bid');
            for (var i = 0, length = radios.length; i < length; i++)
            {
                if (radios[i].checked)
                {
                    var bmpid = i;
                    break;
                }
            }
            socket.emit('bmpwrite', {
                id: socket.id,
                parm: bmpid
            });
        }
});
// socket.on('Error', function(data) {
//         $('#ID_Prnstatus').val('Login fail ' + data.parm);
// });
socket.on('Error', function(data) {
        alert("Error: "+data.msg);
    });
socket.on('Login', function(data){
        $('#ID_Prnstatus').val(data);
});
socket.on('rcvmf', function(data) {
        document.getElementById("mf_txt").value = data.p1;
});
socket.on('rcvpname', function(data) {
        document.getElementById("pname_txt").value = data.p1;
});
socket.on('rcvserial', function(data) {
        document.getElementById("serial_txt").value = data.p1;
});
socket.on('statistics', function(data) {
        document.getElementById('mem_id').value = data.p1;
        document.getElementById('time_id').value = data.p2;
});  
socket.on('deviceID', function(data) {
        deviceid = data.id;
        document.getElementById('version_id').value = 'V'+data.ver;
        document.getElementById('user_id').value = data.loguser;
        url = 'http://' + data.ip;
        
});  

socket.on('write_finish', function(data) { 
  EnableButton();
  $('#ID_Prnstatus').val('OK');
}); 
function DisableButton(){
  document.getElementById('fileInputControl').disabled = true;
  document.getElementById('savebmp').disabled = true;
  
  document.getElementById('rdfw').disabled = true;
  document.getElementById('rdmf').disabled = true;
  document.getElementById('rdpname').disabled = true;
  document.getElementById('rdser').disabled = true;
  document.getElementById('wrmf').disabled = true;
  document.getElementById('wrpname').disabled = true;
  document.getElementById('wrser').disabled = true;
  document.getElementById('dspbmp').disabled = true;
  
  document.getElementById('sendhexstr').disabled = true;
  document.getElementById('bmpwrite').disabled = true;
  document.getElementById('rdboot').disabled = true;
  document.getElementById('rdfontcode').disabled = true;
  document.getElementById('fw-uploader').disabled = true;
  document.getElementById('FWwrite').disabled = true;
  document.getElementById('fontfile-uploader').disabled = true;
  document.getElementById('fontupload').disabled = true;
  document.getElementById('fontwrite').disabled = true;
}
function EnableButton(){
  // document.getElementById('fw-uploader').style.visibility="visible";
  // document.getElementById('FWwrite').style.visibility="visible";
  // document.getElementById('fontfile-uploader').style.visibility="visible";
  // document.getElementById('fontupload').style.visibility="visible";
  // document.getElementById('fontwrite').style.visibility="visible";
  document.getElementById('fileInputControl').disabled = false;
  document.getElementById('savebmp').disabled = false;
  document.getElementById('rdfw').disabled = false;
  document.getElementById('rdmf').disabled = false;
  document.getElementById('rdpname').disabled = false;
  document.getElementById('rdser').disabled = false;
  document.getElementById('wrmf').disabled = false;
  document.getElementById('wrpname').disabled = false;
  document.getElementById('wrser').disabled = false;
  document.getElementById('dspbmp').disabled = false;
  document.getElementById('sendhexstr').disabled = false;
  document.getElementById('bmpwrite').disabled = false;
  document.getElementById('rdboot').disabled = false;
  document.getElementById('rdfontcode').disabled = false;
  document.getElementById('fw-uploader').disabled = false;
  document.getElementById('FWwrite').disabled = false;
  document.getElementById('fontfile-uploader').disabled = false;
  document.getElementById('fontupload').disabled = false;
  document.getElementById('fontwrite').disabled = false;
}
function fileInputControlChangeEventHandler(e){
  fpath = e.target.files[0]; 
  var fileReader = new FileReader();
  fileReader.readAsDataURL(fpath); 
  fileReader.onload = function(e) { 
    let dataUrl = e.target.result;
    $("#preview").attr("src",`${dataUrl}`)
  }       
}
 
function readFile(filePath) {
        // checkFileAPI();
       
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