// pages/food/food.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ingredients: [{}],
    value: "",
    isShowInput: false,
    bottom: 0
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
  }
})