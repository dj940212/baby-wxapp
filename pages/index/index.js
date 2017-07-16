const qiniuUploader = require("../../utils/qiniuUploader");

//获取应用实例
var app = getApp()

Page({
  data: {
    imageObject: {},
    photoVideoList: [],
    videoSrc: ''
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    getPhotoVideo(that)
  },
  didPressChooesImage: function() {
    var that = this;
    didPressChooesImage(that);
  },
  didPressChooesVideo: function() {
    var that = this;
    didPressChooesVideo(that);
  },
});

// 获取照片视频列表
function getPhotoVideo(that) {
  wx.request({
    url: 'http://localhost:1234/api/photoVideo/list',
    method: 'GET',
    data: {
      accessToken: '8591137c-ff1c-4565-bf1f-19a540acde1b'
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

// 选择照片
function didPressChooesImage(that) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, "photo",(res) => {
          that.setData({
            imageObject: res
          });
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });
      }
    }
    )
}

// 选择视频
function didPressChooesVideo(that) {
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
        that.setData({
          videoSrc: filePath
        });
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      });
    }
  })
}

