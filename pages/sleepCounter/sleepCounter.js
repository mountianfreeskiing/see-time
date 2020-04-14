// pages/sleepCounter/sleepCounter.js
import { DatePicker } from '../../utils/datePicker';
const params = {
  dateArr:['今天','明天','后天']
}
const datePicker = new DatePicker(params);
const dateArr = datePicker.datePicker();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dateArray: null,//picker-rang的值
    dateIndex:null,//picker-value的值
    dateVal:null,//显示的时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.set_date();
  },

  //监听点击日期组件的事件变化
  datePickerChange(e) {
    let dateIndex = e.detail.value;
    this.setData({
      dateIndex,
      dateVal: datePicker.toDate(dateArr.dateAll, dateIndex),
    })
  },

  set_date() {
    this.setData({
      dateArray: dateArr.dateAll,
      dateIndex: dateArr.currentDateArr,
      dateVal: datePicker.toDate(dateArr.dateAll,dateArr.currentDateArr)
    }) 
  }
})