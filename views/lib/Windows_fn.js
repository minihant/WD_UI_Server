var socket = io.connect();
var deviceid= "";
// var output;
var reader;  

function load(){
        socket.emit('NewClient',{web:"Windows"});
        document.getElementById("initial").addEventListener("click", initial_Fn);
        document.getElementById("clear").addEventListener("click",clear_Fn);
        document.getElementById("defwin1").addEventListener("click",defwin1_Fn);
        document.getElementById("defwin2").addEventListener("click",defwin2_Fn);
        document.getElementById("defwin3").addEventListener("click",defwin3_Fn);
        document.getElementById("defwin4").addEventListener("click",defwin4_Fn);
        document.getElementById("selwin1").addEventListener("click",selwin1_Fn);
        document.getElementById("selwin2").addEventListener("click",selwin2_Fn);
        document.getElementById("selwin3").addEventListener("click",selwin3_Fn);
        document.getElementById("selwin4").addEventListener("click",selwin4_Fn);
        document.getElementById("str1").addEventListener("click",str1_Fn);
        document.getElementById("str2").addEventListener("click",str2_Fn);
        document.getElementById("str3").addEventListener("click",str3_Fn);
        document.getElementById("str4").addEventListener("click",str4_Fn);
        document.getElementById('windowfile').addEventListener('change', readFile_Fn, true);
}
function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
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
 
function initial_Fn(e) {
    e.preventDefault();
    socket.emit('EPOS_CMD', {
        id: deviceid,
        cmd:'INITIAL',
    });
}
function clear_Fn(e) {
        e.preventDefault();
        socket.emit('EPOS_CMD', {
            id: deviceid,
            cmd:'CLEAR',
        });
        
}
function def_win(winno){
    var x;
    var y;
    var sx;
    var sy;
    var mode;
    var bkg;
    switch(winno){
        case 1:
            x= "x1";
            y= "y1";
            sx = "x1_size";
            sy= "y1_size";
            m = "mode_1";
            bkg ="bkg_1";
            break;
        case 2:
            x= "x2";
            y= "y2";
            sx = "x2_size";
            sy= "y2_size";
            m = "mode_2";
            bkg ="bkg_2";
            break;
        case 3:
            x= "x3";
            y= "y3";
            sx = "x3_size";
            sy= "y3_size";
            m = "mode_3";
            bkg ="bkg_3";
            break;
        case 4:
            x= "x4";
            y= "y4";
            sx = "x4_size";
            sy= "y4_size";
            m = "mode_4";
            bkg ="bkg_4";
            break;
    }
    ix= document.getElementById(x).value;
    iy=  document.getElementById(y).value;
    isx= document.getElementById(sx).value;
    isy= document.getElementById(sy).value;
    im= selected_winmode(m);
    ibkg= selected_winbkg(bkg);
    socket.emit('EPOS_CMD', {
        id: deviceid,
        cmd : 'DEF_WIN',
        wno: winno,
        x: ix,
        y: iy,
        sx: isx,
        sy: isy,
        m: im,
        bkg: ibkg,
    });

}
function defwin1_Fn(e) {
        e.preventDefault();
        def_win(1);
} 
function defwin2_Fn(e) {
        e.preventDefault();
        def_win(2);
}
function defwin3_Fn(e) {
        e.preventDefault();
        def_win(3);
}
function defwin4_Fn(e) {
    e.preventDefault();
    def_win(4);
}
function sel_win(winno){
    switch(winno){
        case 1:
            m = "mode_1";
            break;
        case 2:
            m = "mode_2";
            break;
        case 3:
            m = "mode_3";
            break;
        case 4:
            m = "mode_4";
            break;
    }
    // im= selected_winmode(m);
    socket.emit('EPOS_CMD', {
        id: deviceid,
        cmd : 'SEL_WIN',
        wno: winno,
        m: 0,
    });
}
function selwin1_Fn(e) {
        e.preventDefault();
        sel_win(1);
}
function selwin2_Fn(e) {
        e.preventDefault();
        sel_win(2);
}
function selwin3_Fn(e) {
        e.preventDefault();
        sel_win(3);
}
function selwin4_Fn(e) {
    e.preventDefault();
    sel_win(4);
}
function str1_Fn(e) {
        e.preventDefault();
        var val = document.getElementById("text1").value;
        socket.emit('EPOS_CMD', {
            id: deviceid,
            cmd: 'INPUT_TEXT',
            p1: val
        });
}
function str2_Fn(e) {
        e.preventDefault();
        var val = document.getElementById("text2").value;
        socket.emit('EPOS_CMD', {
            id: deviceid,
            cmd: 'INPUT_TEXT',
            p1: val
        });
}
function str3_Fn(e) {
        e.preventDefault();
        var val = document.getElementById("text3").value;
        socket.emit('EPOS_CMD', {
            id: deviceid,
            cmd: 'INPUT_TEXT',
            p1: val
        });
}
function str4_Fn(e) {
    e.preventDefault();
    var val = document.getElementById("text4").value;
    socket.emit('EPOS_CMD', {
        id: deviceid,
        cmd: 'INPUT_TEXT',
        p1: val
    });
}
function selected_winno(){
        var obj=document.getElementsByName("win_no");
		var val;
		for (var i=0; i<obj.length; i++) {
			if (obj[i].checked) {
                val=obj[i].value;
                break;
			}
        }
        return val;
}
function selected_winmode(mode){
    var obj=document.getElementsByName(mode);
	var val;
	for (var i=0; i<obj.length; i++) {
		if (obj[i].checked) {
            val=obj[i].value;
            break;
		}
    }
    return val;
}
function selected_winbkg(bkg){
        var obj=document.getElementsByName(bkg);
		var val;
		for (var i=0; i<obj.length; i++) {
			if (obj[i].checked) {
                val=obj[i].value;
                break;
			}
        }
        return val;
}

//---------------------------------------------
socket.on('done', function(data) {
    // $('#ID_Prnstatus').val(data.p1);
    switch(data.cmd){
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
socket.on('statistics', function(data) {
    document.getElementById('mem_id').value = data.p1;
    document.getElementById('time_id').value = data.p2;
}); 
socket.on('deviceID', function(data) {
    deviceid = data.id;
    document.getElementById('version_id').value = 'V'+data.ver;
    document.getElementById('user_id').value = data.loguser;
});  
socket.on('WINDOWDEF', function(data) {
    $('#ID_Prnstatus').val();
    var wno = data.msg.wno;
    switch(wno){
        case 1:
            document.getElementById('x1').value= data.msg.x1;
            document.getElementById('x1_size').value= data.msg.x2;
            document.getElementById('y1').value= data.msg.y1;
            document.getElementById('y1_size').value= data.msg.y2;
            document.getElementById('text1').value= data.msg.msg;
            setCheckedValueOfRadioButtonGroup('mode_1', data.msg.mode);
            setCheckedValueOfRadioButtonGroup('bkg_1', data.msg.background)
            break;
        case 2:
            document.getElementById('x2').value= data.msg.x1;
            document.getElementById('x2_size').value= data.msg.x2;
            document.getElementById('y2').value= data.msg.y1;
            document.getElementById('y2_size').value= data.msg.y2;
            document.getElementById('text2').value= data.msg.msg;
            setCheckedValueOfRadioButtonGroup('mode_2', data.msg.mode);
            setCheckedValueOfRadioButtonGroup('bkg_2', data.msg.background)
            break;
        case 3:
            document.getElementById('x3').value= data.msg.x1;
            document.getElementById('x3_size').value= data.msg.x2;
            document.getElementById('y3').value= data.msg.y1;
            document.getElementById('y3_size').value= data.msg.y2;
            document.getElementById('text3').value= data.msg.msg;
            setCheckedValueOfRadioButtonGroup('mode_3', data.msg.mode);
            setCheckedValueOfRadioButtonGroup('bkg_3', data.msg.background)
            break;
        case 4:
            document.getElementById('x4').value= data.msg.x1;
            document.getElementById('x4_size').value= data.msg.x2;
            document.getElementById('y4').value= data.msg.y1;
            document.getElementById('y4_size').value= data.msg.y2;
            document.getElementById('text4').value= data.msg.msg;
            setCheckedValueOfRadioButtonGroup('mode_4', data.msg.mode);
            setCheckedValueOfRadioButtonGroup('bkg_4', data.msg.background)
            break;
    }
});  
socket.on('Error', function(data) {
    alert("Error: "+data.msg);
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
//--------------------------------------------
// function readFile(filePath) {
//         checkFileAPI();
//         if(filePath.files && filePath.files[0]) {     
//                reader.readAsText(filePath.files[0]);  // display TEXT 
//                reader.onload = function (e) {
//                 output = e.target.result;
//             }; 
//         }//end if html5 filelist support
//         else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
//             try {
//                 reader = new ActiveXObject("Scripting.FileSystemObject");
//                 var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
//                 output = file.ReadAll(); //text contents of file
//                 file.Close(); //close file "input stream"
//             } catch (e) {
//                 if (e.number == -2146827859) {
//                     alert('Unable to access local files due to browser security settings. ' + 
//                      'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
//                      'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
//                 }
//             }       
//         }
//         else { //this is where you could fallback to Java Applet, Flash or similar
//             return false;
//         }       
//         return true;
// }         
function setCheckedValueOfRadioButtonGroup(vRadioObjName, vValue) {
    var radios = document.getElementsByName(vRadioObjName);
    for (var j = 0; j < radios.length; j++) {
        if (radios[j].value == vValue) {
            radios[j].checked = true;
            break;
        }
    }
}

function readFile_Fn(evt) {
    var f = evt.target.files[0]; 
    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
        let data = e.target.result;
        $("#previewtxt").text(data) 
        sendCmd(e,'RD_WINDOW',data);
      }
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
  }