// 上传文件
var upload = function(filePath, type, uptoken,options,that, callback) {
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

            callback && callback(photoVideoUrl,that)

            dataObject.photoVideoUrl = photoVideoUrl
            dataObject.thumbnailUrl = dataObject.hash ? options.domain+'/Q9GLAFFqfCrYF6YfQAcON4w4Ezs=/'+dataObject.hash :''
            // 保存视频照片信息
            savePhotoVideoInfo(dataObject,type,options)
            // console.log("视频照片信息",dataObject)
            console.log(res)
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
        accessToken: options.accessToken,
        width: photoVideoInfo.width,
        height: photoVideoInfo.height
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log('保存'+type+'到数据库成功')
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

function getWidthHeight(photoVideoInfo, type, options,callback) {
  wx.request({
    url: type === "video" ? photoVideoInfo.photoVideoUrl+'?avinfo': photoVideoInfo.photoVideoUrl+'?imageInfo',
    method: 'GET',
    data: {},
    success: function(res) {
      if (type === "video") {
        var startWidth = res.data.streams[0].width
        var startHeight = res.data.streams[0].height
        var data = calWidthHeight(150000, startWidth ,startHeight)
        photoVideoInfo.width =  data.endWidth
        photoVideoInfo.height = data.endHeight
        
        console.log("视屏信息:",photoVideoInfo.width, photoVideoInfo.height)
      }else{
        var startWidth = res.data.width
        var startHeight = res.data.height
        var data = calWidthHeight(150000, startWidth ,startHeight)
        photoVideoInfo.width =  data.endWidth
        photoVideoInfo.height = data.endHeight

        console.log("图片信息:",photoVideoInfo.width,photoVideoInfo.height)
      }
      callback && callback()
    }
  })
}

function calWidthHeight(endArea,startWidth,startHeight) {
  var  startArea = startWidth * startHeight
  var index = endArea/startArea
  var endWidth = Math.sqrt(index) * startWidth
  var endHeight = Math.sqrt(index) * startHeight
  return {
    endWidth: Math.round(endWidth),
    endHeight: Math.round(endHeight)
  }
}

module.exports = upload;

