
// const SDK_version = "2.0.1";
// const Default_DeviceName = "WD-2027";
const SET_CMD_TYPE = [0x02, 0x05, 0x43];
const SHOW_FW_VERSION = [0x02, 0x05, 0x56, 0x01, 0x03];
const SET_BAUDRATE = [0x02, 0x05, 0x42];
const SELECT_CHARSET = [0x02, 0x05, 0x54,0x00,0x03];
const SET_CODETABLE = [0x02, 0x05, 0x55,0x00,0x03];
const DISPLAY_RESTART = [0x02, 0x05, 0x40, 0x30, 0x03];
const SET_AS_TITLE_DATA = [0x02, 0x05, 0x08, 0x31, 0x03];
const CLEAR_FLASH_DATA = [0x02, 0x05, 0x07];
const READ_CMD_TYPE= [0x02, 0x05, 0x49, 0x43, 0x03];
const READ_FW_VERSION = [0x02, 0x05, 0x49, 0x56, 0x03];
const READ_BAUD =[0x02, 0x05, 0x49, 0x42, 0x03];   
const READ_CHARSET =[0x02, 0x05, 0x49, 0x54, 0x03];
const READ_CODEPAGE = [0x02, 0x05, 0x49, 0x55, 0x03];
const SHOW_BMP = [0x02, 0x05, 0xbb, 0x00, 0x03];

const SET_PARITY = [0x02, 0x05, 0x50];
const SET_DATA_LENGTH = [0x02, 0x05, 0x4c];
const SET_ICHARSET = [0x02, 0x05, 0x53];

//--------------------------
const fs = require('fs');
var WP = require('./WP_Global.js');
var Login = require('./Login.js');
// var CONFIG = WP.CONFIG;
//-------------------------
async function BMP_Download(data,filename) {
    var msg;
    var cksum = 0;
    const block_size = 128;

    //---Select Internal file or Upload file ----------------------
    // var BMP_NAME = null;
    // if (fs.existsSync('./upload/b0.bmp')) {
    //     BMP_NAME = './upload/b0.bmp';
    // } else {
    //     BMP_NAME = './resource/b0.bmp';
    // }
    // WP.ShowMsg("Open file: " + FONT_NAME + '(' + total_size + ')');
    BMP_NAME = './upload/'+filename;
    if (fs.existsSync('./upload/'+filename)) {
        BMP_NAME = ('./upload/'+filename);
    } else {
        // FW_NAME = ('./resource/fw.hex');
        return false;
    }
    var FontData = fs.readFileSync(BMP_NAME);
    var total_size = FontData.byteLength;
    //WP.ShowMsg("read file: " + total_size);
    //--- Prepare download Font Header command --------------
    var BMPDL_header = [0x02, 0x05, 0xaa, 0xee, 0x03];
    // WP.ShowMsg("command = " +
    //     FWDL_header[0].toString(16) +
    //     ':' + FWDL_header[1].toString(16) +
    //     ':' + FWDL_header[2].toString(16) +
    //     ':' + FWDL_header[3].toString(16));
    WP.PortWrite(BMPDL_header,data);

    //--- Prepare Font Length -------------------------------
    var FW_LEN = [0x00, 0x00, 0x00, 0x00];
    FW_LEN[0] = total_size & 0xff;
    FW_LEN[1] = (total_size >> 8) & 0xff;
    FW_LEN[2] = (total_size >> 16) & 0xff;
    FW_LEN[3] = (total_size >> 24) & 0xff;
    //WP.ShowMsg("file length = " + total_size);
    WP.PortWrite(FW_LEN,data);

    //---- Prepare check sum -----------------------------
    var FW_CKS = [0x00, 0x00, 0x00, 0x00,0x00];
    for (cnt = 0; cnt < total_size; cnt++) {
        cksum += FontData[cnt];
    }
    FW_CKS[0] = cksum & 0xff;
    FW_CKS[1] = (cksum >> 8) & 0xff;
    FW_CKS[2] = (cksum >> 16) & 0xff;
    FW_CKS[3] = (cksum >> 24) & 0xff;
    FW_CKS[4] = parseInt(data.p1);
    // WP.ShowMsg("checksum = " +
    //     FW_CKS[3].toString(16) +
    //     ':' + FW_CKS[2].toString(16) +
    //     ':' + FW_CKS[1].toString(16) +
    //     ':' + FW_CKS[0].toString(16));
    WP.RcvState = WP.STATE_DOWNLOADFONT;
    WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
    WP.rcvok = false;
    WP.PortWrite(FW_CKS,data);
    await WP._delay(10);
    //--------------------------------------
    FONT_update_process = true;
    while (WP.rcvok == false) {
        await WP._delay(100);
        if (FONT_update_process == false) {
            WP.ShowMsg('download NG');
            return false;
        }
    }

    console.log("Start BMP update : " + BMP_NAME + '(' + total_size + ')');
    //--- download by block size -------
    for (let begin_idx = 0; begin_idx < total_size;) {
        var len;
        if ((begin_idx + block_size) < total_size)
            len = block_size;
        else
            len = total_size - begin_idx;

        var buf = new Buffer.alloc(len);
        FontData.copy(buf, 0, begin_idx, (begin_idx + len));
        begin_idx += len;

        WP.RcvState = WP.STATE_DOWNLOADFONT;
        // WP.IF_SocketSend('RCVSTATE',WP.RcvState);
        WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
        WP.rcvok = false;
        WP.PortWrite(buf,data);
        //----------------------------------------
        while (WP.rcvok == false) {
            await WP._delay(2);
            if (FONT_update_process == false) {
                WP.ShowMsg('download NG');
                return false;
            }
        }
        //--- update progress bar -----------------------------
        var progress = Math.floor(begin_idx / total_size * 100); // float to integer
        WP.UI_Send('progress', {msg:progress, id:data.id});
        //--- send finish message ------------------------------
        if (begin_idx >= total_size) {
            WP.ShowMsg('BMP download Finish!!! ' + '(' + begin_idx + ')');
            msg = 'BMP update Success !!!';
            WP.UI_Send('done', {msg:msg,id:data.id});
            return true;
        }
    }
}
async function Font_Download(data,filename) {
    var msg;
    var cksum = 0;
    const block_size = 128;
    process.env.ENGINEERING_MOD = "OFF";
    //---Select Internal file or Upload file ----------------------
    // var FONT_NAME = null;
    // if (fs.existsSync('./upload/font.Tsk')) {
    //     FONT_NAME = './upload/font.Tsk';
    // } else {
    //     FONT_NAME = './resource/font.Tsk';
    // }
    // WP.ShowMsg("Open file: " + FONT_NAME + '(' + total_size + ')');
    FONT_NAME = './upload/'+filename;
    if (fs.existsSync('./upload/'+filename)) {
        FONT_NAME = ('./upload/'+filename);
    } else {
        // FW_NAME = ('./resource/fw.hex');
        return false;
    }
    var FontData = fs.readFileSync(FONT_NAME);
    var total_size = FontData.byteLength;
    //WP.ShowMsg("read file: " + total_size);
    //--- Prepare download Font Header command --------------
    var FWDL_header = [0x02, 0x05, 0xaa, 0xcc, 0x03];
    // WP.ShowMsg("command = " +
    //     FWDL_header[0].toString(16) +
    //     ':' + FWDL_header[1].toString(16) +
    //     ':' + FWDL_header[2].toString(16) +
    //     ':' + FWDL_header[3].toString(16));
    WP.PortWrite(FWDL_header,data);

    //--- Prepare Font Length -------------------------------
    var FW_LEN = [0x00, 0x00, 0x00, 0x00];
    FW_LEN[0] = total_size & 0xff;
    FW_LEN[1] = (total_size >> 8) & 0xff;
    FW_LEN[2] = (total_size >> 16) & 0xff;
    FW_LEN[3] = (total_size >> 24) & 0xff;
    //WP.ShowMsg("file length = " + total_size);
    WP.PortWrite(FW_LEN,data);

    //---- Prepare check sum -----------------------------
    var FW_CKS = [0x00, 0x00, 0x00, 0x00];
    for (cnt = 0; cnt < total_size; cnt++) {
        cksum += FontData[cnt];
    }
    FW_CKS[0] = cksum & 0xff;
    FW_CKS[1] = (cksum >> 8) & 0xff;
    FW_CKS[2] = (cksum >> 16) & 0xff;
    FW_CKS[3] = (cksum >> 24) & 0xff;
    // WP.ShowMsg("checksum = " +
    //     FW_CKS[3].toString(16) +
    //     ':' + FW_CKS[2].toString(16) +
    //     ':' + FW_CKS[1].toString(16) +
    //     ':' + FW_CKS[0].toString(16));
    WP.RcvState = WP.STATE_DOWNLOADFONT;
    // WP.IF_SocketSend('RCVSTATE',WP.RcvState);
    WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
    WP.rcvok = false;
    WP.PortWrite(FW_CKS,data);
    await WP._delay(10);
    //--------------------------------------
    FONT_update_process = true;
    while (WP.rcvok == false) {
        await WP._delay(100);
        if (FONT_update_process == false) {
            WP.ShowMsg('download NG');
            return;
        }
    }

    console.log("Start FONT update : " + FONT_NAME + '(' + total_size + ')');
    await WP._delay(100);
    //--- download by block size -------
    for (let begin_idx = 0; begin_idx < total_size;) {
        var len;
        if ((begin_idx + block_size) < total_size)
            len = block_size;
        else
            len = total_size - begin_idx;

        var buf = new Buffer.alloc(len);
        FontData.copy(buf, 0, begin_idx, (begin_idx + len));
        begin_idx += len;

        WP.RcvState = WP.STATE_DOWNLOADFONT;
        // WP.IF_SocketSend('RCVSTATE',WP.RcvState);
        WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
        WP.rcvok = false;
        // WP.PortWrite(buf);
        WP.PortWrite(buf,data);
        //----------------------------------------
        while (WP.rcvok == false) {
            await WP._delay(2);
            if (FONT_update_process == false) {
                WP.ShowMsg('download NG');
                return false;
            }
        }
        //--- update progress bar -----------------------------
        var progress = Math.floor(begin_idx / total_size * 100); // float to integer
        WP.UI_Send('progress', {msg:progress, id:data.id});
        //--- send finish message ------------------------------
        if (begin_idx >= total_size) {
            WP.ShowMsg('Font download Finish!!! ' + '(' + begin_idx + ')');
            msg = 'Font update Success !!!';
            WP.UI_Send('done', {msg:msg,id:data.id});
            return true;
        }
    }
}

async function FW_Download(data) {
    var msg;
    process.env.ENGINEERING_MOD = "OFF";
    //---Select Internal file or Upload file  
    // if (fs.existsSync('./upload/fw.hex')) {
    //     FW_NAME = ('./upload/fw.hex');
    // } else {
    //     FW_NAME = ('./resource/fw.hex');
    // }
    //WP.ShowMsg('Open file :' + FW_NAME);
    FW_NAME = './upload/'+filename;
    if (fs.existsSync('./upload/'+filename)) {
        FW_NAME = ('./upload/'+filename);
    } else {
        // FW_NAME = ('./resource/fw.hex');
        return ;
    }
    var FontData = fs.readFileSync(FW_NAME);
    var total_size = FontData.byteLength;
    WP.ShowMsg("update FW file : " + FW_NAME + '(' + total_size + ')');
    //--- Prepare download Font Header command --------------
    var FWDL_header = [0x02, 0x05, 0xaa, 0xbb, 0x03];
    // WP.ShowMsg("command = " +
    //     FWDL_header[0].toString(16) +
    //     ':' + FWDL_header[1].toString(16) +
    //     ':' + FWDL_header[2].toString(16) +
    //     ':' + FWDL_header[3].toString(16));

    WP.PortWrite(FWDL_header,data);

    //--- Prepare Font Length -------------------------------
    var FW_LEN = [0x00, 0x00, 0x00, 0x00];
    FW_LEN[0] = total_size & 0xff;
    FW_LEN[1] = (total_size >> 8) & 0xff;
    FW_LEN[2] = (total_size >> 16) & 0xff;
    FW_LEN[3] = (total_size >> 24) & 0xff;
    //WP.ShowMsg("file length = " + total_size);
    WP.PortWrite(FW_LEN,data);

    //---- Prepare check sum -----------------------------
    var cksum = 0;
    var FW_CKS = [0x00, 0x00, 0x00, 0x00];
    for (cnt = 0; cnt < total_size; cnt++) {
        cksum += FontData[cnt];
    }
    FW_CKS[0] = cksum & 0xff;
    FW_CKS[1] = (cksum >> 8) & 0xff;
    FW_CKS[2] = (cksum >> 16) & 0xff;
    FW_CKS[3] = (cksum >> 24) & 0xff;
    // WP.ShowMsg("checksum = " +
    //     FW_CKS[3].toString(16) +
    //     ':' + FW_CKS[2].toString(16) +
    //     ':' + FW_CKS[1].toString(16) +
    //     ':' + FW_CKS[0].toString(16));
    //----------------------------------
    WP.RcvState = WP.STATE_DOWNLOADFONT;
    // WP.IF_SocketSend('RCVSTATE',WP.RcvState);
    WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
    WP.rcvok = false;
    WP.PortWrite(FW_CKS,data);
    // await WP._delay(5000);
    FONT_update_process = true;
    while (WP.rcvok == false) {
        await WP._delay(1);
        if (FONT_update_process == false) {
            WP.ShowMsg('download NG');
            return;
        }
    }
    console.log("Start FW update !!!");
    //------------------------------------
    for (let begin_idx = 0; begin_idx < total_size;) {
        var idx = FontData.indexOf(0x0a, begin_idx, "hex") + 1;
        var len = idx - begin_idx;
        var buf = FontData.slice(begin_idx, idx);
        //---------------------------------------
        WP.PortWrite(buf,data);
        await WP._delay(2);
        //----------------------------------
        begin_idx += len;
        var progress = Math.floor(begin_idx / total_size * 100); // float to integer
        WP.UI_Send('progress', {msg:progress, id:data.id});
        if (begin_idx >= total_size) {
            msg = 'FW update Success !!!';
            WP.ShowMsg(msg + '(' + begin_idx + ')');
            WP.UI_Send('done', {msg:msg,id:data.id});
            return true;
        }
    }
}
async function sendFileData(data){
        var datasize = data.fdata.length;
        console.log("file size = "+ datasize );
        WP.IF_SocketSend('FSIZE',{msg: datasize, id: data.id});
        var BufferSize = datasize;
        var PktSize= 1024;
        var BufferIndex = 0;
        while (BufferSize > 0)
        {
            SendCnt = BufferSize - PktSize;
            if (SendCnt <= 0) SendCnt = BufferSize; 
            else SendCnt = PktSize;
            var SendBuf = Buffer.alloc(SendCnt);
            // copy a page data form file buffer
            data.fdata.copy(SendBuf,0,BufferIndex, SendCnt+BufferIndex);
            BufferIndex += SendCnt;
            BufferSize -= SendCnt;
            WP.IF_SocketSend('FPACK',{msg:SendBuf, id: data.id});
            WP._delay(50);
        }
        WP.IF_SocketSend('PACK_FINISH',{msg:SendBuf,type: data.type, id: data.id});
        console.log("send file Finish !!!"); 
}
async function sendFontData(data){
    var datasize = data.fdata.length;
    console.log("file size = "+ datasize );
    WP.IF_SocketSend('FSIZE',{msg: datasize, id: data.id});
    var BufferSize = datasize;
    var PktSize= 1024;
    var BufferIndex = 0;
    while (BufferSize > 0)
    {
        SendCnt = BufferSize - PktSize;
        if (SendCnt <= 0) SendCnt = BufferSize; 
        else SendCnt = PktSize;
        var SendBuf = Buffer.alloc(SendCnt);
        // copy a page data form file buffer
        data.fdata.copy(SendBuf,0,BufferIndex, SendCnt+BufferIndex);
        BufferIndex += SendCnt;
        BufferSize -= SendCnt;
        WP.IF_SocketSend('FPACK',{msg:SendBuf, id: data.id});
        WP._delay(50);
    }
    WP.IF_SocketSend('PACK_FINISH',{msg:SendBuf,type: data.type, id: data.id});
    console.log("send file Finish !!!"); 
    return true;
}  
//-------------------------------------
function _SetcmdType(str) {
    var type;
    WP.CmdType= str;
    switch (str) {
        case "DSP800":
            type = '0';
            break;
        case "ESC/POS":
            type = '1';
            break;
        case "POS7300":
            type = '2';
            break;
        case "ADM788":
            type = '3';
            break;
        case "AEDEX":
            type = '4';
            break;
        case "UTC/P":
            type = '5';
            break;
        case "UTC/S":
            type = '6';
            break;
        case "CD5220":
            type = '7';
            break;
        default:
            WP.CmdType='ESC/POS';
            type = '8';
            break;
    }
    var b = Array.from(SET_CMD_TYPE);
    b.push(type.charCodeAt(0));
    b.push(0x03);
    return [b,'set command: '+str];
}
function _Restart() {
    var b = Array.from(DISPLAY_RESTART);
    return [b,'Restart'];
}
function _RdcmdType(){
    var b = Array.from(READ_CMD_TYPE);
    return [b,'Read command: '];
}
function _RdFWVersion(){
    var b = Array.from(READ_FW_VERSION);
    return [b,'Read FW version'];
}
function _RdBaud(){
    var b = Array.from(READ_BAUD);
    return [b,'Read Baud rate'];
}
function _ReadCharset(){
    var b = Array.from(READ_CHARSET);
    return [b,'Read Baud rate'];
}
function _ReadCodePage(){
    var b = Array.from(READ_CODEPAGE);
    return [b,'Read Baud rate'];
}
function _ShowFWVersion() {
    var b = Array.from(SHOW_FW_VERSION);
    return [b,'show firmware version'];
}
function _SetAsTitltData() {
    var b = Array.from(SET_AS_TITLE_DATA);
    return [b,'save as title'];
}
function _Clearflashdata(n) {
    var ct;
    switch (n) {
        case "0":
            ct = '0';
            break;
        case "1":
            ct = '1';
            break;
        case "2":
            ct = '2';
            break;
        default:
            ct = '0';
            break;
    }
    var b = Array.from(CLEAR_FLASH_DATA);
    b.push(ct.charCodeAt(0));
    b.push(0x03);
    return [b,'clear flash: '+n];
}
function _SetMacro(p, p1,p2,p3,p4){
    if(p == "start"){
        var b = [0x02, 0x05, 0xAA, 0xFF, 0x03,0x00, 0x00, 0x00, 0x00];
        b[5] = p1;
        b[6] = p2;
        b[7] = p3;
        b[8] = p4;
        WP.gMacroStep = "1";
    }
    else{
        var b = [0x02, 0x05, 0xAA, 0xFF, 0x03];
        WP.gMacroStep = "0";
    }
    return [b,'set macro: '+p]
}
function _ExecMacro(){
    const b = [0x02, 0x05, 0xCC, 0xAA, 0x03];
    return[b,'execute macro'];
}
function _SetBaudRate(baud, parity, datalen) {
    var b;
    var p;
    var dl;
    switch (baud) {
        case "4800":
            baud = '1';
            break;
        case "9600":
            baud = '0';
            break;
        case "19200":
            baud = '7';
            break;
        case "38400":
            baud = '6';
            break;
        case "115200":
            baud = '9';
            break;
        default:
            baud = '1';
            break;
    }
    switch (parity) {
        case "NONE":
            p = '0';
            break;
        case "EVEN":
            p = '1';
            break;
        case "ODD":
            p = '2';
            break;
        default:
            p = '0';
            break;
    }
    switch (datalen) {
        case "7":
            dl = '7';
            break;
        case "8":
            dl = '8';
            break;
        default:
            dl = '8';
            break;
    }
    // var b1 = AppendBuffer(SET_BAUDRATE, Buffer.from(b, 'utf-8'));
    // var b2 = AppendBuffer(b1, SET_PARITY);
    // var b3 = AppendBuffer(b2, Buffer.from(p, 'utf-8'));
    // var b4 = AppendBuffer(b3, SET_DATA_LENGTH);

    // return buf;
    b = Array.from(SET_BAUDRATE);
    b.push(baud.charCodeAt(0));
    b.push(0x03);
    //b.push([SET_PARITY]);
    b.push(0x02);
    b.push(0x05);
    b.push(0x50);
    b.push(p.charCodeAt(0));
    b.push(0x03);
    // b.push(SET_DATA_LENGTH);
    b.push(0x02);
    b.push(0x05);
    b.push(0x4c);
    b.push(dl.charCodeAt(0));
    b.push(0x03);
    return [b,'set comport'];
}
function _WriteString(fontcode,str){
    var new_str;
    switch (fontcode) {
        case 'TAIWAN BIG-5':
        case 'TAIWAN BIG-5E':
            new_str = iconv.encode(Buffer.from(str), 'Big5');
            break;
        case 'CHINA GB18030':
            new_str = iconv.encode(Buffer.from(str), 'gb18030');
            break;
        case 'CHINA GB2312':
            new_str = iconv.encode(Buffer.from(str), 'gb2312');
            break;
        case 'KANJI JAPANESE':
            var buf = Buffer.from(str);
            if (WP.JIS_Mode == 'sjis')
                new_str = JISencoding.convert(buf, 'SJIS', 'UTF8');
            else if (WP.JIS_Mode == 'jis')
                new_str = JISencoding.convert(buf, 'EUCJP', 'UTF8');

            break;
        case 'KOREA KSC5601':
            new_str = iconv.encode(Buffer.from(str), 'ksc5601');
            break;
        case 'UNICODE':
            // data.parm = iconv.encode(Buffer.from(data.parm), 'utf16');
            new_str=str;
            break;
        default:
            // var result=[];
            // for (var i = 0; i < str.length; i += 2) {
            //     result.push(parseInt(str.substr(i, 2), 16));
            // }
            new_str= str;
            break;
    }
    return[new_str,'write string: '+ str];
}
function _SetCodeTable(n) {
    var b = Array.from(SET_CODETABLE);
    b[3]=n;
    return [b,'set codepage: '+n];
}
function _SetCharset(cs) {
    var b = Array.from(SELECT_CHARSET);
    b[3] =parseInt(cs);
    b.push(parseInt(cs)+0x30);
    b.push(0x3D, 0x20, 0x23, 0x24, 0x40, 0x5b, 0x5c, 0x5d, 0x5e, 0x60, 0x7b, 0x7c, 0x7d, 0x7e);
    b.push(0x0d,0x0a); 
    return [b,'set charset: '+cs];
}
function _ShowBMP(n) {
    var b = Array.from(SHOW_BMP);
    b[3]= parseInt(n);
    return [b,'show bmp: '+n];
}
function _HexString(str) {
    var b=[];
    var hexString = str.replace(/[\x2c,\x20,\x0d,\x0a]/g,'');
    for (var i = 0; i < hexString.length; i += 2) {
        b.push(parseInt(hexString.substr(i, 2), 16));
    }
    return [b, 'send Hex data'];
}
function _ReadMacro(data){
    var arr = data.replace(/(\r\n|\n|\r|' ')/gm,"").trim().split(','); 
    var b=[];
    arr.forEach((function(item) {
        // console.log(item);
        if(item != "") {
            b.push(parseInt(item,16));
        }
    }))
    return [b, 'read macro'];
}
function API_SYS_COMPORT_SET(data) {
    var arr = data.p1.split(",");
    var msg;
    var arr = data.p1.split(",");
    msg=WP.WriteStream( _SetBaudRate(arr[1], arr[2], arr[3]),data);
    return msg;
}
function _ReadFontCode(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x45];
    return [b,'Read Font Code'];
}
function _ReadBootVer(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x40];
    return [b,'Read Boot Version'];
}
function _ReadFirmwareVer(){
    const b =  [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x41];
    return [b,'Read FW Version'];
}
function _ReadManufacture(){
    const b =   [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x42];
    return [b,'Read Manufacture'];
}
function _ReadPname(){
    const b =   [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x43];
    return [b,'Read Product Name'];
}
function _ReadSerial(){
    const b = [0x1f, 0x28, 0x42, 0x02, 0x00, 0x30, 0x44];
    return [b,'Read Serial Number'];
}
function _WriteManufacture(str){
    const b = [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x00];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Manufacture : '+str];
}
function _WritePname(str){
    const b =  [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x01];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Pname : '+str];
}
function _WriteSerialNumber(str){
    const b =  [0x02, 0x05, 0xAA, 0xDD, 0x03, 0x02];
    b.push(str.length);
    for (var i = 0; i < str.length; i++) {
        b.push(str.charCodeAt(i));
    }
    return [b,'Write Serial : '+str];
}
//----------------------
module.exports = {
    _SysCmdParser: async function(data){
        var msg;
        switch(data.cmd){
            case 'OPENPORT':
                WP.IF_SocketSend('OPENPORT',data);
                return;
            case 'RESTART':
            case 'restart':
                msg = WP.WriteStream( _Restart(),data);
                break;
            case 'COMPORTSET':
                msg = API_SYS_COMPORT_SET(data);
                // WP.UI_Send('done', {msg:msg,id:data.id});
                console.log("port change:"+msg.p1);
                break;
            case 'SET_CMDTYPE':
            case 'setcmdtype':
                msg = WP.WriteStream(_SetcmdType(data.p1),data);
                break;
            case 'RD_CMDTYPE':
                WP.RcvState = WP.STATE_GETCMDTYPE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _RdcmdType(),data);
                break;
            case 'RD_FWVERSION':
                WP.RcvState = WP.STATE_GETFIRMWARE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _RdFWVersion(),data);
                break;
            case 'RD_BAUD':
                WP.RcvState = WP.STATE_GETBAUDRATE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _RdBaud(),data);
                break;
            case 'SHOW_FW_VER':
                msg = WP.WriteStream( _ShowFWVersion(),data);
                break;
            case 'RD_CHARSET':
                WP.RcvState = WP.STATE_GETCHARSET;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadCharset(),data);
                break;
            case 'RD_CODEPAGE':
                WP.RcvState = WP.STATE_GETCODEPAGE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadCodePage(),data);
                // msg = "read code page";
                break; 
            case 'SAVEAS_TITLE':
                msg = WP.WriteStream( _SetAsTitltData(),data);
                break;
            case 'CLEAR_FLASH':
                msg = WP.WriteStream( _Clearflashdata(data.p1),data);
                break;
            case 'SET_MACRO':
                if(data.p1 =='start'){
                    msg = WP.WriteStream( _SetMacro(data.p1,data.p2,data.p3,data.p4,data.p5),data);
                }
                else{
                    msg = WP.WriteStream( _SetMacro(data.p1),data);
                }
                break;
            case 'EXEC_MACRO':
                msg = WP.WriteStream( _ExecMacro(),data);
                break;
            case 'RD_MACRO':
                msg = WP.WriteStream( _ReadMacro(data.p1),data); 
                break;
            case 'INPUT_TEXT':
                msg = WP.WriteStream( _WriteString(WP.Font_code,data.p1),data); 
                break;
            case 'CODEPAGE':  
                msg = WP.WriteStream( _SetCodeTable(data.p1),data); 
                break;
            case 'SET_CHARSET':
                msg = WP.WriteStream( _SetCharset(data.p1),data);   
                break; 
            case 'RDFONTCODE':  
                WP.RcvState = WP.STATE_READ_FONTCODE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadFontCode(data.p1),data);  
                break;
            case 'RDBOOT':
                WP.RcvState = WP.STATE_READ_BOOT; 
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});  
                msg = WP.WriteStream( _ReadBootVer(data.p1),data);  
                break;
            case 'RDFW':
                WP.RcvState = WP.STATE_READ_FW;  
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id}); 
                msg = WP.WriteStream( _ReadFirmwareVer(data.p1),data);  
                break;
            case 'RDMF':  
                WP.RcvState = WP.STATE_READ_MANUFACTURE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadManufacture(),data); 
                break;
            case 'RDPNAME':
                WP.RcvState = WP.STATE_READ_MODELNAME;  
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadPname(),data); 
                break;
            case 'RDSERIAL':
                WP.RcvState = WP.STATE_READ_SERIAL;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id});
                msg = WP.WriteStream( _ReadSerial(),data); 
                break;
            case 'WRMF':  
                if(process.env.ENGINEERING_MOD == 'ON')
                    msg = WP.WriteStream( _WriteManufacture(data.p1),data); 
                else 
                    msg= 'not engineering mode!!!' 
                break;
            case 'WRPNAME':   
                if(process.env.ENGINEERING_MOD == 'ON')
                    msg = WP.WriteStream( _WritePname(data.p1),data);   
                else 
                    msg= 'not engineering mode!!!' 
                break;
            case 'WRSER': 
                if(process.env.ENGINEERING_MOD == 'ON')
                    msg = WP.WriteStream( _WriteSerialNumber(data.p1),data);    
                else 
                    msg= 'not engineering mode!!!'   
                break;
            case 'sendhexstr':
            case 'hexdata':
                msg = WP.WriteStream( _HexString(data.p1),data);  
                break;
            case 'showbmp':
                msg = WP.WriteStream( _ShowBMP(data.p1),data);  
                break;
            case 'bmpwrite':
                for(let[key,obj] of WP.connectedDev){
                    if(obj.id == data.id){
                        const check = await WP.CheckToken(data.id);
                        if (  check != null) {
                            let fname ="";
                            if(obj.filename == ""){
                                fname = "b0.bmp";
                            }
                            else{
                                fname = obj.filename;
                            }
                            var result = BMP_Download(data,fname);
                            if (result == true) {
                                msg = 'BMP Download Success !!!';
                            }
                            else {
                                msg = 'BMP Download Fail !!!';
                            }
                        }
                        else{               
                            msg = 'Time Expire ,Please Login again';
                            console.log(msg);
                        }
                        break;
                    }
                }
                return;
                break;
            case 'fontwrite':
                for(let[key,obj] of WP.connectedDev){
                    if(obj.id == data.id){
                        const check = await WP.CheckToken(data.id);
                        if (  check != null) {
                            var FontName = obj.filename;
                            var FontData = fs.readFileSync('./upload/'+FontName);
                            console.log('file('+FontName+ ') :'+ FontData.length );
                            var result = await sendFontData({fdata:FontData, id:data.id});
                            if (result == true) {
                                msg = 'Font Download Success !!!';
                                WP.IF_io.to(key).emit('WRT_FONT');
                            }
                            else {
                                msg = 'Font Download Fail !!!';
                            }
                        }
                        else{               
                            msg = 'Time Expire ,Please Login again';
                            console.log(msg);
                        }
                        break;
                    }
                }
                return;
                break;
            case 'FWwrite':
                for(let[key,obj] of WP.connectedDev){
                    if(obj.id == data.id){
                        const check = await WP.CheckToken(data.id);
                        if (  check != null) {
                            // let fname ="";
                            // if(obj.filename == ""){
                            //     fname = "fw.hex";
                            // }
                            // else{
                            //     fname = obj.filename;
                            // }
                            // // var result = FW_Download(data,fname);
                            // var result = sendFile(data,fname);
                            // if (result == true) {
                            //     msg = 'FW Download Success !!!';
                            // }
                            // else {
                            //     msg = 'FW Download Fail !!!';
                            // }
                            WP.IF_io.to(key).emit('WRT_FW');
                        }
                        else{               
                            msg = 'Time Expire ,Please Login again';
                            console.log(msg);
                        }
                        break;
                    }
                }
                return;
                break;
            case 'GETUSER':
                for(let[key,obj] of WP.connectedDev){
                    if(obj.id == data.id){
                        //--- check user & pwd is empty ----
                        if(obj.user == obj.pwd){
                            obj.user = '';
                            obj.pwd = '';
                        }
                        //-- get User name
                        let _usr = WP.JwtVerify(obj.user)
                        msg={
                            id: obj.id, 
                            user:  _usr,    
                            pwd: obj.pwd
                        }
                        
                        WP.UI_Send('user',msg);
                        break;
                    }
                }

                break;
            case 'CHKUSER':
                //--- convert user name to token 
                const token = WP.JwtSign(data.p1);
                Login._CheckUser(token,data.p2,data.id);
                console.log('checkuser:[%s],[%s]',data.p1, data.p2)
                msg= "login : " + data.p1;
                break;
            case 'WP_RDINFO':
                msg= data.cmd;
                console.log(msg);
                //---- read device name ---------------------------
                var PRNCMD = require('./Prncmd.js');
                WP.RcvState = WP.STATE_READ_PRNMODELNAME;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id}); 
                msg = PRNCMD._SysCmdParser(data);
                await WP._delay(100);
                break;
            case 'RD_WINDOW':
                // msg = WP.WriteStream( _ReadMacro(data.p1),data); 
                msg= data.p1;
                var obj =JSON.parse(msg);
                obj.window.forEach((function(item) {
                    console.log(item);
                    WP.UI_Send('WINDOWDEF', {msg:item,id:data.id});
                }));
                break;
            case 'SENDFILE':
                var result = sendFileData(data);
                return;
        }
        WP.UI_Send('done', msg);
    },
    
}
 