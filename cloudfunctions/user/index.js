// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');

cloud.init({
  env: 'see-time-dev-kql61',
  traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({ event });

  app.router('login', async (context) => {
    context.body = {
      code: 0,
      message: 'login success',
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
      },
      event
    }
  });

  app.router('add', async (context) => {
    try {
      res = await db.collection('user').add({
        data: {
          openId: event.openId,
          userInfo: event.userInfo
        }
      })

      console.log(res)
      context.body = {
        code: 0,
        message: 'success',
        data: {},
        event
      }
    } catch (err) {
      context.body = {
        code: 100,
        message: err,
        data: {},
        event
      }
    }
  });

  app.router('get', async (context) => {
    try {
      res = await db.collection('user').where({
        openId: event.openId
      }).get();

      console.log(res)
      context.body = {
        code: 0,
        message: 'success',
        data: res.data,
        event
      }
    } catch (err) {
      context.body = {
        code: 100,
        message: err,
        data: {},
        event
      }
    }
  });

  app.router('update', async (context) => {
    try {
      res = await db.collection('user').doc(event._id).update({
        data: {
          userInfo: event.userInfo
        }
      });

      console.log(res)
      context.body = {
        code: 0,
        message: 'success',
        data: res.data,
        event
      }
    } catch (err) {
      context.body = {
        code: 100,
        message: err,
        data: {},
        event
      }
    }
  });

  return app.serve();
}