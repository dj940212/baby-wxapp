var upload = require("../../utils/uploader")
var config = require("../config.js")

Page({
  data: {
    photoVideoList: []
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    getPhotoVideo(that);
  },
  // 选择照片
  didPressChooesImage:function() {
    // 微信 API 选文件
    wx.chooseImage({
        count: 1,
        success: function (res) {
          var filePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
              console.log("res.width",res.width)
              console.log("res.height",res.height)
              // 获取七牛签名
              getQiniuToken("photo",function(uptoken) {
                upload(filePath, "photo", uptoken, config)
              })
            }
          })
        }
      }
    )
  },
  // 选择视频
  didPressChooesVideo:function() {
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        var filePath = res.tempFilePath;
        console.log(filePath)
        // 获取七牛签名
        getQiniuToken("video",function(uptoken) {
          //上传七牛
          upload(filePath, "video", uptoken, config)
        })
      }
    })
  },
});

// 获取照片视频列表
function getPhotoVideo(that) {
  wx.request({
    url: 'http://localhost:1234/api/photoVideo/list',
    method: 'GET',
    data: {
      accessToken: '489cc410-13a9-4a0a-a73d-33fb0f2e3a6e'
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log("获取照片和视频车成功")
      console.log(res.data.data)
      that.setData({
        photoVideoList: res.data.data
      });
    },
    fail: function (error) {
      console.log(error);
    }
  })
}
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
      console.log("成功获取七牛签名uptoken:"+type+':'+uptoken)
    },
    fail: function (error) {
      console.log(error);
    }
  })
}








