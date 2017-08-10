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
  getPhotoVideo: function (count, skipNum, callback){
    var _this = this
    wx.request({
      url: config.getPhotoVideoUrl,
      method: 'GET',
      data: {
        accessToken: config.accessToken,
        count: count && count,
        skipNum: skipNum && skipNum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("获取照片和视频车成功",res.data.data)
        _this.photoVideoList = res.data.data
        callback && callback()
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
    console.log("详情页index",this.photoVideoIndex)
  },
  // 跳转到addPhotoPage页
  addPhotoPage: function(filePath){
    wx.login({
      success: function (res) {
        console.log(res)
      }
    })

    wx.navigateTo({
      url: './addPhotoPage/addPhotoPage'
    })
    this.photoFilePath = filePath
  },
  // 跳转到addVideoPage页
  addVideoPage: function(filePath){
    wx.navigateTo({
      url: './addVideoPage/addVideoPage'
    })
    this.videoFilePath = filePath
  },
  saveIndexThis : function(_this){
    this.index_this = _this
  },
  globalData:{
    userInfo:null
  },
  photoVideoList: [],
  photoVideoIndex: null,
  photoFilePath:{},
  videoFilePath:{},
  test: 123,
  index_this:{}

})



