// 上传文件
var upload = function(filePath, type, uptoken,options) {
    console.log("options",options)
    // 区域上传地址
    var url = options.region;
    var fileName = filePath.split('//')[1];
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        formData: {
          'token': uptoken,
          'key': fileName
        },
        success: function (res) {
            var dataObject = JSON.parse(res.data);
            var photoVideoUrl = options.domain +'/'+ dataObject.key;
            dataObject.photoVideoUrl = photoVideoUrl
            dataObject.thumbnailUrl = dataObject.hash ? 'http://ot2nmqx5r.bkt.clouddn.com/Q9GLAFFqfCrYF6YfQAcON4w4Ezs=/'+dataObject.hash :''
            // 保存视频照片信息
            savePhotoVideoInfo(dataObject,type,options)
            console.log("视频照片信息",dataObject)
        },fail: function (error) {
            console.log(error);
        }
    })
}
// 保存照片视屏信息到数据库
function savePhotoVideoInfo(photoVideoInfo,type,options){
  wx.request({
    url: options.savePhotoVideoInfoUrl,
    method: 'POST',
    data: {
        photoVideoUrl: photoVideoInfo.photoVideoUrl,
        type: type,
        thumbnailUrl: photoVideoInfo.thumbnailUrl,
        accessToken: options.accessToken
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log('保存'+type+'到数据库成功',res)
      getWidthHeight(photoVideoInfo, type, options)
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

function getWidthHeight(photoVideoInfo, type, options) {
  wx.request({
    url: type === "video" ? photoVideoInfo.photoVideoUrl+'?avinfo': photoVideoInfo.photoVideoUrl+'?imageInfo',
    method: 'GET',
    data: {},
    success: function(res) {
      if (type === "video") {
        photoVideoInfo.width = res.data.streams[0].width
        photoVideoInfo.height = res.data.streams[0].height
        console.log(res)
        console.log("视屏信息:",photoVideoInfo.width, photoVideoInfo.height)
      }else{
        photoVideoInfo.width = res.data.width
        photoVideoInfo.height = res.data.height
        console.log(res)
        console.log("图片信息:",photoVideoInfo.width,photoVideoInfo.height)
      }
      

    }
  })
}


module.exports = upload;

