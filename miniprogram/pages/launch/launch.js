// pages/launch/launch.js
const app = getApp()
const db = wx.cloud.database({
  env: app.DATA_BASE_ENV
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
      this.getOpenid()
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
        this.getOpenid()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: true
          })
          this.getOpenid()
        }
      })
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log('userInfo:', app.globalData.userInfo)
    this.setData({
      hasUserInfo: true
    })
    this.getOpenid()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { hasUserInfo } = this.data
    if (hasUserInfo) {
      this.getOpenid()
    }
  },


//获取openid同时获取云数据库用户信息
 getOpenid() {
  wx.showLoading({ title: "请稍候" });
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log(res)
      app.globalData.openid = res.result.openid
      this.updateUserInfo()
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
      this.loginFailed(err)
    }
  })
},

updateUserInfo() {
  db.collection('user').where({
    _openid: app.globalData.openid
  }).get().then(
    res => {
      console.log(res)
      if (res.data.length == 0) {
        //不存在则添加
        db.collection('user').add({
          data: {
            userInfo: app.globalData.userInfo,
          }
        }).then(res => {
          this.toPageIndex()
        }).catch(err => {
          this.loginFailed(err)
        })
      } else {
        //存在则更新
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            userInfo: app.globalData.userInfo,
          }
        }).then(res => {
          this.toPageIndex()
        }).catch(err => {
          this.loginFailed(err)
        })
      }
    }
  ).catch(
    err => {
      this.loginFailed(err)
    }
  )
},

loginFailed(err) {
  console.log(err)
  wx.hideLoading()
  app.showToast('登录失败')
},

toPageIndex() {
  wx.hideLoading()
  wx.reLaunch({
    url: "/pages/index/index",
  })
},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})