var app = getApp()
var config = require('../../config')
var upload = require('../../../utils/uploader')

Page({
    data:{
        content: "",
        // thumbnailUrl: "http://baby.dingjian.name/0ab901af-ab0b-41bd-9ebe-6f55347e7fab.mp4.jpeg",
    },
    onLoad: function() {

    },
    // 获取文字类容
    getContent: function(e) {
        this.setData({ content: e.detail.value})
    },

    // 发布照片
    publishVideo: function() {
        var _this = this
        console.log("publishVideo",this.data.content)
        app.index_this.setData({
            loadingValue: false
        })
        upload.getQiniuToken("video",function(resData){
          var uploadOptions = {
            filePath: app.videoFilePath,
            type:"video",
            uptoken:resData.uptoken,
            key:resData.key,
            config:config,
            that:app.index_this,
            thumbKey: resData.thumbKey,
            app:app,
            content:_this.data.content
          }
          upload.uploadVideo(uploadOptions)
        })
        wx.navigateBack({
          url: '../index'
        })

    }
})