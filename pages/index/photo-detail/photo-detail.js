var app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 200
  },
  onLoad: function() {
    this.setData({
      imgUrls: app.photoVideoList[app.photoVideoIndex].photoVideoUrl
    })
  }
})
