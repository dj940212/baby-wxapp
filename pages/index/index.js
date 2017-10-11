var upload = require("../../utils/uploader")
var util = require("../../utils/util.js")
var config = require("../config.js")
var app = getApp()
Page({
  data: {
    photoVideoList: [],
    position:{},
    addVlue: false,
    nowAge: "",
    contentValue: true,
    loadingValue: true,
    boLoadingValue: true,
    pubtime: "",
    showVideo: false,
    modalValue: true,
    toastValue: true,
    currentId: "",
  },
  //事件处理函数
  onLoad: function () {
    var _this = this
    // 保存this
    app.saveIndexThis(this)
    this.setData({
      nowAge: util.calAge(config.birthday),
      contentValue: true,
      loadingValue: true,
      boLoadingValue: true,
      addVlue: false,
      modalValue: true,
      toastValue: true,
      currentId: ""
    })

    app.getPhotoVideo(6,0,function(){
      _this.setData({
        photoVideoList: app.photoVideoList
      })
      wx.stopPullDownRefresh()
    })

  },
  onPageScroll: function() {
    this.setData({
      addVlue : false
    })
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    this.onLoad()
  },
  // 上拉加载
  onReachBottom: function() {
    var _this = this
    var list = this.data.photoVideoList
    var skipNum = list.length
    
    
    app.getPhotoVideo(4,skipNum,function(){
      _this.setData({
        photoVideoList: _this.data.photoVideoList.concat(app.photoVideoList)
      })
      if (!app.photoVideoList.length) {
        _this.setData({
          boLoadingValue: false
        })
      }
    })
  },
  // 分享
  onShareAppMessage :function() {
    return {
      title: "田京墨的时光小屋",
      success: function(res){
        console.log("转发成功")
      }
    }
  },
  palyVideo: function(e) {
    var id = 'video_'+ e.target.dataset.index
    console.log(id,e)
    this.setData({currentId: e.target.dataset.id})
    this.videoContext = wx.createVideoContext(id)
    this.videoContext.play()
  },
  endedHandle: function() {
    this.setData({currentId: ''})
  },
  // 选择照片
  didPressChooesImage:function() {
    var that = this
    app.checkAuth(function(){
      wx.chooseImage({
        success: function (res) {
          var filePath = res.tempFilePaths;
          // 跳转到编辑页
          app.addPhotoPage(filePath)
        }
      })
    })
  },
  // 选择视频
  didPressChooesVideo:function() {
    var that = this
    app.checkAuth(function(){
      wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 20,
        camera: 'back',
        success: function(res) {
          var filePath = res.tempFilePath;
          console.log(filePath)
          // 跳转到编辑页
          app.addVideoPage(filePath)
        }
      })
    })
  },
  // 删除文件
  deletePhotoOrVideo: function(e){
    var _this = this
    app.checkAuth(function(){
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
      var arr = _this.data.photoVideoList
      console.log("arr1",arr)
      arr.splice(index,1)
      console.log("arr2",arr)
      _this.setData({
        photoVideoList:arr
      })
    })
  },
  // 跳转到photoDetail页
  toPhotoDetail: function(e){
    getApp().doToPhotoDetail(e)
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
          // that.deletePhotoOrVideo(e)
          console.log("关闭删除")
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  toastChange: function() {
    wx.showToast({})
  },
  
  showAddItem:function() {
    this.setData({
      addVlue : !this.data.addVlue
    })
    
  },
  hideContent: function(e){
    this.setData({
      contentValue: false
    })
    console.log("play",e)
  },
  showContent: function(){
    this.setData({
      contentValue: true
    })
  },
  modalChange: function(e){
    console.log(e)
    this.setData({
      modalValue: true
    })
  },
  clearStorage:function(){
    wx.clearStorageSync()
    console.log("清楚本地数据")
  },
  modalCancel: function() {
    this.setData({
      modalValue2: true
    })
  }
});










