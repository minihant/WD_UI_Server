var username;
var password;
var updateType=0;
var socket = io.connect();
var deviceid= "";

function webstart(require){
    socket.emit('NewClient',{web:"WP_Fontloader"});
    //-----------------
    document.getElementById("rdinfo").addEventListener("click", rdinfo_Fn);  
    document.getElementById("chkuser").addEventListener("click", chkuser_Fn);   
    document.getElementById("fontwrite").addEventListener("click", fontwrite_Fn);
    document.getElementById("openlogin").addEventListener("click", openLogin_Fn);
    document.getElementById("selftest").addEventListener("click", selftest_Fn);
}
function sendCmd(e, command, v1,v2,v3){
    e.preventDefault();
    socket.emit('PRN_CMD', {
        id: deviceid,
        cmd: command,
        p1:v1,
        p2:v2,
        p3:v3,
    });
}
// function comportset_Fn(e) {
//     var c = document.getElementById('comname');
//     var com = c.options[c.selectedIndex].value;
//     var b = document.getElementById('baudid');
//     var baud = b.options[b.selectedIndex].value;
//     var p = document.getElementById('parityid');
//     var parity = p.options[p.selectedIndex].value;
//     var l = document.getElementById('datalenid');
//     var len = l.options[l.selectedIndex].value;
//     var h = document.getElementById('httpid').value;
//     var data = com + "," + baud + "," + parity + "," + len + "," + h;
//     sendCmd(e,'COMPORTSET',data)
// };
function chkuser_Fn(e) {
    e.preventDefault();
    username = document.getElementById("uname").value;  
    password = document.getElementById("psw").value; 
    document.getElementById('id01').style.display='none';
    var p1 = username
    var p2 = password
    socket.emit('SYS_CMD', {
        id: deviceid,
        cmd: 'CHKUSER',
        p1:p1,
        p2:p2,
    });
};
function rdinfo_Fn(e){
    e.preventDefault();
    sendCmd(e,'WP_RDINFO')
}
function openLogin_Fn(e){
    e.preventDefault();
    document.getElementById('id01').style.display='block';
    socket.emit('SYS_CMD', {
        id: deviceid,
        cmd: 'GETUSER',
    });
} 
function rdname_Fn(e){
    e.preventDefault();
    sendCmd(e,'RDNAME')
} 
function rdflashid_Fn(e){
    e.preventDefault();
    sendCmd(e,'RDFLASHID')
} 
function rdfontcode_Fn(e){
    e.preventDefault();
    sendCmd(e,'RDFONTCODE')
}  
function selftest_Fn(e){
    e.preventDefault();
    sendCmd(e,'SELFTEST')
} 
function fontwrite_Fn(e) {
    e.preventDefault();
    document.getElementById("ID_Prnstatus").value=('Font Updating ....');
    sendCmd(e,'FONTWRITE');
}
function new_url(url_str){
    location.href = url_str+'?'+"id="+deviceid;
}
//----------------------------------
socket.on('done', function(data) {
    document.getElementById("ID_Prnstatus").value=data.msg;
});
socket.on('LoginSuccess', function(data) {
    document.getElementById("user_id").value=data.msg;
    document.getElementById("ID_Prnstatus").value="Login success!!!"
    updateType = 2;
});
socket.on('LoginError', function(data) {
    // document.getElementById("ID_Prnstatus").value= data.msg;
    alert(data.msg);
});
 
socket.on('progress', function(data) {
    var elem = document.getElementById("myBar");
    elem.style.width = data.msg + '%';
    elem.innerText = data.msg + '%';
});
socket.on('user', function(data) {
    document.getElementById('uname').value = data.user;
    document.getElementById('psw').value = data.pwd; 
});
socket.on('statistics', function(data) {
    document.getElementById('mem_id').value = data.p1;
    document.getElementById('time_id').value = data.p2;
});
// socket.on('start', function(data) {
//     document.getElementById('version_id').value = 'V'+data.p1;
//     document.getElementById('user_id').value = data.p2;
//     if(data.p3 == 'ENABLE'){
//         document.getElementById("mylable_id").style.visibility = "hidden";
//         document.getElementById("selfile_id").style.visibility = "hidden"; 
//         document.getElementById("getfile_id").style.visibility = "hidden"; 
//     }
//     document.getElementById('device_id').value = data.p4;
//     document.getElementById('fontcode').value = data.p5;
//     document.getElementById('flash_id').value = data.p6;
// });
socket.on('rcvpname', function(data) {
    document.getElementById('device_id').value = data.msg;
});
socket.on('flashid', function(data) {
    document.getElementById('flash_id').value = data.msg;
});
socket.on('fontcode', function(data) {
    document.getElementById('fontcode').value = data.msg;
});
socket.on('deviceID', function(data) {
    deviceid = data.id;
    document.getElementById('version_id').value = 'V'+data.ver;
    document.getElementById('user_id').value = data.loguser;
});
socket.on('Error', function(data) {
    alert("Error: "+data.msg);
});
 