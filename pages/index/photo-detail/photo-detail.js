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
      // imgUrls:[
      //   "http://ot2nmqx5r.bkt.clouddn.com/tmp_1984021442o6zAJs0qJDggmNsKmIogeSi9wsLQfa63f01a62200b0d1e1e997a3131d150.jpg",
      //   "http://ot2nmqx5r.bkt.clouddn.com/tmp_1984021442o6zAJs0qJDggmNsKmIogeSi9wsLQ344821469d09a50e999e37741dd9ae9b.jpg",
      //   "http://ot2nmqx5r.bkt.clouddn.com/tmp_1984021442o6zAJs0qJDggmNsKmIogeSi9wsLQ5afc0d0cdc1158b7ba679061d0055b9a.jpg",
      //   "http://ot2nmqx5r.bkt.clouddn.com/tmp_1984021442o6zAJs0qJDggmNsKmIogeSi9wsLQ3653d01e315e2ca186d8d933b22bead6.jpeg"
      // ]
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
    wx.navigateTo({
      url: '../index'
    })
    // this.photoVideoIndex = e.currentTarget.dataset.index
  },
})
