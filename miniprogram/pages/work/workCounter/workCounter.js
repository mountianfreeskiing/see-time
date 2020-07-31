// pages/sleepCounter/sleepCounter.js

import { getCurrentWorkHour, updateOffDuty } from "../../../utils/api.js";

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
   * 生命周期函数--监听页面加载1
   */
  onLoad: function (options) {
    this.data.endTime = typeof options.endTime === 'undefined' ? "" : parseInt(options.endTime);

    this.getWorkHour(this.data.endTime)
  },

  getWorkHour(endTime) {
    let data = {
      openId: app.globalData.openid,
      endTime: endTime
    }
    getCurrentWorkHour(data).then((result) => {
      console.log("getCurrentWorkHour success:", result)
      if (result.result.code === 0 && result.result.data && result.result.data.length) {
        let hour = result.result.data[0].workHour;
        let minute = result.result.data[0].workMinute;
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

    let offDutyTime = new Date(timeStr)

    let data = {
      openId: app.globalData.openid,
      endTime: offDutyTime.getTime(),
      originEndTime: this.data.endTime
    }

    updateOffDuty(data).then((result) => {
      console.log("updateOffDuty success:", result)
      if (result.result.code !== 0) {
        app.showToast('请求失败!')
      } else {
        //更新数据
        this.getWorkHour(offDutyTime.getTime())
      }
      wx.hideLoading();
    }).catch((err) => {
      wx.hideLoading();
      console.error('[云函数] [updateOffDuty] 调用失败', err)
    });
  },

  timePickerOnCancelClick: function (e) {
    this.setData({
      datePickerIsShow: false,
    });
  }
})