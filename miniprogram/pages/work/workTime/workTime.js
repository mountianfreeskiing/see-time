// miniprogram/pages/work/workTime/workTime.js
import * as api from "../../../utils/api.js";

const app = getApp();

let show = true;
let lastSecond = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 0,
    canvasHeight: 0,
    btnBg: '../../images/icon_btn_bg.png',
    rightText: '暂停',
    isWorking: false,
    startTime: '',
    id: '',
    accumulatedHour: 0,
    accumulatedMiniutes: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    //获取系统信息  
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.setData({
          canvasWidth: res.windowWidth,
          canvasHeight: res.windowHeight,
        })
      }
    })

    this.getWorkingStatus();
  },

  getWorkingStatus() {
    const data = {
      openId: app.globalData.openid
    }

    api.getWorkingStatus(data).then((result) => {
      console.log("getWorkingStatus success:", result)
      if (result.result.code === 0) {
        let workData = result.result.data
        this.setData({
          rightText: workData.isWorking ? '暂停' : '继续',
          isWorking: workData.isWorking,
          id: workData._id,
          accumulatedHour: workData.workHour,
          accumulatedMiniutes: workData.workMinute,
          startTime: (workData.continueTime && workData.continueTime !== '') ? workData.continueTime : workData.startTime 
        });

        this.drawClock(true);
      }
    }).catch((err) => {
      console.error('[云函数] [getWorkingStatus] 调用失败', err)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 每40ms执行一次drawClock()，
    this.interval = setInterval(this.drawClock, 40);
  },

  // 所有的canvas属性以及Math.sin,Math.cos()等涉及角度的参数都是用弧度表示
  // 时钟
  drawClock: function (first) {
    const ctx = wx.createCanvasContext('clock');
    const that = this.data;
    let height = this.data.canvasHeight;
    let width = this.data.canvasWidth;
    // 设置文字对应的半径
    let R = width / 4;
    ctx.save();
    // 把原点的位置移动到水平居中
    ctx.translate(width * 0.5, height * 0.25);

    if (!first && !that.isWorking) {
      return;
    }

    // 画外框
    function drawBackground() {
      const grd = ctx.createLinearGradient(180, 0, 0, 180);
      grd.addColorStop(0.2, '#f9ec61')
      grd.addColorStop(0.8, '#b5ebdc')

      ctx.setStrokeStyle(grd);
      // 设置线条的粗细，单位px
      ctx.setLineWidth(4);
      // 开始路径
      ctx.beginPath();
      // 运动一个圆的路径
      // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
      ctx.arc(0, 0, R * 1.5, 0, 2 * Math.PI, false);
      ctx.closePath();
      // 描出点的路径
      ctx.stroke();
    };

    function drawSleepText() {
      ctx.setFontSize(28);
      ctx.fillStyle="#B0B0B0";
      ctx.setTextAlign('center');
      ctx.fillText('工作时长', 0, -60);
    };

    function drawTimeNumbers(time) {
      // 保存画之前的状态
      ctx.save();
      ctx.font = "300 60px 'PingFang SC'";
      ctx.fillStyle="black";
      ctx.setTextAlign('center');
      ctx.textBaseline = "middle";

      let h = 0, m = 0, s = 0;
      try {
        if (that.isWorking && that.startTime !== "") {
          let leftTime = time - that.startTime;
          if (leftTime >= 0) {
              h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
              m = Math.floor(leftTime / 1000 / 60 % 60);
              s = Math.floor(leftTime / 1000 % 60 );
          }
        }
      } catch (e) {
        console.log(e);
      }

      //中间可能暂停很多次累加总时间
      h = h + that.accumulatedHour;
      m = m + that.accumulatedMiniutes;

      if (m > 60) {
        h = h + parseInt(m/60) 
        m = m - parseInt(m/60) * 60 
      }

      //控制中间的:闪烁
      let middleStr;
      if (s - lastSecond >= 1) {
        if (show) {
          middleStr = ":"
          show = false;
        } else {
          middleStr = " "
          show = true;
        }
      } else {
        if (show) {
          middleStr = ":"
        } else {
          middleStr = " "
        }
      }
      lastSecond = s;

      //绘制睡眠的时长
      let hourStr, minStr;
      if (h >= 10) {
        hourStr = h//middleStr;
        ctx.fillText(hourStr, - width / 4 + 20, 7);
        ctx.save();
        ctx.font = "300 30px 'PingFang SC'";
        ctx.fillText('h', - width / 4 + 70, 7);
        ctx.restore();
      } else {
        hourStr = '0' + h//middleStr;
        ctx.fillText(hourStr, - width / 4 + 20, 7);
        ctx.save();
        ctx.font = "300 30px 'PingFang SC'";
        ctx.fillText('h', - width / 4 + 70, 7);
        ctx.restore();
      }
      if (m >= 10) {
        minStr = m;
        ctx.fillText(minStr, width / 5 - 40, 7);
        ctx.save();
        ctx.font = "300 30px 'PingFang SC'";
        ctx.fillText('m', width / 5 + 10, 7);
        ctx.restore();
      } else {
        minStr = '0' + m;
        ctx.fillText(minStr, width / 5 - 40, 7);
        ctx.save();
        ctx.font = "300 30px 'PingFang SC'";
        ctx.fillText('m', width / 5 + 10, 7);
        ctx.restore();
      }
      // ctx.fillText(hourStr + minStr, 0, 7);
      // 返回画之前的状态
      ctx.restore();
    };

    function Clock() {
      // 实时获取各个参数
      let now = new Date();
      let time = now.getTime();
      // 依次执行各个方法
      drawBackground();
      drawSleepText();
      drawTimeNumbers(time);
      ctx.draw();
    }
    Clock();
  },

  resumeWorkOrPause() {
    const data = {
      openId: app.globalData.openid
    }

    if (this.data.isWorking) {
      api.pauseWorkData(data).then((result) => {
        console.log("pauseWorkData success:", result);
        if (result.result.code === 0) {
          //暂停成功，停止计时器
          this.setData({
            isWorking: false,
            rightText: '继续'
          })
        } else {
          app.showToast(result.result.message)
        }
      }).catch((err) => {
        app.showToast("系统内部异常")
        console.error('[云函数] [pauseWorkData] 调用失败', err);
      });
    } else {
      api.continueWorkData(data).then((result) => {
        console.log("continueWorkData success:", result);
        if (result.result.code === 0) {
          const data = result.result.data[0];
          //继续成功，重新开始计时并重置开始时间
          this.setData({
            isWorking: true,
            startTime: data.continueTime,
            accumulatedHour: data.workHour,
            accumulatedMiniutes: data.workMinute,
            rightText: '暂停'
          })
        } else {
          app.showToast(result.result.message)
        }
      }).catch((err) => {
        console.error('[云函数] [continueWorkData] 调用失败', err);
      });
    }
  },

  cancelTimeCount() {
    const data = {
      openId: app.globalData.openid,
    }
    api.cancelWorkData(data).then((result) => {
      console.log("cancelWorkData success:", result);
      if (result.result.code === 0) {
        wx.redirectTo({ url: '/pages/work/workContent/workContent' });
      } else {
        app.showToast("系统内部异常")
      }
    }).catch((err) => {
      app.showToast('任务取消失败');
      console.error('[云函数] [cancelWorkData] 调用失败', err);
    });
  },

  finishWork() {
    const now = new Date();
    const time = now.getTime();

    const data = {
      openId: app.globalData.openid,
      endTime: time
    }

    wx.showLoading({
      title: "请稍后...",
      mask: true
    });

    api.offDuty(data).then((result) => {
      console.log("offDuty success:", result);
      if (result.result.code === 0) {
        //去统计界面
        setTimeout(() => {
          this.setData({
            rightText: '开始',
            isWorking: false,
            startTime: ''
          })
          wx.redirectTo({url: `/pages/work/workCounter/workCounter?endTime=${time}`});
        }, 500);
      } else {
        app.showToast("系统内部异常")
      }
    }).catch((err) => {
      app.showToast('任务完成失败');
      console.error('[云函数] [offDuty] 调用失败', err); 
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})