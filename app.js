var config = require("./pages/config.js")
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  // 获取照片视频列表
  getPhotoVideo: function (that){
    var _this = this
    wx.request({
      url: config.getPhotoVideoUrl,
      method: 'GET',
      data: {
        accessToken: config.accessToken
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("获取照片和视频车成功",res.data.data)
        _this.photoVideoList = res.data.data
       
        that.setData({
          photoVideoList: res.data.data
        });
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  // 跳转到photo-detail页
  doToPhotoDetail: function(e) {
    wx.navigateTo({
      url: './photo-detail/photo-detail'
    })
    this.photoVideoIndex = e.currentTarget.dataset.index
  },
  globalData:{
    userInfo:null
  },
  photoVideoList: [],
  photoVideoIndex: null

})



