
const fs = require('fs');
var WP = require('./WP_Global.js');
var Login = require('./Login.js');
var CONFIG = WP.CONFIG;

module.exports = {
    _CmdParser: async function(data){
        var msg;
        switch(data.cmd){
            case 'WP_RDINFO':
                WP.RcvState = WP.STATE_READ_PRNMODELNAME;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id}); 
                msg = WP.WriteStream( _readDeviceName(data),data);  
                await WP._delay(50);
                //---read font code -----------------
                WP.RcvState = WP.STATE_READ_FONTCODE;
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id}); 
                msg = WP.WriteStream( _readFontCode(data),data);  
                await WP._delay(100);
                //---read flash ID code -----------------
                WP.RcvState = WP.STATE_READ_FLASHID
                WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState,id: data.id}); 
                msg = WP.WriteStream( _readFlashID(data),data);  
                break;
            case 'SELFTEST':
                msg = WP.WriteStream( _selfTest(data),data);  
                break;
            case 'FONTWRITE':
                msg = 'Start Font Download.....'
                console.log(msg);
                for(let[key,obj] of WP.connectedDev){
                    if(obj.id == data.id){
                        let fname ="";
                        if(obj.filename != ""){
                            fname = obj.filename;
                            const check = await WP.CheckToken(data.id);
                            if (  check != null) {
                                // var result = Font_Download(data,fname);
                                // if (result == true) {
                                //     msg = 'Font Download Success !!!';
                                // }
                                // else{
                                //     msg = 'Font Download Fail !!!';
                                // }
                                WP.IF_io.to(key).emit('WRT_FONT');
                            }
                            else{        
                                msg = 'Time Expire ,Please Login again';
                                console.log(msg);
                            }
                            break;

                        }
                        else{
                            msg = {id: data.id, msg:'No file upload!!!'};
                            console.log(msg);
                            break;
                        }
                        
                    }
                }
                // return;
                break;
        }
        WP.UI_Send('done', msg);
    }
}

function _readDeviceName(){
    var b = [ 0x1d, 0x49, 0x43 ]; 
    return [b,'Read Device Name:'];
}
function _readFontCode(){
    var b = [ 0x1D, 0x49,0x45 ];
    return [b,'Read Font Code'];
}
function _readFlashID(){
    var b = [ 0x1D, 0x67, 0x56, 0, 30, 0 ];
    return [b,'Read Flash ID'];
}
function _selfTest(){
    var b = [0x1D,0x28,0x41,0x02,0x00,0x01,0x02];
    return [b,'Self Test'];
}
async function Font_Download(data,filename) {
    var msg;
    process.env.ENGINEERING_MOD = "OFF";
    FONT_NAME = './upload/'+filename;
    if (fs.existsSync('./upload/'+filename)) {
        FONT_NAME = ('./upload/'+filename);
    } else {
        // FW_NAME = ('./resource/fw.hex');
        return false;
    }
    var FontData = fs.readFileSync(FONT_NAME);
    //---- need to delete file ?? ------
    checkFileExist();  
    var total_size = FontData.byteLength;
    WP._progress = 0;
    //---------------------------
    WP.RcvState = WP.STATE_DOWNLOADFONT;
    var FlashAddr = 0x2000;
    var result = await Buffer_To_SpiFlash(FontData, FlashAddr,data);
    if (result == true) {
        console.log("Write Successful ");
        SendResetDevice(data);
        checkFileExist();
        return true;
    } else {
      noticeString = 'Font Download Fail !!!';
      console.log(noticeString);
      checkFileExist();
      return false;
    }
}

function checkFileExist(){
    if(CONFIG.DOWNLOAD_FONT_FROM_CLOUD === "ENABLE") {
        if (fs.existsSync('./upload/font.Tsk')) {
            fs.unlinkSync('./upload/font.Tsk');
        } 
    }
    else
        return;
}
async function SendResetDevice(data) {
    var result;
    result = await comFlashRequest(data);
    if(result == false)  
      return false;
    //------------------------------------------
    var b = [0x1f,0x46,0x40];  //0x1f, 'F' , '@'
    try{
        WP.PortWrite(b,data);
    } catch(e) {
      return false;
    }
}

async function comFlashRequest(data ) {
  var b = [ 0x1F, 0x46, 0x52 ];  // 1f 'FR'
  WP.PortWrite(b,data);
  WP.RcvState = WP.STATE_DOWNLOADFONT;
  WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
  FONT_update_process = true;
  WP.rcvok = false;
  while (WP.rcvok == false) {
      await WP._delay(1);
      if (FONT_update_process == false) {
          console.log('download NG');
          return false;
      }
  }
  return true;
}

async function SendSpiFlashPageWrite(buf, FlashAddr,Count,data) {
    var result;
    result =  comFlashRequest(data);
    if(result == false)  
      return false;
    //------------------------------------------
    //  Send Write spiflash command
    var cmd = [0x1f,0x46,0x70,0,0,0,0,0];  //0x1f, 'F' , 'p'
    cmd[3] = FlashAddr & 0xff;
    cmd[4] = (FlashAddr >> 8) & 0xff;
    cmd[5] = (FlashAddr >> 16)& 0xff;
    cmd[6] = Count & 0xff;
    cmd[7] = (Count >> 8)&0xff;
    WP.PortWrite(cmd,data);  
    FONT_update_process = true;
    WP.RcvState = WP.STATE_DOWNLOADFONT;
    WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
    WP.rcvok = false;
    while (WP.rcvok == false) {
        await WP._delay(1);
        if (FONT_update_process == false) {
            console.log('download NG');
            return false;
        }
    }
    WP.PortWrite(buf,data);

    WP.RcvState = WP.STATE_DOWNLOADFONT;
    WP.IF_SocketSend('RCVSTATE',{msg:WP.RcvState, id: data.id});
    WP.rcvok = false;
    FONT_update_process = true;
    while (WP.rcvok == false) {
        await WP._delay(1);
        if (FONT_update_process == false) {
            console.log('download page write NG');
            return false;
        }
    }
    return true;
}
    
async function Sector_SpiFlash_Write( buf, FlashAddrOrg,SendCntOrg,data) {
    var TryCnt = 0;
    var Flash_nBytePageSize = 256;
    var PktSize = Flash_nBytePageSize;
    var SendBuf = Buffer.alloc(PktSize);  
    var SendCnt = 0;
    try{
          for (TryCnt = 0; TryCnt < 3; TryCnt++)
          {
            var FlashAddr = FlashAddrOrg;
            var BufferSize = SendCntOrg;
            var BufferIndex = 0;
            while (BufferSize > 0)
            {
              SendCnt = BufferSize - PktSize;
              if (SendCnt <= 0) SendCnt = BufferSize; else SendCnt = PktSize;
              // copy a page data form file buffer
              buf.copy(SendBuf,0,BufferIndex, SendCnt+BufferIndex);
              BufferIndex += SendCnt;
              BufferSize -= SendCnt;
              // check page write
              var result =  await SendSpiFlashPageWrite(SendBuf, FlashAddr, SendCnt,data);
              if ( result == false) { 
                return false ;
              }
              FlashAddr += SendCnt;
            }
            return true;
          }
          return false; 
    } catch(e){
      return false;
    }
}
async function Buffer_To_SpiFlash(filebuf, flashAddr,data) {
    var flash_nByteSectorSize = 4096;
    var bufferSize = filebuf.length;
    var bufferIndex = 0;
    var bufferSectorSize = parseInt(bufferSize/flash_nByteSectorSize);
    if ((bufferSize % flash_nByteSectorSize) > 0) bufferSectorSize++;
    var pktSize = flash_nByteSectorSize;  
    var sendCnt = 0;
    var sendBuf = Buffer.alloc(pktSize); 
    while (bufferSize > 0){
        sendCnt = bufferSize - pktSize;
        if (sendCnt <= 0) {
          sendCnt = bufferSize; 
        }
        else {
          sendCnt = pktSize;
        }
        filebuf.copy(sendBuf,0,bufferIndex, (sendCnt + bufferIndex));
        bufferIndex += sendCnt;
        bufferSize -= sendCnt;
        var result =  await Sector_SpiFlash_Write( sendBuf, flashAddr, sendCnt,data);
        if (result == false)  
          return false;

        flashAddr += sendCnt;
        downloading = true;
        _allowConnect = false;

        var progress = Math.floor((bufferIndex / filebuf.length) * 100) ;
        if(WP._progress < progress ) {
            console.log("progress : " + progress + '%');   
            // io.sockets.emit('progress', progress);
            // WP.SocketSent('progress', progress);
            WP.UI_Send('progress', {msg:progress, id:data.id});
            WP.IF_SocketSend('PROGRESS', {msg:progress, id:data.id});
            WP._progress = progress;
        }
    }
    downloading = false;
    _allowConnect = true;
    noticeString = "Font download Finish !!!";
    console.log(noticeString);
    return true;
}