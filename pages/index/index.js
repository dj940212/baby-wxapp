var upload = require("../../utils/uploader")
var util = require("../../utils/util.js")
var config = require("../config.js")
var app = getApp()
Page({
  data: {
    photoVideoList: [],
    selectBoxValue: false,
    position:{},
    addVlue: false,
    nowAge: ""
  },
  //事件处理函数
  onLoad: function () {
    var _this = this
    // 保存this
    app.saveIndexThis(this)
    this.setData({
      nowAge: util.calAge(config.birthday)
    })

    app.getPhotoVideo(function(){
      _this.setData({
        photoVideoList: app.photoVideoList
      })
      wx.stopPullDownRefresh()
    })

    
    
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  onPageScroll: function() {
    // console.log("....")
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    this.onLoad()
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
        // 跳转到编辑页
        app.addPhotoPage(filePath)
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
        upload.getQiniuToken("video",function(uptoken) {
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
    // getApp().doToPhotoDetail(e)
  },
  // 选项弹窗
  selectBox: function(e) {
    var that = this
    console.log(e.currentTarget)
    console.log(e.currentTarget.offsetLeft,e.currentTarget.offsetTop)
    
    wx.showActionSheet({
      itemList: ['删除', '保存'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex===0) {
          that.deletePhotoOrVideo(e)
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  showAddItem:function() {
    this.setData({
      addVlue : !this.data.addVlue
    })
  },
  showAdd: function(e){
    // console.log("touches",e.touches)
  },
  fullScreen:function(){
    // this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.requestFullScreen({})
  }

});










