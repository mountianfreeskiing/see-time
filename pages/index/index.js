//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: [1,2,3,4,5,6]
  },
  onLoad: function () {
    
  },

  navigatView: function (e) {
    const index = e.currentTarget.dataset.index;
    app.showToast(index);
    console.log(index);
    switch (index) {
      case 0:
        wx.navigateTo({ url: '/pages/sleep/sleep' });
      break;
      case 1:
        wx.navigateTo({ url: '/pages/food/food' });
        break;
      default:
      break;
    }
  }

})
