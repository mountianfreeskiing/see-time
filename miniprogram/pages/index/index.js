//index.js
//获取应用实例
import * as api from "../../utils/api.js";

const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [
      {
        img: '../../images/icon_sleeping.png',
        text: '睡眠'
      },
      {
        img: '../../images/icon_working.png',
        text: '工作'
      },
      {
        img: '../../images/icon_food.png',
        text: '食材'
      },
      {
        img: '../../images/icon_reading.png',
        text: '阅读'
      },
      {
        img: '../../images/icon_painting.png',
        text: '绘画'
      },
      {
        img: '../../images/icon_drinking.png',
        text: '饮水'
      },
      {
        img: '../../images/icon_studying.png',
        text: '学习'
      }
    ]
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  navigatView: function (e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case 0:
        wx.navigateTo({ url: '/pages/sleep/sleepTime/sleepTime' });
      break;
      case 1:
        const data = {
          openId: app.globalData.openid
        }

        wx.showLoading({
          title: '请稍后...',
          mask: true
        });

        api.isWorking(data).then((result) => {
          console.log("isWorking success:", result);
          if (result.result.code === 0 && result.result.data && result.result.data.inWorkStatus) {
            wx.navigateTo({ url: '/pages/work/workTime/workTime' });
          } else {
            wx.navigateTo({ url: '/pages/work/workContent/workContent' });
          }
          wx.hideLoading();
        }).catch((err) => {
          wx.hideLoading();
          console.error('[云函数] [isWorking] 调用失败', err)
        });

        break
      case 2:
        wx.navigateTo({ url: '/pages/food/food' });
        break;
      default:
      break;
    }
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../profile/profile'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //初始化统计数据
    if (this.data.hasUserInfo) {
      this.calData();
    }
  },

  async calData() {
    const data = {
      openId: app.globalData.openid
    }
    let res, res1, res2;
    try {
      res = await api.calSleepStatistical(data);
      console.log("calSleepStatistical:", res);
      res1 = await api.calWorkCountStatistical(data);
      console.log("calWorkCountStatistical:", res1);
      res2 = await api.calWorkTimeStatistical(data);
      console.log("calWorkTimeStatistical:", res2);
    } catch (err) {
      console.log(err);
    }
  }
})
