function request(name, url, data = {}) {
  return new Promise((resolve, reject) => {
    data.$url = url
    wx.cloud.callFunction({
      name: name,
      data,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

export { request };
