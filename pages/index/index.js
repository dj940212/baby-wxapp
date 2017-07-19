var upload = require("../../utils/uploader")
var config = require("../config.js")

Page({
  data: {
    photoVideoList: [],
    selectBoxValue: false,
    position:{}
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
            that:that
          }
          upload(uploadOptions)
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
          upload(filePath, "video", uptoken, config,that, function(photoVideoUrl,that){
            var list = that.data.photoVideoList;
            list.push({photoVideoUrl:photoVideoUrl,type:"video"})
            that.setData({
              photoVideoList: list
            })
          })
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
  selectBox: function(e) {
    console.log(e.currentTarget)
    this.setData({
      position:{left: e.currentTarget.offsetLeft,top:e.currentTarget.offsetTop},
      selectBoxValue: true
    })
  }
});

// 获取照片视频列表
function getPhotoVideo(that) {
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
      console.log("成功获取七牛签名uptoken:"+type)
    },
    fail: function (error) {
      console.log(error);
    }
  })
}








