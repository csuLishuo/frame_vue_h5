/**
 * lf app js framework
 * liyu - v2.0.0 (2017-04-11)
 */
import qs from 'qs'
import axios from 'axios'
import {SERVER_BAS_URL, REQUESTDATA, debug, PROJECT_NAME} from './define'

/**
 * lf核心JS
 * @type _L4.$|Function
 */
var lf = (function (document) {
  var $ = {}
  $.install = function (Vue, options) {
    Vue.prototype.$lf = $
    Vue.prototype.$http = $.$http
    Vue.prototype.$post = $.$http.post
    Vue.prototype.$baseURL = SERVER_BAS_URL
  }
  return $
})(document);
(function ($, window) {
  var level = {
    'OFF': 0,
    'ERROR': 2,
    'WARN': 3,
    'INFO': 4,
    'DEBUG': 5,
    'ALL': 9,
  }
  var logLevel = 'ALL'
  if (debug) {
    logLevel = debug
  }
  logLevel = level[logLevel]
  $.log = {
    /**
     * 信息分组开始
     * @param {String} d
     */
    group: function (d) {
      logLevel && console.group(d)
    },
    /**
     * 信息分组结束
     */
    groupEnd: function () {
      logLevel && console.groupEnd()
    },
    /**
     * 查询对象
     * @param {String} d
     */
    dir: function (d) {
      logLevel && console.dir(d)
    },
    /**
     * 追踪函数的调用轨迹
     */
    trace: function () {
      logLevel && console.trace()
    },
    /**
     * @description 打印log日志
     * @param {String} d 打印内容
     * @param 可变参数 用于格式刷打印日志，比如：lf.log.log("%d年%d月%d日",2011,3,26); 结果是：2011年3月26日
     * 支持的占位符有：字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）
     */
    log: function () {
      logLevel && console.log.apply(console, arguments)
    },
    /**
     * @description 打印debug日志
     * @param {String} d 打印内容
     */
    debug: function () {
      logLevel && (logLevel >= 5) && console.debug.apply(console, arguments)
    },
    /**
     * @description 打印info日志
     * @param {String} d 打印内容
     */
    info: function () {
      logLevel && (logLevel >= 4) && console.info.apply(console, arguments)
    },
    /**
     * @description 打印warn日志
     * @param {String} d 打印内容
     */
    warn: function () {
      logLevel && (logLevel >= 3) && console.warn.apply(console, arguments)
    },
    /**
     * @description 打印error日志
     * @param {String} d 打印内容
     */
    error: function () {
      logLevel && (logLevel >= 2) && console.error.apply(console, arguments)
    }
  }
})(lf, window);
/**
 * $.os 判断平台环境 from mui
 * @param {type} $
 * @returns {undefined}
 */
(function ($, window) {
  function detect(ua) {
    this.os = {}
    var funcs = [
      function () { //phone or pad
        if (ua.match(/Android/i) ||
          ua.match(/webOS/i) ||
          ua.match(/iPhone/i) ||
          ua.match(/iPad/i) ||
          ua.match(/iPod/i) ||
          ua.match(/BlackBerry/i) ||
          ua.match(/Windows Phone/i)
        ) {
          this.os.mobile = true
        } else {
          this.os.pc = true
          var ret = ''
          var uasplit = null
          if (/Firefox/g.test(ua)) {
            uasplit = ua.split(' ')
            ret = 'Firefox|' + uasplit[uasplit.length - 1].split('/')[1]
          } else if (/MSIE/g.test(ua)) {
            uasplit = ua.split(';')
            ret = 'IE|' + uasplit[1].split(' ')[2]
          } else if (/Opera/g.test(ua)) {
            uasplit = ua.split(' ')
            ret = 'Opera|' + uasplit[uasplit.length - 1].split('/')[1]
          } else if (/Chrome/g.test(ua)) {
            uasplit = ua.split(' ')
            ret = 'Chrome|' + uasplit[uasplit.length - 2].split('/')[1]
          } else if (/^apple\s+/i.test(navigator.vendor)) {
            uasplit = ua.split(' ')
            ret = 'Safair|' + uasplit[uasplit.length - 2].split('/')[1]
          } else if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            if (/rv:11.0/g.test(ua)) {
              ret = 'IE|11'
            } else if (/rv:10.0/g.test(ua)) {
              ret = 'IE|10'
            } else if (/rv:9.0/g.test(ua)) {
              ret = 'IE|9'
            } else {
              ret = 'IE|0'
            }
          } else {
            ret = 'unkown|0'
          }
          ret = ret.split('|')
          this.os.browser = ret[0]
          this.os.version = ret[1]
        }
      },
      function () { //wechat
        var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i)
        if (wechat) { //wechat
          this.os.wechat = {
            version: wechat[2].replace(/_/g, '.')
          }
        }
        return false
      },
      function () { //android
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/)
        if (android) {
          this.os.android = true
          this.os.version = android[2]

          this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion))
        }
        return this.os.android === true
      },
      function () { //ios
        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/)
        if (iphone) { //iphone
          this.os.ios = this.os.iphone = true
          this.os.version = iphone[2].replace(/_/g, '.')
        } else {
          var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
          if (ipad) { //ipad
            this.os.ios = this.os.ipad = true
            this.os.version = ipad[2].replace(/_/g, '.')
          }
        }
        return this.os.ios === true
      }
    ];
    [].every.call(funcs, function (func) {
      return !func.call($)
    })
  }

  detect.call($, navigator.userAgent)
})(lf, window);
/**
 * $.os.plus 判断H5+环境 from mui
 * @param {type} $
 * @returns {undefined}
 */
(function ($, document) {
  function detect(ua) {
    this.os = this.os || {}
    var plus = ua.match(/Html5Plus/i) //TODO 5\+Browser?
    if (plus) {
      this.os.plus = true
      if (ua.match(/StreamApp/i)) { //TODO 最好有流应用自己的标识
        this.os.stream = true
      }
    }
  }

  detect.call($, navigator.userAgent)
})(lf, document);
/**
 * @description 缓存模块
 * storage：兼容H5+和H5环境
 * sessionstorage
 * cookie
 */
(function ($, window) {
  var _storage = null
  _storage = localStorage
  $.storage = {
    /**
     * @description 存储key-value
     * @param {String} key 存储的键值
     * @param {String} value 存储的内容
     */
    put: function (key, value) {
      _storage.removeItem(key)
      _storage.setItem(key, value)
    },
    /**
     * @description 通过key值检索键值
     * @param {String} key 存储的键值
     * @return {String}
     */
    get: function (key) {
      return _storage.getItem(key)
    },
    /**
     * @description 通过key值删除键值对
     * @param {String} key 存储的键值
     */
    removeItem: function (key) {
      _storage.removeItem(key)
    },
    /**
     * @description 获取storage中保存的键值对的数量
     * @return {Number}
     */
    getItemCount: function () {
      return _storage.getLength()
    },
    /**
     * @description 获取键值对中指定索引值的key值
     * @return {String}
     */
    key: function (index) {
      return _storage.key(index)
    },
    /**
     * @description 清除应用所有的键值对,不建议使用
     */
    clearAll: function () {
      _storage.clear()
    }
  }
})(lf, window);

(function ($, window) {
  var _storage = sessionStorage
  $.sessionStorage = {
    /**
     * @description 存储key-value
     * @param {String} key 存储的键值
     * @param {String} value 存储的内容
     */
    put: function (key, value) {
      _storage.removeItem(key)
      _storage.setItem(key, value)
    },
    /**
     * @description 通过key值检索键值
     * @param {String} key 存储的键值
     * @return {String}
     */
    get: function (key) {
      return _storage.getItem(key)
    },
    /**
     * @description 通过key值删除键值对
     * @param {String} key 存储的键值
     */
    removeItem: function (key) {
      _storage.removeItem(key)
    },
    /**
     * @description 获取storage中保存的键值对的数量
     * @return {Number}
     */
    getItemCount: function () {
      return _storage.getLength()
    },
    /**
     * @description 获取键值对中指定索引值的key值
     * @return {String}
     */
    key: function (index) {
      return _storage.key(index)
    },
    /**
     * @description 清除应用所有的键值对,不建议使用
     */
    clearAll: function () {
      _storage.clear()
    }
  }
})(lf, window);

(function ($, window) {
  $.cookie = {
    set: function (c_name, value, expiredays) {
      var exdate = new Date()
      if (!expiredays) {
        document.cookie = c_name + '=' + escape(value) + '; path=/'

      } else {
        exdate.setDate(exdate.getDate() + expiredays * 1)
//				document.cookie = c_name + "=" + escape(value) +
//					";expires=" + exdate.toGMTString()+"; path=/app/test";
        document.cookie = c_name + '=' + escape(value) + ';expires=' + exdate.toGMTString() + '; path=/'
      }
    },
    get: function (c_name) {
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=')
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1
          var c_end = document.cookie.indexOf(';', c_start)
          if (c_end == -1) c_end = document.cookie.length
          return unescape(document.cookie.substring(c_start, c_end))
        }
      }
      return ''
    },
    del: function (c_name) {
      var exp = new Date()
      exp.setDate(exp.getDate() - 1)
      var cval = this.get(c_name)
      if (cval != null) {
//				document.cookie = c_name + "="  +
//				";expires=" + exp.toGMTString()+"; path=/app";
        document.cookie = c_name + '=' + escape(cval) + ';expires=' + exp.toGMTString() + '; path=/'
      }
    },
    clear: function () {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
      if (keys) {
        for (var i = keys.length; i--;) {
          this.del(keys[i])
        }
      }
    }
  }
})(lf, window);
/*
 * app 平台信息
 * 初始化平台信息，保存平台到：KEY_SYSTEM_TYPE
 */
(function ($, window, undefined) {
  var platformName = ''
  var app = $.app = {
    init: function () {
      if ($.os.plus) {
        platformName = plus.os.name
        $.log.info('webview  id = [' + plus.webview.currentWebview().id + ']')
        $.log.info('webview url = [' + plus.webview.currentWebview().getURL() + ']')
      } else {
        $.log.info('windows url = [' + window.location.href + ']')
        $.log.info('windows platform = [' + JSON.stringify($.os) + ']')
      }
      $.storage.put('KEY_SYSTEM_TYPE', platformName)
    },
    getPlatform: function () {
      return $.storage.get('KEY_SYSTEM_TYPE')
    }
  }
})(lf, window);
/*
 * util工具类
 */
(function ($, window) {
  var randomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
  var randomColor = function (min, max) {
    var r = randomNum(min, max)
    var g = randomNum(min, max)
    var b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
  $.util = {
    detectmob: function () {
      if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true
      } else {
        return false
      }
    },
    replaceTemplate: function (i, j) {
      var k = i
      for (var l in j) {
        var m = eval('/\\$\\{' + l.replace(/\//g, '\\/') + '\\}/ig')
        k = k.replace(m, j[l])
      }

      return k
    },
    strToJson: function (jsonStr) {
      return JSON.parse(jsonStr)
    },
    timeStampToDate: function (timestamp) { //时间戳转换成正常日期格式
      function add0(m) {
        return m < 10 ? '0' + m : m
      }

      //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
      var time = new Date(timestamp)
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var date = time.getDate()
      var hours = time.getHours()
      var minutes = time.getMinutes()
      var seconds = time.getSeconds()
      return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds)
    },
    timeStampToDate2: function (timestamp) { //时间戳转换成年月日
      function add0(m) {
        return m < 10 ? '0' + m : m
      }

      //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
      var time = new Date(timestamp)
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var date = time.getDate()
//			var hours = time.getHours();
//			var minutes = time.getMinutes();
//			var seconds = time.getSeconds();
      return year + '-' + add0(month) + '-' + add0(date)
    },
    jsonToStr: function (jsonObj) {
      return JSON.stringify(jsonObj)
    },
    isUndefined: function (value) {
      if (typeof(value) == 'undefined' || value == null) {
        return true
      } else {
        return false
      }
    },
    isEmpty: function (value) {
      if (value) {
        return false
      } else {
        return true
      }
    },
    isString: function (value) {
      return Object.prototype.toString.call(value) == '[object String]'
    },
    isFormData: function (e) {
      return 'undefined' != typeof FormData && e instanceof FormData
    },
    isObject: function (value) {
      return value.constructor === Object
    },
    isArray: function (arr) {
      return arr.constructor === Array
    },
    getNowDay: function () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() * 1 + 1
      var day = date.getDate()
      return year + '-' + month + '-' +
        day
    },
    getSFM: function (time) {
      var date = new Date()
      date.setTime(time)
      var h = date.getHours()
      if (h < 10) {
        h = '0' + h
      }
      var m = date.getMinutes()
      if (m < 10) {
        m = '0' + m
      }
      var s = date.getSeconds()
      if (s < 10) {
        s = '0' + s
      }
      return h + ':' + m + ':' +
        s
    },
    getZDTime: function (time) {
      var date = new Date()
      date.setHours(time.split(':')[0])
      date.setMinutes(time.split(':')[1])
      date.setSeconds(time.split(':')[2])
      return date
    },
    checkRate: function (value) {
      var re = /^[0-9]+.?[0-9]*$/ //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
      if (!re.test(value)) {
        return false
      } else {
        return true
      }
    },
    decToHex: function (str) {
      str = str.replace(/\n/g, ' ')
      var res = []
      for (var i = 0; i < str.length; i++)
        res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
      return '\\u' + res.join('\\u')
    },
    createUUID: function (g) {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var uuid = s.join('')
      return uuid.replace(/-/g, '')

    },
    getStringLen: function (Str) {
      var i, len, code
      if (Str == null || Str == '') return 0
      len = Str.length
      for (i = 0; i < Str.length; i++) {
        code = Str.charCodeAt(i)
        if (code > 255) {
          len++
        }
      }
      return len
    },
    addNum: function (num1, num2) {
      var sq1, sq2, m
      try {
        sq1 = num1.toString().split('.')[1].length
      } catch (e) {
        sq1 = 0
      }
      try {
        sq2 = num2.toString().split('.')[1].length
      } catch (e) {
        sq2 = 0
      }
      m = Math.pow(10, Math.max(sq1, sq2))
      return (this.multNum(num1, m) + this.multNum(num2, m)) / m
    },
    multNum: function (arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {
      }
      try {
        m += s2.split('.')[1].length
      } catch (e) {
      }
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    },
    getCodeImg: function (width, height, type) {
      width = width || 120
      height = height || 40
      type = type || 1
      var canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      var ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'

      /**绘制背景色**/
      ctx.fillStyle = randomColor(180, 240) //颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height)
      /**绘制文字**/
      var str = ''
      if (type == 1) {
        str = '1234567890'
      } else if (type == 2) {
        str = 'ABCEFGHJKLMNPQRSTWXY123456789'
      } else {
        str = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890'
      }
      var code = ''
      for (var i = 0; i < 4; i++) {
        var txt = str[randomNum(0, str.length)]
        code = code + txt
        ctx.fillStyle = randomColor(50, 160) //随机生成字体颜色
        ctx.font = randomNum(15, 40) + 'px SimHei' //随机生成字体大小
        var x = 10 + i * 25
        var y = randomNum(25, 45)
        var deg = randomNum(-45, 45)
        //修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }
      /**绘制干扰线**/
      for (var i = 0; i < 8; i++) {
        ctx.strokeStyle = randomColor(40, 180)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, width), randomNum(0, height))
        ctx.lineTo(randomNum(0, width), randomNum(0, height))
        ctx.stroke()
      }
      /**绘制干扰点**/
      for (var i = 0; i < 100; i++) {
        ctx.fillStyle = randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
      var data = canvas.toDataURL('image/jpeg')
      return {
        code: code,
        codeUrl: data
      }
    },
    isCardID: function (obj) {
      var vcity = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X

      var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
      if (reg.test(obj) === false) {
        return false
      }
      var province = obj.substr(0, 2)
      if (vcity[province] == undefined) {
        return false
      }
      var verifyBirthday = function (year, month, day, birthday) {
        var now = new Date()
        var now_year = now.getFullYear()   //年月日是否合理

        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {    //判断年份的范围（3岁到100岁之间)

          var time = now_year - year
          if (time >= 0 && time <= 130) {
            return true
          }
          return false
        }
        return false
      }
      var len = obj.length
      //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
      if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
        var arr_data = obj.match(re_fifteen)
        var year = arr_data[2]
        var month = arr_data[3]
        var day = arr_data[4]
        var birthday = new Date('19' + year + '/' + month + '/' + day)
        return verifyBirthday('19' + year, month, day, birthday)
      }
      //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
      if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/
        var arr_data = obj.match(re_eighteen)
        var year = arr_data[2]
        var month = arr_data[3]
        var day = arr_data[4]
        var birthday = new Date(year + '/' + month + '/' + day)
        return verifyBirthday(year, month, day, birthday)
      }

      var changeFivteenToEighteen = function (obj) {
        if (obj.length == '15') {
          var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
          var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
          var cardTemp = 0,
            i
          obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6)
          for (i = 0; i < 17; i++) {
            cardTemp += obj.substr(i, 1) * arrInt[i]
          }
          obj += arrCh[cardTemp % 11]
          return obj
        }
        return obj
      }
      obj = changeFivteenToEighteen(obj)
      var len = obj.length
      if (len == '18') {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
        var cardTemp = 0,
          i, valnum
        for (i = 0; i < 17; i++) {
          cardTemp += obj.substr(i, 1) * arrInt[i]
        }
        valnum = arrCh[cardTemp % 11]
        if (valnum == obj.substr(17, 1)) {
          return true
        }
        return false
      } else {
        return false
      }
      return true
    },
    getPercent: function (value, total) {
      return (value / total).toPercent()
    }
  }

})(lf, window);
/*
 * 网络请求
 */
(function ($, window) {
  var filter = function (data) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    var str = JSON.stringify(data)
    str = str.replace(patt, function(char) {
      return ''
    });
    return JSON.parse(str)
  }
  var sign = function (data) {
    var str = ''
    // 第一步排序
    var objKeys = Object.keys(data)
    objKeys = objKeys.sort()
    // 连接
    for (var i in objKeys) {
      str += objKeys[i] + '=' + data[objKeys[i]]
    }
    str += REQUESTDATA.appsecret
    var sign = lf.hex_md5(str)
    data.sign = sign
  }

  $.net = {
    /**
     * @description 上传
     * @param {String} url 上传服务器路径
     * @param {Array} files 文件，可以是多个或者一个,数组中存放对象，对象模式为：{path:"",key:""}
     * @param {Object} data 参数
     * @param {Function} successBC 上传成功回调函数
     */
    upload: function (url, data, params, success, error, uploadProgress, uploadComplete, uploadFailed, uploadCanceled) {
      if (!$.util.isFormData(data)) {
        var formData = new FormData()
        if ($.util.isObject(data)) {
          formData.append(data.file_name, data.file)
          data = formData
        } else if ($.util.isArray(data)) {
          data.forEach(function (v) {
            formData.append(v.file_name, v.file)
          })
          data = formData
        } else {
          $.log.error('无上传文件数据或格式错误')
          return
        }
      }
      params.uid = lf.cookie.get('uid')
      params.auth_sign = lf.cookie.get('token')
      var tempData = {
        appkey: REQUESTDATA.appkey,
        params: JSON.stringify(params)
      }
      tempData = filter(tempData)
      sign(tempData)
      for (var key in tempData) {
        formData.append(key, tempData[key])
      }
      var action = url
      if (url.indexOf('http') == -1 && SERVER_BAS_URL) {
        if (url.indexOf('/') != 0) {
          url = SERVER_BAS_URL + '/' + url
        } else {
          url = SERVER_BAS_URL + url
        }
      }
      var requestData = data
      var request = new XMLHttpRequest()
      var xDomain = false
      request.open('POST', url, true)

      //			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
      request.timeout = 0
      $.log.info('send[' + action + ']文件上传')
      request.onreadystatechange = function handleLoad() {
        if (!request || (request.readyState !== 4 && !xDomain)) {
          return
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return
        }
        var responseData = request.responseText
        $.log.info('received[' + action + ']：' + responseData)
        var rs = JSON.parse(responseData)
        if (typeof success === 'function') {
          success(rs)
        }
        request = null
      }
      request.onerror = function handleError() {
        $.log.error('received[' + action + ']：error')
        var rs = {
          code: 900,
          errorMessage: '系统异常'
        }
        if (typeof error === 'function') {
          error(rs)
        }
        request = null
      }
      request.ontimeout = function handleTimeout() {
        $.log.error('received[' + action + ']：timeout')
        var rs = {
          code: 901,
          info: '系统请求超时'
        }
        if (typeof error === 'function') {
          error(rs)
        }
        request = null
      }

      request.setRequestHeader('Accept', 'application/json, text/plain, */*')
      if (typeof uploadProgress === 'function') {
        request.addEventListener('progress', uploadProgress)
      }
      request.send(requestData)
    }
  }
  axios.defaults.baseURL = SERVER_BAS_URL
  axios.defaults.timeout = 10000
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.headers.post['crossDomain'] = true
  axios.interceptors.request.use(function (config) {
    if (config.url === '/Cid/Freight/order_create') {
      config.timeout = 120000
    }
    config.data.auth_sign = lf.cookie.get('token')
    var tempData = {
      appkey: REQUESTDATA.appkey,
      params: JSON.stringify(config.data)
    }
    var data = tempData

    data = filter(data)
    sign(data)
    $.log.info('send[' + config.url.replace(config.baseURL,'') + ']:' + $.util.jsonToStr(data))
    config.data = qs.stringify(data)
    return config;
  }, function (error) {
    return Promise.reject(error)
  })
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    $.log.info('received[' + response.config.url.replace(response.config.baseURL, '') + ']：' + JSON.stringify(response.data))
    if (response.data.code == '403') {
      lf.cookie.clear()
      throw Error('登录失效')
    }
    return response.data
  }, function (error) {
    // Do something with response error
    console.error(error.message)
    var obj = {}

    if (error.message.indexOf('Network') > -1) {
      obj.code = 900
      obj.info = '系统异常'
    } else if (error.message.indexOf('404') > -1) {
      obj.code = 404
      obj.info = '找不到请求'
    } else if (error.message.indexOf('timeout') > -1) {
      obj.code = 901
      obj.info = '系统请求超时'
    } else {
      obj = error
    }
    return Promise.reject(obj)
  })
  $.$http = axios
})(lf, window);
lf.nativeEvent = {};
lf.addNativeEvent = function (type, cb) {
  lf.nativeEvent[type] = cb
};
window.onShow = function () {
  if (lf.nativeEvent['show']) {
    lf.nativeEvent['show']()
  }
};
/*
 * base64
 */
(function ($, window) {
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1)

  var utf16to8 = function (str) {
    var out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else {
        if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        }
      }
    }
    return out
  }
  var utf8to16 = function (str) {
    var out, i, len, c
    var char2, char3
    out = ''
    len = str.length
    i = 0
    while (i < len) {
      c = str.charCodeAt(i++)
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1)
          break
        case 12:
        case 13:
          // 110x xxxx 10xx xxxx
          char2 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx10xx xxxx10xx xxxx
          char2 = str.charCodeAt(i++)
          char3 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0))
          break
      }
    }
    return out
  }
  $.base64encode = function (str) {
    str = utf16to8(str)
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return out
  }
  $.base64decode = function (str) {
    str = utf8to16(str)
    var c1, c2, c3, c4
    var i, len, out
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c1 == -1)
      if (c1 == -1)
        break
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      }
      while (i < len && c2 == -1)
      if (c2 == -1)
        break
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 == 61)
          return out
        c3 = base64DecodeChars[c3]
      }
      while (i < len && c3 == -1)
      if (c3 == -1)
        break
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 == 61)
          return out
        c4 = base64DecodeChars[c4]
      }
      while (i < len && c4 == -1)
      if (c4 == -1)
        break
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  }
})(lf, window);
/*
 * md5
 */
(function ($, window) {
  var rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }
  var addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      else return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  var F = function (x, y, z) {
    return (x & y) | ((~x) & z)
  }

  var G = function (x, y, z) {
    return (x & z) | (y & (~z))
  }

  var H = function (x, y, z) {
    return (x ^ y ^ z)
  }

  var I = function (x, y, z) {
    return (y ^ (x | (~z)))
  }

  var FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  var GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  var HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  var II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  var convertToWordArray = function (string) {
    var lWordCount
    var lMessageLength = string.length
    var lNumberOfWordsTempOne = lMessageLength + 8
    var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16
    var lWordArray = Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  var wordToHex = function (lValue) {
    var WordToHexValue = '',
      WordToHexValueTemp = '',
      lByte, lCount
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      WordToHexValueTemp = '0' + lByte.toString(16)
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
    }
    return WordToHexValue
  }

  var uTF8Encode = function (string) {
    string = string.replace(/\x0d\x0a/g, '\x0a')
    var output = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        output += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        output += String.fromCharCode((c >> 6) | 192)
        output += String.fromCharCode((c & 63) | 128)
      } else {
        output += String.fromCharCode((c >> 12) | 224)
        output += String.fromCharCode(((c >> 6) & 63) | 128)
        output += String.fromCharCode((c & 63) | 128)
      }
    }
    return output
  }
  $.hex_md5 = function (string) {
    var x = Array()
    var k, AA, BB, CC, DD, a, b, c, d
    var S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22
    var S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20
    var S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23
    var S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21
    string = uTF8Encode(string)
    x = convertToWordArray(string)
    a = 0x67452301
    b = 0xEFCDAB89
    c = 0x98BADCFE
    d = 0x10325476
    for (k = 0; k < x.length; k += 16) {
      AA = a
      BB = b
      CC = c
      DD = d
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244)
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314)
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
      a = addUnsigned(a, AA)
      b = addUnsigned(b, BB)
      c = addUnsigned(c, CC)
      d = addUnsigned(d, DD)
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
    return tempValue.toLowerCase()

  }
})(lf, window);

(function ($, window) {
  Date.prototype.format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1,                 //月份
      'd+': this.getDate(),                    //日
      'H+': this.getHours(),                   //小时
      'h+': this.getHours(),                   //小时
      'm+': this.getMinutes(),                 //分
      's+': this.getSeconds(),                 //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds()             //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
  }
  Number.prototype.toPercent = function () {
    return (Math.round(this * 10000) / 100).toFixed(2) + '%'
  }
})(lf, window)

export default lf
