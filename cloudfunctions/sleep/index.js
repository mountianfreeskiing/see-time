// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'see-time-dev-kql61',
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()


  await db.collection('Orders').add({
    data: event,
    success(res) { //成功打印消息
      console.log('3', res)
    },
    fail(res) { //存入数据库失败
      console.log('订单存入数据库操作失败');
      //云函数更新
    }
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}