var app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 200,
    swiperHeight:null
  },
  onLoad: function() {
    this.setData({
      imgUrls: app.photoVideoList[app.photoVideoIndex].photoVideoUrl
    })
    console.log(this.data.imgUrls)
    this.getSwiperHeight()
  },
  getSwiperHeight: function() {
    var _this = this
    wx.getSystemInfo({  
      success: function (res) {  
        var windowWidth = res.windowWidth;  
        var windowHeight = res.windowHeight;  
        _this.setData({
          swiperHeight: windowHeight
        })
        console.log('windowWidth: ' + windowWidth)  
        console.log('windowHeight: ' + windowHeight)  

      }  
    })  
  },
  // 跳转到photo-detail页
  back: function() {
    wx.navigateBack({
      url: '../index'
    })
    // this.photoVideoIndex = e.currentTarget.dataset.index
  },
})
