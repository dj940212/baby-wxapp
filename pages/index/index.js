var upload = require("../../utils/uploader")
var config = require("../config.js")
var app = getApp()
Page({
  data: {
    photoVideoList: [],
    selectBoxValue: false,
    position:{}
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad',this)
    var that = this;
    app.getPhotoVideo(that);
    this.setData({photoVideoList: app.photoVideoList})
  },
  // 选择照片
  didPressChooesImage:function() {
    // 微信 API 选文件
    var that = this
    wx.chooseImage({
      // count: 2,
      success: function (res) {
        var filePath = res.tempFilePaths;
        console.log("选择文件",res)
        // 获取七牛签名
        getQiniuToken("photo",function(uptoken) {
          var uploadOptions = {
            filePath:filePath,
            type:"photo",
            uptoken:uptoken,
            config:config,
            that:that,
            app:app,
            photoArr: []
          }
          upload.uploadPhoto(uploadOptions)
        })
      }
    })
  },
  // 选择视频
  didPressChooesVideo:function() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        var filePath = res.tempFilePath;
        console.log(filePath)
        // 获取七牛签名
        getQiniuToken("video",function(uptoken) {
          var uploadOptions = {
            filePath:filePath,
            type:"video",
            uptoken:uptoken,
            config:config,
            that:that
          }
          upload.uploadVideo(uploadOptions)
        })
      }
    })
  },
  // 删除文件
  deletePhotoOrVideo: function(e){
    var _this = this
    console.log(e.currentTarget.dataset.index)
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log("id",id)
    console.log("index",index)

    wx.request({
      url: config.deletePhotoOrVideoUrl,
      method: 'POST',
      data: {
        accessToken: config.accessToken,
        id:id
      },
      success: function(res) {
        console.log("删除成功")
      }
    })
    var arr = this.data.photoVideoList
    console.log("arr1",arr)
    arr.splice(index,1)
    console.log("arr2",arr)
    this.setData({
      photoVideoList:arr
    })
  },
  // 跳转到photoDetail页
  toPhotoDetail: function(e){
    getApp().doToPhotoDetail(e)
  },
  selectBox: function(e) {
    console.log(e.currentTarget)
    this.setData({
      position:{left: e.currentTarget.offsetLeft,top:e.currentTarget.offsetTop},
      selectBoxValue: true
    })
  }
});

// 获取七牛签名
function getQiniuToken(type,callback) {
  wx.request({
    url: config.uptokenURL,
    method: 'POST',
    data: {
        type: type,
        accessToken: config.accessToken
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      var uptoken = res.data.data.uptoken;;
      callback && callback(uptoken)
      console.log("成功获取七牛签名uptoken:"+type)
    },
    fail: function (error) {
      console.log(error);
    }
  })
}








