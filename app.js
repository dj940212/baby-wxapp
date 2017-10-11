var config = require("./pages/config.js")
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 登录
  getLogin:function(){
    var that = this
      //调用登录接口
      wx.login({
        success: function (response) {
          that.globalData.jscode = response.code
          console.log(response.code)
          wx.getUserInfo({
            success: function (res) {
              that.globalData.nickName = res.userInfo.nickName;
              wx.setStorageSync("nickName", res.userInfo.nickName)
              console.log(res.userInfo.nickName)

              wx.request({
                url: config.getOpenidUrl,
                method: "POST",
                data: {
                  jscode: that.globalData.jscode,
                  nickName: that.globalData.nickName
                },
                success: function(res){
                  console.log(res.data)
                  wx.setStorageSync("openid", res.data.openid)

                  console.log("登录成功")
                }
              })
            }
          })
        }
      });
  },
  // 检查权限
  checkAuth: function(cb){
    // 微信 API 选文件
    var that = this
    var lcoalOpenid = wx.getStorageSync("openid")
    if (lcoalOpenid) {
      console.log("本地有openid")
      wx.request({
        url: config.getAuthorizationUrl,
        method: "POST",
        data: {
          openid: lcoalOpenid
        },
        success: function(res){
          if (res.data.errNum) {
            cb && cb()
          }else{
            console.log(res.data.msg)
            that.index_this.setData({
              modalValue : false
            }) 
          }
          
        }
      })
      
    }else{
      console.log("没找到openid,请登录")
      this.getLogin()
    }
  },
  // 获取照片视频列表
  getPhotoVideo: function (count, skipNum, callback){
    var _this = this
    wx.request({
      url: config.getPhotoVideoUrl,
      method: 'GET',
      data: {
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
    nickName:null,
    jscode:""
  },
  photoVideoList: [],
  photoVideoIndex: null,
  photoFilePath:{},
  videoFilePath:{},
  test: 123,
  index_this:{},
  relative: {
    "Promise": "小舅",
    "佳佳":"妈妈",
    "无心": "爸爸",
    "丁丁": "小姨",
    "晓川": "外婆",
    "丁学贵": "姥爷"
  }

})



