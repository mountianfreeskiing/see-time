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


  // 睡眠

  app.router('sleep/startSleep', async (context) => {
    context.body = startSleep(event);
  });

  app.router('sleep/getSleepStatus', async (context) => {
    context.body = getSleepStatus(event);
  });

  app.router('sleep/getUp', async (context) => {
    context.body = sleepGetUp(event);
  });

  app.router('sleep/remove', async (context) => {
    context.body = removeSleepData(event);
  });

  app.router('sleep/calStatistical', async (context) => {
    context.body = sleepCalStatistical(event);
  });

  app.router('sleep/getStatistical', async (context) => {
    context.body = getSleepStatistical(event);
  });

  app.router('sleep/getCurrentSleepHour', async (context) => {
    context.body = getCurrentSleepHour(event);
  });

  app.router('sleep/getDaySleepHour', async (context) => {
    context.body = getTodaySleepHour(event);
  });

  app.router('sleep/updateGetUp', async (context) => {
    context.body = sleepUpdateGetUp(event);
  });

  // 工作



  return app.serve();
}

/*******               Function                    ******/

// 睡眠

async function startSleep(event) {
  let body = {}

  try {
    res = await db.collection('sleep').where({
      endTime: "",
      openId: event.openId
    }).get();

    if (res.data && res.data.length) {
      body = {
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

      body = {
        code: 0,
        message: 'success',
        data: res.data,
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

  return body;
}

async function getSleepStatus(event) {
  let body = {}
  try {
    res = await db.collection('sleep').where({
      endTime: "",
      openId: event.openId
    }).get();

    if (res.data && res.data.length) {
      res.data[0].isSleeping = true
      body = {
        code: 0,
        message: 'success',
        data: res.data[0],
        event
      }
    } else {
      body = {
        code: 0,
        message: 'success',
        data: res.data,
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

  return body;
}

async function sleepGetUp(event) {
  let body = {}
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

      body = {
        code: 0,
        message: 'success',
        data: res.data,
        event
      }
    } else {
      body = {
        code: 100,
        message: '没有要起床的任务',
        data: res,
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
  
  return body;
}

async function removeSleepData(event) {
  let body = {}
  try {
    res = await db.collection('sleep').where({
      endTime: "",
      openId: event.openId
    }).remove();

    body = {
      code: 0,
      message: 'success',
      data: res.data,
      event
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: {},
      event
    }
  }

  return body;
}

async function getSleepStatistical(event) {
  let body = {}
  try {
    res = await db.collection('statistical').where({
      openId: event.openId,

    })
    .orderBy('updateTime', 'desc')
    .limit(7)
    .get();

    body = {
      code: 0,
      message: 'success',
      data: res.data,
      event
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: {},
      event
    }
  }

  return body;
}

async function getCurrentSleepHour(event) {
  let body = {}
  try {
    res = await db.collection('sleep').where({
      openId: event.openId,
      endTime: event.endTime
    })
    .get();

    body = {
      code: 0,
      message: 'success',
      data: res.data,
      event
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: {},
      event
    }
  }

  return body;
}

async function getTodaySleepHour(event) {
  let body = {}
  try {
    res = await db.collection('statistical').where({
      openId: event.openId,
      date: event.date
    })
    .get();

    body = {
      code: 0,
      message: 'success',
      data: res.data,
      event
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: {},
      event
    }
  }

  return body;
}

async function sleepUpdateGetUp(event) {
  let body = {}
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

      body = {
        code: 0,
        message: 'success',
        data: res.data,
        event
      }
    } else {
      body = {
        code: 100,
        message: '找不到记录',
        data: {},
        event
      }
    }
  } catch (err) {
    body = {
      code: 100,
      message: err,
      data: res,
      event
    }
  }

  return body;
}

async function sleepCalStatistical(event) {
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

// 工作

