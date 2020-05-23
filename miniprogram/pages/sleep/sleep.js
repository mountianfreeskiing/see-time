// pages/sleep/sleep.js
import * as api from "../../utils/api.js";

const wxCharts = require('../../utils/wxcharts.js');

const app = getApp();

let lineChart = null;
let show = true;
let lastSecond = 0;

Page({

  data: {
    canvasWidth: 0,
    canvasHeight: 0,
    rightText: "睡觉",
    btnBg: '../../images/icon_btn_bg.png',
    isSleeping: false,
    startTime: '',
    id: '',
    statisticalData: [0, 0, 0, 0, 0, 0, 0],
    weekData: []
  },

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

    this.getCurrentStatus();
    this.getStatisticalData();
  },

  getCurrentStatus() {
    const data = {
      openId: app.globalData.openid
    }

    api.getSleepStatus(data).then((result) => {
      console.log("getSleepStatus success:", result)
      if (result.result.code === 0) {
        let sleepData = result.result.data
        if (sleepData.isSleeping) {
          this.setData({
            rightText: '起床',
            isSleeping: sleepData.isSleeping,
            startTime: sleepData.startTime,
            id: sleepData._id
          });
        }
      }
    }).catch((err) => {
      console.error('[云函数] [getSleepStatus] 调用失败', err)
    });
  },

  getStatisticalData() {
    const that = this
    const data = {
      openId: app.globalData.openid
    }
    api.getStatisticalData(data).then((result) => {
      console.log("getStatisticalData success:", result)
      if (result.result.code === 0) {
        let sleepList = result.result.data

        sleepList.forEach(function(val, index, arr) {
          let hour = val.sleepHour
          let minute = val.sleepMinute
          const value = hour + minute / 60
          switch (val.dayString) {
            case '星期一':
              that.setData({
                ['statisticalData[0]']: value
              })
            break;
            case '星期二':
              that.setData({
                ['statisticalData[1]']: value
              })
              break;
            case '星期三':
              that.setData({
                ['statisticalData[2]']: value
              })
              break;
            case '星期四':
              that.setData({
                ['statisticalData[3]']: value
              })
              break;
            case '星期五':
              that.setData({
                ['statisticalData[4]']: value
              })
              break;
            case '星期六':
              that.setData({
                ['statisticalData[5]']: value
              })
              break;
            case '星期天':
              that.setData({
                ['statisticalData[6]']: value
              })
              break;
            default:
            break;
          }
        });
      }
      that.createChart();
    }).catch((err) => {
      console.error('[云函数] [getStatistical] 调用失败', err)
    });
  },

  onReady: function () {
    this.drawClock();
    // 每40ms执行一次drawClock()，
    this.interval = setInterval(this.drawClock, 40);
  },

  // 所有的canvas属性以及Math.sin,Math.cos()等涉及角度的参数都是用弧度表示
  // 时钟
  drawClock: function () {
    const ctx = wx.createCanvasContext('clock');
    const that = this.data;
    let height = this.data.canvasHeight;
    let width = this.data.canvasWidth;
    // 设置文字对应的半径
    let R = width / 4;
    ctx.save();
    // 把原点的位置移动到水平居中
    ctx.translate(width * 0.5, height * 0.25);

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
      ctx.fillText('睡眠时长', 0, -60);
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
        if (that.isSleeping && that.startTime !== "") {
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
      if (h > 10) {
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
      if (m > 10) {
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

  startSleepOrGetUp() {
    if (!this.data.isSleeping) {
      //睡觉
      this.goToBed();
    } else {
      //起床
      this.getUp();
    }
  },

  goToBed() {
    let now = new Date();

    const data = {
      openId: app.globalData.openid,
      startTime: now.getTime()
    }

    wx.showLoading({
      title: "请稍后...",
      mask: true
    });

    api.startSleep(data).then((result) => {
      console.log("start sleep success:", result)
      if (result.result.code === 0) {
        this.setData({
          rightText: '起床',
          isSleeping: true
        })
        this.getCurrentStatus()
      } else {
        app.showToast("系统内部异常")
      }
      wx.hideLoading();
    }).catch((err) => {
      console.error('[云函数] [startSleep] 调用失败', err)
      app.showToast("系统内部异常")
      wx.hideLoading();
    });
  },

  cancelTimeCount() {
    let data = {
      openId: app.globalData.openid
    }
    api.cancel(data).then((result) => {
      if (result.result.code === 0) {
        this.setData({
          rightText: '睡觉',
          isSleeping: false,
          startTime: ''
        })
      } else {
        app.showToast("系统内部异常")
      }
    }).catch((err) => {
      console.error('[云函数] [remove] 调用失败', err)
      app.showToast("系统内部异常")
    });
  },

  getUp() {
    let now = new Date();
    let time = now.getTime();

    let data = {
      _id: this.data.id,
      openId: app.globalData.openid,
      endTime: time
    }

    wx.showLoading({
      title: "请稍后...",
      mask: true
    });

    api.getUp(data).then((result) => {
      console.log("getUp success:", result)
      if (result.result.code === 0) {
        //去统计界面
        setTimeout(() => {
          this.setData({
            rightText: '睡觉',
            isSleeping: false,
            startTime: ''
          })
          wx.navigateTo({url: `/pages/counter/counter?endTime=${time}`});
        }, 500);
      } else {
        app.showToast("系统内部异常")
      }
      wx.hideLoading();
    }).catch((err) => {
      console.error('[云函数] [getUp] 调用失败', err)
      app.showToast("系统内部异常")
      wx.hideLoading();
    });

  },

  /////////////////////////////////图表

  createChart() {
    const that = this;
    const simulationData = this.createSimulationData();
    lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'area',
        categories: simulationData.categories,
        animation: true,
        series: [{
            name: '睡眠时长',
            data: simulationData.data,
            isGradient: true,
            pointTextColor: 'transparent',
            color: '#82EDC3',
            startColor: '#96F0CB',
            endColor: '#E4EB6B',
            format: function (val, name) {
                return Math.round(val) + '小时';
            }
        }],
        xAxis: {
            gridColor: '#83EEC4',
            fontColor1: '#FFFFFF',
            fontColor2: '#727171',
            bgColor1: '#88E8C3',
            bgColor2: '#E9F9DA',
            fontSize: 24,
            min: 0
        },
        yAxis: {
            title: '',
            format: function (val) {
                return Math.round(val);
            },
            min: 0,
            gridColor: '#83EEC4',
            fontColor: '#B3B3B3',
            fontSize: 23
        },
        width: that.data.canvasWidth,
        height: 150,
        dataLabel: true,
        dataPointShape: true,
        enableScroll: true,
        extra: {
            lineStyle: 'curve'
        }
    });
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
        format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data 
        }
    });        
  },

  createSimulationData: function () {
    let categories = [];
    let data = this.data.statisticalData;
    for (let i = 0; i < 7; i++) {
        switch (i) {
          case 0:
            categories.push('周一');
            break;
          case 1:
            categories.push('周二');
            break;
          case 2:
            categories.push('周三');
            break;
          case 3:
            categories.push('周四');
            break;
          case 4:
            categories.push('周五');
            break;
          case 5:
            categories.push('周六');
            break;
          case 6:
            categories.push('周天');
            break;
          default:
            break
        }
    }

    return {
        categories: categories,
        data: data
    }
  },

})