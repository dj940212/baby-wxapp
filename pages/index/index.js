const qiniuUploader = require("../../utils/qiniuUploader");

//获取应用实例
var app = getApp()

Page({
  data: {
    imageObject: {},
    photoVideoList: [],
    videoWidth: 225,
    videoHeight: 300
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    getPhotoVideo(that);

    wx.getSystemInfo({
      success: function(res) {
        var windowWidth = res.windowWidth;
        var videoHeight = (225/300)*windowWidth;

        console.log("....video-item",res.windowWidth)
        that.setData({
         videoWidth: windowWidth,
         videoHeight: videoHeight
        })
      }
    })
  },
  // 选择照片
  didPressChooesImage:function() {
    initQiniu();
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
              // 交给七牛上传
              qiniuUploader.upload(filePath, "photo",(res) => {
                console.log("上传成功",res)
              },(error) => {
                console.error('error: ' + JSON.stringify(error));
              });
            }
          })
          
        }
      }
    )
  },
  // 选择视频
  didPressChooesVideo:function() {
    initQiniu();
    // 微信 API 选视频文件
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: function(res) {
        // 交给七牛上传
        var filePath = res.tempFilePath;
        console.log(filePath)
        qiniuUploader.upload(filePath, "video", (res) => {

        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });
      }
    })
  }
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

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'SCN', // 华南区
    uptokenURL: 'http://localhost:1234/api/signature',
    domain: 'http://ot2nmqx5r.bkt.clouddn.com'
  };
  qiniuUploader.init(options);
}





