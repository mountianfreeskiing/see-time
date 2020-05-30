// pages/launch/launch.js
import * as api from "../../utils/api.js";

const app = getApp()
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
  api.login().then((res) => {
    console.log('login success:', res)
    app.globalData.openid = res.result.data.openid
    this.updateUserInfo()
  }).catch((err) => {
    console.error('[云函数] [login] 调用失败', err)
    this.loginFailed(err)
  });
},

updateUserInfo() {
  const data = {
    openId: app.globalData.openid
  }
  api.getUser(data).then((result) => {
    console.log('get success:', result)
    const res = result.result
    if (res.data && res.data.length) {
      //存在则更新
      const data = {
        _id: res.data[0]._id,
        openId: app.globalData.openid,
        userInfo: app.globalData.userInfo
      }
      api.updateUser(data).then((res) => {
        console.log('update success:', res)
        this.toPageIndex()
      }).catch((err) => {
        console.error('[云函数] [update] 调用失败', err)
        this.loginFailed(err)
      });
    } else {
      //不存在新增
      const data = {
        openId: app.globalData.openid,
        userInfo: app.globalData.userInfo
      }
      api.addUser(data).then((res) => {
        this.toPageIndex()
      }).catch((err) => {
        console.error('[云函数] [add] 调用失败', err)
        this.loginFailed(err)
      });
    }
  }).catch((err) => {
    this.loginFailed(err)
  });
},

loginFailed(err) {
  console.log(err)
  app.showToast('登录失败')
},

toPageIndex() {
  setTimeout(() => {
    wx.reLaunch({
      url: "/pages/index/index",
    })
  }, 1000);
},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})