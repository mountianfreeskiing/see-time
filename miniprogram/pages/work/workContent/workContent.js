// miniprogram/pages/work/workContent.js
import * as api from "../../../utils/api.js";

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ingredients: [{}],
    history:[],
    value: "",
    isShowInput: false,
    bottom: 0,
    totalTime: "0小时0分钟"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistoryWorkContent();
    this.getTodayWorkHour();
  },

  getHistoryWorkContent() {
    const data = {
      openId: app.globalData.openid,
    }
    let { history } = this.data;
    api.findCommonWorkContent(data).then((result) => {
      console.log("findCommonWorkContent success:", result);
      if (result.result.code === 0) {
        const data = result.result.data;
        if (data && data.length) {
          for (const item of data) {
            history.push(item.content)
          }
          this.setData({history: history});
        }
      }
    }).catch((err) => {
      console.error('[云函数] [findCommonWorkContent] 调用失败', err)
    });
  },

  getTodayWorkHour() {
    const now = new Date().getTime();
    const date = new Date(now);
    const dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const data = {
      openId: app.globalData.openid,
      date: dateString
    }
    api.findTodayWorkHour(data).then((result) => {
      console.log("findTodayWorkHour success:", result);
      if (result.result.code === 0) {
        const data = result.result.data;
        if (data && data.length) {
          const h = data[0].workHour;
          const m = data[0].workMinute;
          this.setData({
            totalTime: `${h}小时${m}分钟`
          })
        }
      }
    }).catch((err) => {
      console.error('[云函数] [findTodayWorkHour] 调用失败', err)
    });
  },

  ingredientInput(e) {
    let words = e.detail.value;
    let { ingredients } = this.data;
    if (ingredients && ingredients.length > 1) {
      app.showToast('一次只能执行一个工作哟~')
      return;
    }
    if (words.length > 0 && words.charCodeAt(0) !== 32 && words.charCodeAt(0) !== 10 &&
      (words.charCodeAt(words.length - 1) === 32 || words.charCodeAt(words.length - 1) === 10)) {
      words = words.replace(" ", "");
      ingredients.push({
        words: words,
        isSelected: false
      });
      this.setData({
        ingredients: ingredients,
        value: ""
      })
    } else {
      words = words.replace(" ", "");
      this.setData({
        value: words
      })
    }
  },

  showInput() {
    this.setData({
      isShowInput: true
    });
  },

  addItem(e) {
    let text = e.currentTarget.dataset.text;
    console.log(text)
    let { ingredients } = this.data;
    text = text.replace(" ", "");
    ingredients.push({
      words: text,
      isSelected: false
    });
    this.setData({
      ingredients: ingredients
    })
  },

  deleteItem: function(e) {
    const key = e.currentTarget.dataset.key;
    let ingredients = this.data.ingredients
    ingredients.splice(key, 1)

    this.setData({ ingredients: ingredients })
  },

  //输入聚焦
  onFoucus: function (e) {
    const that = this;

    that.setData({
      bottom: e.detail.height
    })

  },

  //失去聚焦
  onBlur: function (e) {
    const that = this;

    that.setData({
      bottom: 0,
      isShowInput: false
    })
  },

  onContentClick: function(e) {
    const that = this;
    let key = e.currentTarget.dataset.key;
    if (key >= 1) {
      this.data.ingredients.forEach(function(val, index, arr){
        let isSelected = "ingredients["+index+"].isSelected";
        if (index === key) {
          that.setData({
            [isSelected]: true
          })
        } else {
          that.setData({
            [isSelected]: false
          })
        }
      });
    }
  },

  startWorking() {
    let content = [];
    this.data.ingredients.forEach(function(val, index, arr){
      if (val.words !== undefined && val.words !== null && val.words !== '') {
        content.push(val.words)
      }
    });


    if (content.length === 0) {
      app.showToast('工作内容不能为空哟~')
      return
    }

    if (this.data.ingredients && this.data.ingredients.length) {
      const now = new Date();
      const data = {
        openId: app.globalData.openid,
        startTime: now.getTime(),
        content: content[0]
      }

      wx.showLoading({
        title: '请稍后...',
        mask: true
      });
  
      api.startWorking(data).then((result) => {
        console.log("startWorking success:", result);
        if (result.result.code === 0) {
          wx.redirectTo({ url: '/pages/work/workTime/workTime' });
        } else {
          app.showToast('数据异常');
        }
        wx.hideLoading();
      }).catch((err) => {
        wx.hideLoading();
        console.error('[云函数] [startWorking] 调用失败', err)
      });
    } else {
      app.showToast('请填写工作内容~')
    }
  }
})