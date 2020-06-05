
const BitImage = [
    0, 0, 0, 0,
    0, 4, 32, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 31, 240, 0,
    0, 127, 252, 0,
    1, 255, 255, 0,
    3, 204, 127, 128,
    7, 140, 103, 192,
    14, 12, 97, 224,
    28, 12, 96, 224,
    28, 12, 96, 240,
    56, 12, 96, 112,
    56, 12, 96, 56,
    48, 12, 96, 56,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    48, 12, 96, 56,
    56, 12, 96, 56,
    56, 12, 64, 112,
    28, 12, 0, 112,
    28, 0, 0, 224,
    14, 0, 1, 224,
    14, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

const RasterImage = [
    // 31, 40, 70, 136, 0, //pL pH   
    // 4, 48, //fn:4  a=48
    // 1, 2, //x y   
    // 32, 0, //xnL xnH   
    // 32, 0, //ynL ynH   
    0, 0, 0, 0,
    0, 4, 32, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 31, 240, 0,
    0, 127, 252, 0,
    1, 255, 255, 0,
    3, 204, 127, 128,
    7, 140, 103, 192,
    14, 12, 97, 224,
    28, 12, 96, 224,
    28, 12, 96, 240,
    56, 12, 96, 112,
    56, 12, 96, 56,
    48, 12, 96, 56,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    48, 12, 96, 56,
    56, 12, 96, 56,
    56, 12, 64, 112,
    28, 12, 0, 112,
    28, 0, 0, 224,
    14, 0, 1, 224,
    14, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

const ColumnImage = [
    0, 0, 0, 0,
    0, 4, 32, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 12, 96, 0,
    0, 31, 240, 0,
    0, 127, 252, 0,
    1, 255, 255, 0,
    3, 204, 127, 128,
    7, 140, 103, 192,
    14, 12, 97, 224,
    28, 12, 96, 224,
    28, 12, 96, 240,
    56, 12, 96, 112,
    56, 12, 96, 56,
    48, 12, 96, 56,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    112, 12, 96, 28,
    48, 12, 96, 56,
    56, 12, 96, 56,
    56, 12, 64, 112,
    28, 12, 0, 112,
    28, 0, 0, 224,
    14, 0, 1, 224,
    14, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

const DISPLAY_MODE_NOCHANGE = 0;
const DISPLAY_MODE_GRAPHIC = 65;
const DISPLAY_MODE_32X4 = 97;
const DISPLAY_MODE_42X8 = 98;
const DISPLAY_MODE_32X3 = 99;
const DISPLAY_MODE_32X2 = 100;
const DISPLAY_MODE_20X2 = 101;

const ABS_VERTICAL_OFFSET = 48;
const ABS_HORIZONT_OFFSET = 49;
const REL_VERTICAL_OFFSET = 50;
const REL_HORIZONT_OFFSET = 51;

const BACKGROUND_WINDOWS = 0;
const FORGROUND_WINDOW = 1;
const TRANSPARENT = 0;
const NONETRANSPARENT = 1;

module.exports = {
    DISPLAY_MODE_NOCHANGE,
    DISPLAY_MODE_GRAPHIC,
    DISPLAY_MODE_32X4,
    DISPLAY_MODE_42X8,
    DISPLAY_MODE_32X3,
    DISPLAY_MODE_32X2,
    DISPLAY_MODE_20X2,
    ABS_VERTICAL_OFFSET,
    ABS_HORIZONT_OFFSET,
    REL_VERTICAL_OFFSET,
    REL_HORIZONT_OFFSET,
    BACKGROUND_WINDOWS,
    FORGROUND_WINDOW,
    TRANSPARENT,
    NONETRANSPARENT,
    BitImage,
    RasterImage,
    ColumnImage,

    Exc_Backspace: function() {
        var b = [0x08];
        return b;
    },
    Exc_HorizontalTab: function() {
        var b = [0x09];
        return b;
    },
    Exec_MoveCSDown() {
        var b = [0x0A];
        return b;
    },
    Exec_MoveCSUp() {
        var b = [0x1F, 0x0A];
        return b;
    },
    Exec_MoveCSHome() {
        var b = [0x0B];
        return b;
    },
    Exec_MoveCSLeftMost() {
        var b = [0x0D];
        return b;
    },
    Exec_MoveCSRightMost() {
        var b = [0x1F, 0x0D];
        return b;
    },
    Exec_MoveCSBottom() {
        var b = [0x1F, 0x42];
        return b;
    },
    Exec_MoveCStoXY(x, y) {
        var b = [0x1F, 0x24, x, y];
        return b;
    },
    Exec_ClearDisplay() {
        var b = [0x0c];
        return b;
    },
    Exec_ClearCSLine() {
        var b = [0x18];
        return b;
    },
    Set_Device: function(n) {
        // ESC =
        var b = [0x1B, 0x3D, n];
        return b;
    },
    Set_InitDisplay: function() {
        // ESC @
        var b = [0x1b, 0x40];
        return b;
    },
    Set_UserDefChar: function(n) {
        // ESC %
        var b = [0x1b, 0x25, n];
        return b;
    },
    Set_DefineUserCharacter: function(y, c1, c2) {
        // ESC &
        var b = [0x1b, 0x26, y, c1, c2];
        return b;
    },
    Set_CancelUserCharacter: function(n) {
        // ESC ?
        var b = [0x1b, 0x3F, n];
        return b;
    },
    Set_SelectInterChatSet: function(n) {
        // ESC R
        var b = [0x1b, 0x52, n];
        return b;
    },
    Set_SelectCharCodeTable: function(n) {
        // ESC t
        var b = [0x1b, 0x74, n];
        return b;
    },
    Set_WindowRange: function(n, m, x1, y1, x2, y2) {
        // -- 1B 57 n m x1 y1 x2 y2 
        // n : wno,  m=0 :cancel, m=1 :select
        if (m == 0 || m == 48)
            var b = [0x1B, 0x57, n, 0x00];
        else
            var b = [0x1B, 0x57, n, 0x01, x1, y1, x2, y2];
        return b;
    },
    Set_OverwriteMode: function() {
        // US MD1
        var b = [0x1F, 0x01];
        return b;
    },
    Set_VScrollMode: function() {
        // US MD2
        var b = [0x1F, 0x02];
        return b;
    },
    Set_HScrollMode: function() {
        // US MD3
        var b = [0x1F, 0x03];
        return b;
    },
    Set_CSOnOFF: function(n) {
        // US C
        var b = [0x1F, 0x43, n];
        return b;
    },
    Set_BlinkRate: function(n) {
        // US C
        var b = [0x1F, 0x45, n];
        return b;
    },
    Set_SetTime: function(h, m) {
        // US T
        var b = [0x1F, 0x54, h, m];
        return b;
    },
    Set_ShowTime: function() {
        // US U
        var b = [0x1F, 0x55];
        return b;
    },
    Set_Brightness: function(n) {
        // US X
        var b = [0x1F, 0x58, n];
        return b;
    },
    Set_ReverseChar: function(n) {
        // US r
        var b = [0x1F, 0x72, n];
        return b;
    },
    Set_DTR: function(n) {
        // US v
        var b = [0x1F, 0x76, n];
        return b;
    },
    Set_SelfTest: function() {
        // US @
        var b = [0x1F, 0x40];
        return b;
    },
    Set_MacroDefine: function(n) {
        // US :
        var b = [0x1F, 0x3A];
        return b;
    },
    Set_ExecMacro: function(n, m) {
        // US ^
        var b = [0x1F, 0x5E, n, m];
        return b;
    },
    Set_DisplayPeriod: function(n) {
        // US .
        var b = [0x1F, 0x2E, n];
        return b;
    },
    Set_DisplayComma: function(n) {
        // US ,
        var b = [0x1F, 0x2C, n];
        return b;
    },
    Set_DisplaySemicolon: function(n) {
        // US ;
        var b = [0x1F, 0x2b, n];
        return b;
    },
    Set_AnnuciatorOnOff: function(m, n) {
        // US #
        var b = [0x1F, 0x23, m, n];
        return b;
    },
    Set_SelectDisplay: function(n) {
        // US (A   n=48: Disable ,  n=49: Enable
        var b = [0x1F, 0x28, 0x41, 0x02, 0x00, n];
        return b;
    },
    Set_TransmitInfo: function() {
        // US (B  
        var b = [0x1F, 0x28, 0x42, 0x02, 0x00, 0x30, m];
        return b;
    },
    Set_EditNVMemory: function(fn, b, c1, c2) {
        // US (C   TODO
        var b = [0x1F, 0x28, 0x43, 0x02, 0x00, fn, b, c1, c2];
        return b;
    },


    _DefineWindow: function(wno, m1, m2, x, y, size_x, size_y) {
        // US (D  Function 1:
        //-- 1F 28 44 0D 00 01 wno m1 m2 2 xL xH yL yH dxL dxH dyL dyH
        var m1;
        var xL, xH, yL, YH, dxL, dxH, dyL, dyH;
        xL = x % 256;
        xH = x >> 8;
        yL = y % 256;
        yH = y >> 8;
        dxL = size_x % 256;
        dxH = size_x >> 8;
        dyL = size_y % 256;
        dyH = size_y >> 8;
        if (wno > 4) wno = 4;
        var b = [0x1F, 0x28, 0x44, 0x0D, 0x00, 0x01, wno, m1, m2, 2, xL, xH, yL, yH, dxL, dxH, dyL, dyH];
        return b;
    },
    Set_DeleteWindow: function(wno) {
        // US (D function 2: 
        //-- 1F 28 44 02 00 02 wno 
        var b = [0x1F, 0x28, 0x44, 0x02, 0x00, 0x02, wno];
        return b;
    },

    _WindowMode: function(m1, m2) {
        // US (D function 3: 
        //-- 1F 28 44 04 00 03  m1 m2 02 
        var b = [0x1F, 0x28, 0x44, 0x04, 0x00, 0x03, m1, m2, 0x02];
        return b;
    },
    _SelectWindow: function(wno, m) {
        // US (D function 4: 
        // -- 1F 28 44 03 00 04 wno  m
        if (m == 48) m = 0;
        if (m == 49) m = 1;
        if (wno > 4) return null;
        var b = [0x1F, 0x28, 0x44, 0x03, 0x00, 0x04, wno, m];
        return b;
    },
    Set_MoveWindowPosition: function(m, n) {
        // US (D  function 6
        // -- m : 48,49,50,51
        var nL = n % 256;
        var nH = n >> 8;
        var b = [0x1F, 0x28, 0x44, 0x04, 0x00, 0x06, m, nL, nH];
        return b;
    },

    Set_BitImage: function(fn, a, x, y, xn, yn, dx, dy) {
        // US (F
        var b;
        var len
        var xnL;
        var xnH;
        var ynL;
        var ynH;
        var dxL;
        var dxH;
        var dyL;
        var dyH;
        switch (fn) {
            case 1:
                // Fun1 : Displays the NV bit image
                // Displays the NV bit image defined by US ( E, Function 11 
                //1 ≤ a ≤ 255
                // 1 ≤ x ≤ 8 
                //1 ≤ y ≤ 8 
                //0 ≤ ( xnL + xnH × 256)  ≤ 65534 (0 ≤ xnL ≤ 255, 0 ≤ xnH ≤ 255) 
                //0 ≤ ( ynL + yn H × 256)  ≤ 65534 (0 ≤ ynL ≤ 255, 0 ≤ ynH ≤ 255) 
                // 1 ≤ ( dxL + dx H × 256)  ≤ 65535 (0 ≤ dxL ≤ 255, 0 ≤ dxH ≤ 255) 
                // 1 ≤ ( dyL + dyH × 256)  ≤ 65535 (0 ≤ dyL ≤ 255, 0 ≤ dyH ≤ 255) 
                xnL = xn % 256;
                xnH = xn >> 8;
                ynL = yn % 256;
                ynH = yn >> 8;
                dxL = dx % 256;
                dxH = dx >> 8;
                dyL = dy % 256;
                dyH = dy >> 8;
                b = [0x1F, 0x28, 0x46, 0x0c, 0x00, 0x01, a, x, y, xnL, xnH, ynL, ynH, dxL, dxH, dyL, dyH];
                break;
            case 2: //TODO
                // Fun2 : Defines a downloaded bit image
                len = (x * y) / 8 + 6;
                pL = len % 256;
                pH = len >> 8;
                xL = x % 256;
                xH = x >> 8;
                yL = y % 256;
                yH = y >> 8;
                b = [0x1F, 0x28, 0x46, pL, pH, 0x02, 0x01, xL, xH, yL, yH];
                break;
            case 3:
                // fun 3: Displays a downloaded bit image
                //1 ≤ a ≤ 255
                // 1 ≤ x ≤ 8 
                // 1 ≤ y ≤ 8 
                // 0 ≤ ( xnL + xnH × 256)  ≤ 65534 (0 ≤ xnL ≤ 255, 0 ≤ xnH ≤ 255) 
                // 0 ≤ ( ynL + yn H × 256)  ≤ 65534 (0 ≤ ynL ≤ 255, 0 ≤ ynH ≤ 255) 
                // 1 ≤ ( dxL + dx H × 256)  ≤ 65535 (0 ≤ dxL ≤ 255, 0 ≤ dxH ≤ 255) 
                // 1 ≤ ( dyL + dyH × 256)  ≤ 65535 (0 ≤ dyL ≤ 255, 0 ≤ dyH ≤ 255) 
                b = [0x1F, 0x28, 0x46, 0x0c, 0x00, 0x03, a, x, y, xnL, xnH, ynL, ynH, dxL, dxH, dyL, dyH];
                break;
            case 4:
                // fun 4: Displays a bit image (raster type)
                len = (xn * yn) / 8 + 8;
                pL = len % 256;
                pH = len >> 8;
                xnL = xn % 256;
                xnH = xn >> 8;
                ynL = yn % 256;
                ynH = yn >> 8;
                b = [0x1F, 0x28, 0x46, pL, pH, 0x04, a, x, y, xnL, xnH, ynL, ynH];
                break;
            case 5: //TODO
                // Displays a bit image (column type)
                len = (xn * yn) / 8 + 8;
                pL = len % 256;
                pH = len >> 8;
                xnL = xn % 256;
                xnH = xn >> 8;
                ynL = yn % 256;
                ynH = yn >> 8;
                b = [0x1F, 0x28, 0x46, pL, pH, 0x05, a, x, y, xnL, xnH, ynL, ynH];
                break;
            default:
                break;
        }
        return b;
    },
    Set_SelectCharStyle: function(fn, m1, m2) {
        // US (G  function A1
        // fn(32):A1 fn(33):A2, fn(34):A3 fn(64):B1 fn(96):C1 fn(97):C2 fn(98):C3 fn(99):C4 fn(100):c5
        var b;
        switch (fn) {
            case 32:
                //A1 : character size
                //m1=x, m2=y
                b = [0x1F, 0x28, 0x47, 0x03, 0x00, 32, m1, m2];
                break;
            case 33:
                //A2 : character highlighting
                // m=0 :cancel   m=1: set
                b = [0x1F, 0x28, 0x47, 0x02, 0x00, 33, m1];
                break;
            case 34:
                //A3 : m=0 :cancel   m=1: reverse
                b = [0x1F, 0x28, 0x47, 0x02, 0x00, 34, m1];
                // reverse display
                break;
            case 64:
                // B1: char font
                // m:0 fontA(8*16), m:1 fontB (5*7)
                b = [0x1F, 0x28, 0x47, 0x02, 0x00, 64, m1];
                break;
            case 96:
                // C1 : kanji mode
                // m:0/48 kanji mode canceled, m:1/49  kanji mode select
                b = [0x1F, 0x28, 0x47, 0x02, 0x00, 96, m1];
                break;
            case 97:
                // C2 :kanji code system
                // m:0 JIS code system, m:1 SHIFT JIS code system
                b = [0x1F, 0x28, 0x47, 0x02, 0x00, 97, m1];
                break;
            default:
                b = null;
                break;
        }
        return b;
    },

    Move_cs: function(x, y) {
        var b = [0x1F, 0x24, x, y];
        return b;
    },
    Set_DisplayLayout: function(fn, n1, n2, dx, dy, n3, n4) {
        var b;
        switch (fn) {
            case 32: //fun A1 : Specifies the line spacing
                b = [0x1F, 0x28, 0x48, 0x02, 0x00, 32, n1];
                break;
            case 33: //fun A2 Moves the display data in the current window 
                var x1L = n1 % 256;
                var x1H = n1 >> 8;
                var y1L = n2 % 256;
                var y1H = n2 >> 8;
                var dxL = dx % 256;
                var dxH = dx >> 8;
                var dyL = dy % 256;
                var dyH = dy >> 8;
                var x2L = n3 % 256;
                var x2H = n3 >> 8;
                var y2L = n4 % 256;
                var y2H = n4 >> 8;
                b = [0x1F, 0x28, 0x48, 13, 0, 33, x1L, x1H, y1L, y1H, dxL, dxH, dyL, dyH, x2L, x2H, y2L, y2H];
                break;
            case 64:
                // Fun B1 ,Specifies the character spacing for one-byte character codes 
                // n1,
                // n2,
                b = [0x1F, 0x28, 0x48, 0x03, 0x00, 64, n1, n2];
                break;
            case 96:
                // fun C1 ,Specifies the character spacing for two-byte character codes
                // n1 :the amount of space on the left side of a character as n1 dots.
                // n2 :the amount of space on the right side of a character as n2 dots. 
                b = [0x1F, 0x28, 0x48, 0x03, 0x00, 96, n1, n2];
                break;
        }
        return b;
    },


}