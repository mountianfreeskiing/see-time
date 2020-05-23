// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')


cloud.init({
  env: 'see-time-dev-kql61',
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });

  app.router('startSleep', async (context) => {
    try {
      res = await db.collection('sleep').where({
        endTime: "",
        openId: event.openId
      }).get();

      if (res.data && res.data.length) {
        context.body = {
          code: 100,
          message: '还有未起床的任务，暂时不能增加',
          data: res.data,
          event
        }
      } else {
        res = await db.collection('sleep').add({
          data: {
            openId: event.openId,
            startTime: event.startTime,
            endTime: "",
            date: '',
            sleepHour: 0,
            sleepMinute: 0,
            sleepSecond: 0
          }
        })

        context.body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
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

  app.router('getSleepStatus', async (context) => {
    try {
      res = await db.collection('sleep').where({
        endTime: "",
        openId: event.openId
      }).get();

      if (res.data && res.data.length) {
        res.data[0].isSleeping = true
        context.body = {
          code: 0,
          message: 'success',
          data: res.data[0],
          event
        }
      } else {
        context.body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
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

  app.router('getUp', async (context) => {
    try {
      res = await db.collection('sleep').where({
        endTime: "",
        openId: event.openId
      }).get();

      if (res.data && res.data.length) {
        //更新起床时间
        let startTime = res.data[0].startTime;
        let date = new Date(startTime)
        let dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        let sleepTime = event.endTime - startTime;
        let h = 0, m = 0, s = 0;
        if (sleepTime > 0) {
          h = Math.floor(sleepTime / 1000 / 60 / 60 % 24);
          m = Math.floor(sleepTime / 1000 / 60 % 60);
          s = Math.floor(sleepTime / 1000 % 60);
        }

        res = await db.collection('sleep').doc(event._id).update({
          data: {
            endTime: event.endTime,
            date: dateString,
            sleepHour: h,
            sleepMinute: m,
            sleepSecond: s
          }
        });

        context.body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
      } else {
        context.body = {
          code: 100,
          message: '没有要起床的任务',
          data: res,
          event
        }
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

  app.router('remove', async (context) => {
    try {
      res = await db.collection('sleep').where({
        endTime: "",
        openId: event.openId
      }).remove();

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

  app.router('calStatistical', async (context) => {
    context.body = calStatistical(event);
  });

  app.router('getStatistical', async (context) => {
    try {
      res = await db.collection('statistical').where({
        openId: event.openId,

      })
      .orderBy('updateTime', 'desc')
      .limit(7)
      .get();

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

  app.router('getCurrentSleepHour', async (context) => {
    try {
      res = await db.collection('sleep').where({
        openId: event.openId,
        endTime: event.endTime
      })
      .get();

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

  app.router('getDaySleepHour', async (context) => {
    try {
      res = await db.collection('statistical').where({
        openId: event.openId,
        date: event.date
      })
      .get();

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

  app.router('updateGetUp', async (context) => {
    try {

      res = await db.collection('sleep').where({
        openId: event.openId,
        endTime: event.originEndTime
      })
      .get();

      if (res.data && res.data.length) {
        let startTime = res.data[0].startTime;
        let sleepTime = event.endTime - startTime;
        let h = 0, m = 0, s = 0;
        if (sleepTime > 0) {
          h = Math.floor(sleepTime / 1000 / 60 / 60 % 24);
          m = Math.floor(sleepTime / 1000 / 60 % 60);
          s = Math.floor(sleepTime / 1000 % 60);
        }
        res = await db.collection('sleep').doc(res.data[0]._id).update({
          data: {
            endTime: event.endTime,
            sleepHour: h,
            sleepMinute: m,
            sleepSecond: s
          }
        });
  
        context.body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
      } else {
        context.body = {
          code: 100,
          message: '找不到记录',
          data: {},
          event
        }
      }
    } catch (err) {
      context.body = {
        code: 100,
        message: err,
        data: res,
        event
      }
    }
  });

  return app.serve();
}

async function calStatistical(event) {
  let body = {}
  try {
    //聚合操作把时分小时计算出来
    let now = new Date().getTime();
    res = await db.collection('sleep')
      .aggregate()
      .match({
        openId: event.openId,
        endTime: _.neq(""),
        startTime: _.gt(now - 10 * 24 * 60 * 60 * 1000)//10天内的数据
      })
      .group({
        // 按 date 字段分组
        _id: {
          date: '$date',
          openId: '$openId',
        },
        sleepHours: $.sum('$sleepHour'),
        sleepMinutes: $.sum('$sleepMinute'),
        sleepSeconds: $.sum('$sleepSecond')
      })
      .end();

    if (res.list && res.list.length) {
      for (const item of res.list) {
        let date = new Date(item._id.date)
        let dayString = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
        try {
          res = await db.collection('statistical').where({
            date: item._id.date
          }).get();

          if (res.data && res.data.length) {
            res = await db.collection('statistical').doc(res.data[0]._id).update({
              data: {
                sleepHour: item.sleepHours,
                sleepMinute: item.sleepMinutes,
                sleepSecond: item.sleepSeconds,
                updateTime: new Date().getTime(),
                dayString: dayString
              }
            });

            body = {
              code: 0,
              message: 'success',
              data: res,
              event
            }
          } else {
            res = await db.collection('statistical').add({
              data: {
                date: item._id.date,
                openId: item._id.openId,
                sleepHour: item.sleepHours,
                sleepMinute: item.sleepMinutes,
                sleepSecond: item.sleepSeconds,
                updateTime: new Date().getTime(),
                dayString: dayString
              }
            })

            body = {
              code: 0,
              message: 'success',
              data: res,
              event
            }
          }
        } catch (err) {
          body = {
            code: 100,
            message: 'error',
            data: err,
            event
          }
        }
      }
    } else {
      body = {
        code: 0,
        message: 'success empty data',
        data: {},
        event
      }
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: {},
      event
    }
  }

  return body
}