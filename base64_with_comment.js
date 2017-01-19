/**
 * base64 tools
 */

/**
 * base64编码解码算法
 *第一步，将每三个字节作为一组，一共是24个二进制位。
 *第二步，将这24个二进制位分为四组，每个组有6个二进制位。
 *第三步，在每组前面加两个00，扩展成32个二进制位，即四个字节。
 *第四步，根据下表，得到扩展后的每个字节的对应符号，这就是Base64的编码值。
 * @type {{_keyStr: string, encode: Base64.encode, decode: Base64.decode, _utf8_encode: Base64._utf8_encode, _utf8_decode: Base64._utf8_decode}}
 */

'use strict';

const Base64 = {
    //base64 所用的64个字符和其中的一个补位符'='
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(str) {
        //base64转换算法就是根据具体的规则将3个字符变成四个字符。
        let out = "",c1,c2,c3,
            outC1,outC2,outC3,outC4,i = 0;
        str = Base64._utf8_encode(str); //将utf16 转换成utf8,因为JavaScript内部采用的是utf16存储所以要进行一步转换。
        while (i < str.length) {
            // 三个三个字符一组进行转换
            c1 = str.charCodeAt(i++);
            c2 = str.charCodeAt(i++);
            c3 = str.charCodeAt(i++);
            outC1 = c1 >> 2; //第一个字符最前面添加两个0,剩余2位用作后面拼接
            outC2 = (c1 & 0x03) << 4 | c2 >> 4; // 第一个字符剩下两位和第二个字符前四位拼接,并在前面添加2个0拼成一个字符
            outC3 = (c2 & 0x0f) << 2 | c3 >> 6; //第二个字符剩余4位和第三个字符的前两位,并在前面添加2个0拼接成一个字符
            outC4 = c3 & 0x3f; //第三个字符剩下的6位前面添加两个0 拼接成一个字符
            //如果c2为不存在则最后两个字符为补位符'=' 如果c3不存在 则转换后最后一位为补位'='
            if (isNaN(c2)) { outC3 = outC4 = 64 } else if (isNaN(c3)) { outC4 = 64 }
            out = out + this._keyStr.charAt(outC1) + this._keyStr.charAt(outC2) + this._keyStr.charAt(outC3) + this._keyStr.charAt(outC4)
        }
        return out
    },
    decode: function(str) {
        let out = '',c1,c2,c3,c4,outC1,outC2,outC3,i = 0;
        //去掉非base64字符
        str = str.replace(/[^A-Za-z0-9+/=]/g, "");
        //循环处理进行解码
        while (i < str.length) {
            //4个base64字符一组,解码后将转换成3个字符
            c1 = this._keyStr.indexOf(str.charAt(i++));
            c2 = this._keyStr.indexOf(str.charAt(i++));
            c3 = this._keyStr.indexOf(str.charAt(i++));
            c4 = this._keyStr.indexOf(str.charAt(i++));
            //每个字符前面都会有两个前导0
            outC1 = c1 << 2 | c2 >> 4; //第一个base64字符去掉两个0后和第二个字符的开头两个字符拼成一个字节
            outC2 = (c2 & 0x0f) << 4 | c3 >> 2; //第二个剩下的4位和第三个开始的四位拼成一个字节
            outC3 = (c3 & 0x03) << 6 | c4; // 第三个剩下的2位和第四个6位拼成一个字节
            out = out + String.fromCharCode(outC1);
            //如果倒数第二个不是补位符'='
            if (c3 != 64) { out = out + String.fromCharCode(outC2) }
            //如果倒数第一个不是补位符'='
            if (c4 != 64) { out = out + String.fromCharCode(outC3) }
        }
        out = Base64._utf8_decode(out); // 将utf8转成utf16
        return out
    },
    /**
     * unicode 在不同范围内utf8 会分别采用不同的字节数去编码存储
     * 0x0000 ~ 0x007f 一个字节 => 0xxxxxxx
     * 0x0080 ~ 0x07ff 两个字节 => 110xxxxx 10xxxxxx
     * 0x0800 ~ 0xffff 三个字节 => 1110xxxx 10xxxxxx 10xxxxxx
     * unicode 有17个code plane 其中0x0000 ~ 0xffff 称为基本多语言平面
     * 0x10000 ~ 0x10ffff 16个为辅助平面
     * 基本多语言平面已经涵盖了最常用的字符 这里只针对这个范围进行处理
     * https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84
     * utf16 转成 utf8
     * @param str
     * @returns {string}
     * @private
     */
    _utf8_encode: function(str) {
        str = str.replace(/\r\n/g, "\n");
        let out = "";
        for (var n = 0; n < str.length; n++) {
            let unicode = str.charCodeAt(n);
            if ((unicode >= 0x0001) && (unicode <= 0x007f)) {
                out += str.charAt(n);
            } else if (unicode > 0x07ff) {
                //将16位unicode前四位和1110xxxx 进行拼接
                out += String.fromCharCode(0xe0 | ((unicode >> 12) & 0x0f));
                //将接下来的6位和10xxxxxx进行拼接
                out += String.fromCharCode(0x80 | ((unicode >>  6) & 0x3f));
                //将接下来的6位和10xxxxxx进行拼接
                out += String.fromCharCode(0x80 | ((unicode >>  0) & 0x3f));
            } else {
                //将16位unicode前5位和110xxxxx 进行拼接
                out += String.fromCharCode(0xc0 | ((unicode >>  6) & 0x1f));
                //将接下来的6位和10xxxxxx进行拼接
                out += String.fromCharCode(0x80 | ((unicode >>  0) & 0x3f));
            }
        }
        return out;
    },
    /**
     * utf8 -> utf16
     * @param str
     * @returns {string}
     * @private
     */
    _utf8_decode: function(str) {
        let out = "",n = 0, c1,c2,c3;
        c1 = c2 = c3 = 0;
        while (n < str.length) {
            c1 = str.charCodeAt(n);
            if (c1 < 0x80) {
                //编码为0xxxxxxx 表示utf8 一个字节
                out += String.fromCharCode(c1);
                n++
            } else if (c1 > 0xc0 && c1 < 0xe0) {
                //编码为110xxxxx 10xxxxxx 表示2个字节
                c2 = str.charCodeAt(n + 1);
                out += String.fromCharCode((c1 & 0x1f) << 6 | c2 & 0x3f);
                n += 2
            } else {
                //编码为1110xxxx 10xxxxxx 0xxxxxxx 表示utf8 三个字节
                c2 = str.charCodeAt(n + 1);
                c3 = str.charCodeAt(n + 2);
                out += String.fromCharCode((c1 & 0x0f) << 12 | (c2 & 0x3f) << 6 | c3 & 0x3f);
                n += 3
            }
        }
        return out
    }
};

export default {
    encode(params) {
        let paramStr = JSON.stringify(params);
        return Base64.encode(paramStr);
    },
    decode(base64Str) {
        return Base64.decode(base64Str);
    }
}
