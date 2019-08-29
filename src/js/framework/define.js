/**
 * Created by lanfeng on 2016/5/10.
 */

var SERVER_BAS_URL = process.env.API_URL
// var PROJECT_NAME = 'webapp'
var REQUESTDATA = {
  'appkey': 'djiBdLnHXslpEcrcCW',
  'appsecret': 'avCUaghUvO16PuRrjmmAEtHbzEcLTecS'
}
/*
 * 日志级别配置
 * OFF、ERROR、WARN、INFO、DEBUG、ALL
 */
var debug = process.env.NODE_ENV === 'production' ? 'OFF' : 'ALL'

export {
  SERVER_BAS_URL,
  REQUESTDATA,
  debug
  // PROJECT_NAME
}
