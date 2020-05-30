// pages/sleepCounter/sleepCounter.js

import { getCurrentSleepHour, updateGetUpTime } from "../../../utils/api.js";

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    hour: '0',
    isDoubleHour: false,
    minute: '00',
    datePickerValue: ['', ''],
    datePickerIsShow: false,
    endTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.endTime = options.endTime === undefined ? "" : parseInt(options.endTime);

    console.log('endTime:' + this.data.e)
    this.getSleepHour(this.data.endTime)
  },

  getSleepHour(endTime) {
    let data = {
      openId: app.globalData.openid,
      endTime: endTime
    }
    getCurrentSleepHour(data).then((result) => {
      console.log("getCurrentSleepHour success:", result)
      if (result.result.code === 0 && result.result.data && result.result.data.length) {
        let hour = result.result.data[0].sleepHour;
        let minute = result.result.data[0].sleepMinute;
        let minStr = '';
        if (minute < 10) {
          minStr = '0' + minute
        } else {
          minStr = '' + minute
        }
        this.setData({
          hour: hour,
          minute: minStr,
          isDoubleHour: parseInt(hour) >= 10
        })
      }
    }).catch((err) => {
      console.error('[云函数] [getCurrentSleepHour] 调用失败', err)
    });
  },


  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },

  timePickerOnSureClick: function (e) {
    console.log('PickerOnSureClick');
    console.log(e);
    
    this.setData({
      datePickerValue: e.detail.value,
      datePickerIsShow: false
    });

    wx.showLoading({
      title: '请稍后...',
      mask: true
    });
      
    let hour = e.detail.value[0]
    let minute = e.detail.value[1]

    let date = new Date(this.data.endTime)

    let timeStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + hour + ":" + minute + ":00";

    console.log(timeStr)

    let getUpTime = new Date(timeStr)

    let data = {
      openId: app.globalData.openid,
      endTime: getUpTime.getTime(),
      originEndTime: this.data.endTime
    }

    updateGetUpTime(data).then((result) => {
      console.log("updateGetUpTime success:", result)
      if (result.result.code !== 0) {
        app.showToast('请求失败!')
      } else {
        //更新数据
        this.getSleepHour(getUpTime.getTime())
      }
      wx.hideLoading();
    }).catch((err) => {
      wx.hideLoading();
      console.error('[云函数] [updateGetUpTime] 调用失败', err)
    });
  },

  timePickerOnCancelClick: function (e) {
    console.log('PickerOnCancelClick');
    console.log(e);
    this.setData({
      datePickerIsShow: false,
    });
  },
})