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

  app.router('work/startWorking', async (context) => {
    context.body = startWorking(event);
  });

  app.router('work/isWorking', async (context) => {
    context.body = isWorking(event);
  });

  app.router('work/offDuty', async (context) => {
    context.body = offDuty(event);
  });

  app.router('work/cancel', async (context) => {
    context.body = removeWorkData(event);
  });

  app.router('work/pause', async (context) => {
    context.body = pauseWork(event);
  });

  app.router('work/continue', async (context) => {
    context.body = continueWork(event);
  });

  app.router('work/findWorkingStatus', async (context) => {
    context.body = getWorkingStatus(event);
  });

  app.router('work/findCurrentWorkHour', async (context) => {
    context.body = getCurrentWorkHour(event);
  });

  app.router('work/findCurrentWorkHour', async (context) => {
    context.body = getCurrentWorkHour(event);
  });

  app.router('work/updateOffDuty', async (context) => {
    context.body = workUpdateOffDuty(event);
  });

  app.router('work/calWorkCountStatistical', async (context) => {
    context.body = workCountCalStatistical(event);
  });

  app.router('work/calWorkTimeStatistical', async (context) => {
    context.body = workTimeCalStatistical(event);
  });

  app.router('work/findCommonWorkContent', async (context) => {
    context.body = getCommonWorkContent(event);
  });

  app.router('work/findTodayWorkHour', async (context) => {
    context.body = getTodayWorkHour(event);
  });

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
          content: event.content,
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

      res = await db.collection('sleep').doc(res.data[0]._id).update({
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
    res = await db.collection('statistical_sleep').where({
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
    }).get();

    sleepCalStatistical(event);

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
    res = await db.collection('statistical_sleep').where({
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
          res = await db.collection('statistical_sleep').where({
            date: item._id.date
          }).get();

          if (res.data && res.data.length) {
            res = await db.collection('statistical_sleep').doc(res.data[0]._id).update({
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
            res = await db.collection('statistical_sleep').add({
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

async function startWorking(event) {
  let body = {}

  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    if (res.data && res.data.length) {
      body = {
        code: 100,
        message: '还有工作中的任务，暂时不能增加',
        data: res.data,
        event
      }
    } else {
      if (event.content !== undefined && event.content !== null && event.content !== '') {
        res = await db.collection('work').add({
          data: {
            openId: event.openId,
            startTime: event.startTime,
            content: event.content,
            endTime: '',
            pauseTime: '',
            continueTime: '',
            date: '',
            workHour: 0,
            workMinute: 0,
            workSecond: 0
          }
        })

        body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
      } else {
        body = {
          code: 100,
          message: 'item 不能为空',
          data: res.data,
          event
        }
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

async function isWorking(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    if (res.data && res.data.length) {
      res.data[0].inWorkStatus = true
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

async function offDuty(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    //没有结束的工作任务endTime为空字符串
    if (res.data && res.data.length) {
      let h = 0, m = 0, s = 0;
      
      const originStart = res.data[0].startTime;
      const date = new Date(originStart)
      const dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      // 暂停的情况下直接结束
      if (res.data[0].pauseTime && res.data[0].pauseTime !== '') {
        h = res.data[0].workHour;
        m = res.data[0].workMinute;
        s = res.data[0].workSecond;
      } else {
        let startTime = '';
        if (res.data[0].continueTime && res.data[0].continueTime !== '') {
          startTime = res.data[0].continueTime;
        } else {
          startTime = res.data[0].startTime;
        }

        const oldH = res.data[0].workHour;
        const oldM = res.data[0].workMinute;
        const oldS = res.data[0].workSecond;
        const workTime = event.endTime - startTime;

        if (workTime > 0) {
          h = Math.floor(workTime / 1000 / 60 / 60 % 24);
          m = Math.floor(workTime / 1000 / 60 % 60);
          s = Math.floor(workTime / 1000 % 60);
        }
        //累加工作的时间
        h = h + oldH;
        m = m + oldM;
        s = s + oldS;

        if (m > 60) {
          h = h + parseInt(m/60);
          m = m - parseInt(m/60) * 60;
        }

        if (s > 60) {
          m = m + parseInt(s/60)
          s = s - parseInt(s/60) * 60;
        }
      }

      const _id = res.data[0]._id;

      res = await db.collection('work').doc(_id).update({
        data: {
          workHour: h,
          workMinute: m,
          workSecond: s,
          date: dateString,
          endTime: event.endTime
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
        message: '没有进行中的工作任务',
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

async function removeWorkData(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
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

async function pauseWork(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    //没有结束的工作任务endTime为空字符串
    if (res.data && res.data.length) {
      // 有暂停的任务
      if (res.data[0].pauseTime && res.data[0].pauseTime !== '') {
        body = {
          code: 100,
          message: '已经有处于暂停中的任务，无法暂停',
          data: res.data,
          event
        }
      } else {
        //暂停工作任务
        //判断有没有历史的暂停任务
        let startTime = '';
        if (res.data[0].continueTime && res.data[0].continueTime !== '') {
          startTime = res.data[0].continueTime;
        } else {
          startTime = res.data[0].startTime;
        }

        const oldH = res.data[0].workHour;
        const oldM = res.data[0].workMinute;
        const oldS = res.data[0].workSecond;
        const pauseTime = new Date().getTime();
        const wortTime = pauseTime - startTime;
        let h = 0, m = 0, s = 0;
        if (wortTime > 0) {
          h = Math.floor(wortTime / 1000 / 60 / 60 % 24);
          m = Math.floor(wortTime / 1000 / 60 % 60);
          s = Math.floor(wortTime / 1000 % 60);
        }
        //累加工作的时间
        h = h + oldH;
        m = m + oldM;
        s = s + oldS;

        if (m > 60) {
          h = h + parseInt(m/60);
          m = m - parseInt(m/60) * 60; 
        }
        if (s > 60) {
          m = m + parseInt(s/60)
          s = s - parseInt(s/60) * 60;
        }

        const _id = res.data[0]._id;

        res = await db.collection('work').doc(_id).update({
          data: {
            workHour: h,
            workMinute: m,
            workSecond: s,
            pauseTime: pauseTime,
            continueTime: ''
          }
        });

        res = await db.collection('work').where({
          _id: _id
        }).get();

        body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
      }
    } else {
      body = {
        code: 100,
        message: '没有进行中的工作任务',
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

async function continueWork(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    //没有结束的工作任务endTime为空字符串
    if (res.data && res.data.length) {
      // 有暂停的任务
      if (res.data[0].pauseTime && res.data[0].pauseTime !== '') {
        const continueTime = new Date().getTime();

        const _id = res.data[0]._id;

        res = await db.collection('work').doc(_id).update({
          data: {
            pauseTime: '',
            continueTime: continueTime
          }
        });

        res = await db.collection('work').where({
          _id: _id
        }).get();

        body = {
          code: 0,
          message: 'success',
          data: res.data,
          event
        }
      } else {
        body = {
          code: 100,
          message: '没有暂停中的任务，无法继续',
          data: res,
          event
        }
      }
    } else {
      body = {
        code: 100,
        message: '没有进行中的工作任务',
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

async function getWorkingStatus(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      endTime: "",
      openId: event.openId
    }).get();

    //没有结束的工作任务endTime为空字符串
    if (res.data && res.data.length) {
      // 有暂停的任务
      if (res.data[0].pauseTime && res.data[0].pauseTime !== '') {
        res.data[0].isWorking = false
      } else {
        res.data[0].isWorking = true
      }

      body = {
        code: 0,
        message: 'success',
        data: res.data[0],
        event
      }
    } else {
      body = {
        code: 100,
        message: '没有进行中的工作任务',
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

async function getCurrentWorkHour(event) {
  let body = {}
  try {
    res = await db.collection('work').where({
      openId: event.openId,
      endTime: event.endTime
    })
      .get();

    workCountCalStatistical(event);
    workTimeCalStatistical(event);

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

async function getTodayWorkHour(event) {
  let body = {}
  try {
    res = await db.collection('statistical_work_time').where({
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

async function getCommonWorkContent(event) {
  let body = {}
  try {
    res = await db.collection('statistical_work_count').where({
      openId: event.openId
    })
      .orderBy('count', 'desc')
      .limit(10)
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

async function workUpdateOffDuty(event) {
  let body = {}
  try {

    res = await db.collection('work').where({
      openId: event.openId,
      endTime: event.originEndTime
    }).get();

    if (res.data && res.data.length) {
      const startTime = res.data[0].startTime;
      const pauseTime = res.data[0].pauseTime;
      const continueTime = res.data[0].continueTime;
      let endTime = '';

      if (pauseTime !== '' && pauseTime > event.endTime) {
        //结束时间不能小于上一次的暂停时间
        endTime = pauseTime;
      } else if (continueTime !== '' && continueTime > event.endTime) {
        endTime = continueTime;
      } else if (event.endTime < startTime) {
        endTime = startTime;
      } else {
        endTime = event.endTime;
      }
      let workTime = '';
      let h = 0, m = 0, s = 0;
      if (pauseTime !== '') {
        workTime = endTime - pauseTime;
        if (workTime > 0) {
          h = res.data[0].workHour + Math.floor(workTime / 1000 / 60 / 60 % 24);
          m = res.data[0].workHour + Math.floor(workTime / 1000 / 60 % 60);
          s = res.data[0].workHour + Math.floor(workTime / 1000 % 60);
        }
      } else if (continueTime !== '') {
        const lastWorkTime = event.originEndTime - continueTime;
        if (lastWorkTime > 0) {
          h = res.data[0].workHour - Math.floor(lastWorkTime / 1000 / 60 / 60 % 24);
          m = res.data[0].workMinute - Math.floor(lastWorkTime / 1000 / 60 % 60);
          s = res.data[0].workSecond - Math.floor(lastWorkTime / 1000 % 60); 
        }
        workTime = endTime - continueTime;
        if (workTime > 0) {
          h = h + Math.floor(workTime / 1000 / 60 / 60 % 24);
          m = m + Math.floor(workTime / 1000 / 60 % 60);
          s = s + Math.floor(workTime / 1000 % 60);
        }
      } else {
        workTime = endTime - startTime;
        if (workTime > 0) {
          h = res.data[0].workHour + Math.floor(workTime / 1000 / 60 / 60 % 24);
          m = res.data[0].workHour + Math.floor(workTime / 1000 / 60 % 60);
          s = res.data[0].workHour + Math.floor(workTime / 1000 % 60);
        }
      }

      res = await db.collection('work').doc(res.data[0]._id).update({
        data: {
          endTime: event.endTime,
          workHour: h,
          workMinute: m,
          workSecond: s
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

async function workCountCalStatistical(event) {
  let body = {}
  try {
    //聚合操作把相同工作内容的数量统计出来
    let now = new Date().getTime();
    res = await db.collection('work')
      .aggregate()
      .match({
        openId: event.openId,
        endTime: _.neq(""),
        startTime: _.gt(now - 10 * 24 * 60 * 60 * 1000)//10天内的数据
      })
      .group({
        // 按 content 字段分组
        _id: {
          content: '$content',
          openId: '$openId'
        },
        count: $.sum(1),
        workHours: $.sum('$workHour'),
        workMinutes: $.sum('$workMinute'),
        workSeconds: $.sum('$workSecond')
      })
      .end();

    if (res.list && res.list.length) {
      for (const item of res.list) {
        try {
          res = await db.collection('statistical_work_count').where({
            content: item._id.content
          }).get();

          if (res.data && res.data.length) {
            res = await db.collection('statistical_work_count').doc(res.data[0]._id).update({
              data: {
                workHour: item.workHours,
                workMinute: item.workMinutes,
                workSecond: item.workSeconds,
                updateTime: new Date().getTime(),
                count: item.count
              }
            });

            body = {
              code: 0,
              message: 'success',
              data: res,
              event
            }
          } else {
            res = await db.collection('statistical_work_count').add({
              data: {
                content: item._id.content,
                openId: item._id.openId,
                workHour: item.workHours,
                workMinute: item.workMinutes,
                workSecond: item.workSeconds,
                count: item.count,
                updateTime: new Date().getTime()
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

async function workTimeCalStatistical(event) {
  let body = {}
  try {
    //聚合操作把时分小时计算出来
    let now = new Date().getTime();
    res = await db.collection('work')
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
        workHours: $.sum('$workHour'),
        workMinutes: $.sum('$workMinute'),
        workSeconds: $.sum('$workSecond')
      })
      .end();

    if (res.list && res.list.length) {
      for (const item of res.list) {
        let date = new Date(item._id.date)
        let dayString = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
        try {
          res = await db.collection('statistical_work_time').where({
            date: item._id.date
          }).get();

          if (res.data && res.data.length) {
            res = await db.collection('statistical_work_time').doc(res.data[0]._id).update({
              data: {
                workHour: item.workHours,
                workMinute: item.workMinutes,
                workSecond: item.workSeconds,
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
            res = await db.collection('statistical_work_time').add({
              data: {
                date: item._id.date,
                openId: item._id.openId,
                workHour: item.workHours,
                workMinute: item.workMinutes,
                workSecond: item.workSeconds,
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
