// pages/sleepCounter/sleepCounter.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    datePickerValue: ['', '', ''],
    datePickerIsShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  closePage() {
    wx.navigateBack({
      delta: 1
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
      date: `${e.detail.value[0]}${e.detail.value[1]}`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
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