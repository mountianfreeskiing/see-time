//index.js
//获取应用实例
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
    console.log(index);
    switch (index) {
      case 0:
        wx.navigateTo({ url: '/pages/sleep/sleepTime/sleepTime' });
      break;
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
  }
})
