var app = getApp()
var config = require('../../config')
var upload = require('../../../utils/uploader')

Page({
  data: {
    content:""
  },
  onLoad:function(){
    this.setData({
      imageList: app.photoFilePath
    })
  },
  // 选择照片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 9,
      sourceType: 'album',
      sizeType: 'compressed',
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
        
      }
    })
  },
  // 照片预览
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 发布照片
  publishPhoto: function() {
    var _this = this
    console.log("publishPhoto",this.data.content)
    upload.getQiniuToken("photo",function(resData){
      var uploadOptions = {
        filePath:_this.data.imageList,
        type:"photo",
        uptoken:resData.uptoken,
        key:resData.key,
        config:config,
        that:app.index_this,
        app:app,
        photoArr: [],
        content:_this.data.content
      }
      upload.uploadPhoto(uploadOptions)
    })
    wx.navigateBack({
      url: '../index'
    })
  },
  // 获取文字类容
  getContent: function(e) {
    this.setData({ content: e.detail.value})
  }
})
