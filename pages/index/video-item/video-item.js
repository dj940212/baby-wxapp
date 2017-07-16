Page({
	data: {
		videoWidth: 125,
		videoHeight: 200
	},
	onLoad: function() {
		console.log('video-item')
		var that = this;
		wx.getSystemInfo({
			success: function(res) {
				var windowWidth = res.windowWidth;
				var videoHeight = (225/300)*windowWidth;
				// that.setData({
				// 	videoWidth: windowWidth,
				// 	videoHeight: videoHeight
				// })
			}
			
		})
	}
});