// pages/sleep/sleep.js
const wxCharts = require('../../utils/wxcharts.js');

const IS_SLEEPING = 'is_sleeping'
const LAST_SLEEP_TIME = 'last_sleep_time'

let lineChart = null;
let show = true;
let lastSecond = 0;
Page({

  data: {
    canvasWidth: 0,
    canvasHeight: 0,
    rightText: "睡觉",
    btnBg: '../../images/icon_btn_bg.png',
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

    let value = wx.getStorageSync(IS_SLEEPING);
    if (value) {
      that.setData({
        rightText: '起床'
      });
    }

    that.createChart();
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
    var height = this.data.canvasHeight;
    var width = this.data.canvasWidth;
    // 设置文字对应的半径
    var R = width / 4;
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
      ctx.font = "300 71px 'PingFang SC'";
      ctx.fillStyle="black";
      ctx.setTextAlign('center');
      ctx.textBaseline = "middle";

      let h = 0, m = 0, s = 0;
      try {
        let value = wx.getStorageSync(LAST_SLEEP_TIME)
        if (value != '') {
         let leftTime = time - value;

            if (leftTime >= 0) {
                h = Math.floor(leftTime / 1000/ 60/ 60 % 24);
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
        hourStr = h + middleStr;
      } else {
        hourStr = '0' + h + middleStr;
      }
      if (m > 10) {
        minStr = m;
      } else {
        minStr = '0' + m;
      }
      ctx.fillText(hourStr + minStr, 0, 7);
      // 返回画之前的状态
      ctx.restore();
    };

    function Clock() {
      // 实时获取各个参数
      var now = new Date();
      var time = now.getTime();
      // 依次执行各个方法
      drawBackground();
      drawSleepText();
      drawTimeNumbers(time);
      ctx.draw();
    }
    Clock();
  },

  startSleepOrGetUp() {
    let value = wx.getStorageSync(IS_SLEEPING);
    console.log("value:", value);
    if (!value) {
      //睡觉
      this.goToBed();
    } else {
      //起床
      this.getUp();
    }
  },

  goToBed() {
    var now = new Date();
    wx.setStorage({
      key: IS_SLEEPING,
      data: true,
    });
    wx.setStorage({
      key: LAST_SLEEP_TIME,
      data: now.getTime()
    });
    this.setData({
      rightText: '起床'
    })
  },

  cancelTimeCount() {
    wx.setStorage({
      key: IS_SLEEPING,
      data: false,
    });
    wx.removeStorage({
      key: LAST_SLEEP_TIME,
    });
    this.setData({
      rightText: '睡觉'
    })
  },

  getUp() {
    this.cancelTimeCount();
    //去统计界面
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
    let data = [];
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
        // data.push(Math.random()*(10-0));
    }
    for (let j = 0; j < 5; j++) {
      data.push(Math.random()*(10-0));
    }
    return {
        categories: categories,
        data: data
    }
  },

})