// miniprogram/pages/work/workContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ingredients: [{}],
    history:[
      "猫", "APP", "小游戏", "哈哈", "eweqw", "321321", "eqwewqe", "321323"
    ],
    value: "",
    isShowInput: false,
    bottom: 0,
    totalTime: "17小时28分钟"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  ingredientInput(e) {
    let words = e.detail.value;
    let { ingredients } = this.data;
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
        console.log("value1", val);
        console.log("index", index);
        console.log("key", key);
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

      this.data.ingredients.forEach(function(val, index, arr){
        console.log("value2", val);
      });
    }
  },

  startWorking() {
    wx.navigateTo({
      url: '/pages/work/workTime/workTime'
    });
  }
})