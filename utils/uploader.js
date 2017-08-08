var config = require('../pages/config')
// 上传照片
function uploadPhoto(data) {
    var i=data.i ? data.i:0
    var success=data.success?data.success:0
    var fail=data.fail?data.fail:0
    var photoArr = data.photoArr ? data.photoArr:0
    // 区域上传地址
    var url = data.config.region;
    var fileName = data.filePath[i].split('//')[1];
    var dataObject = {}
    wx.uploadFile({
        url: url,
        filePath: data.filePath[i],
        name: 'file',
        formData: {
          'token': data.uptoken,
          'key': fileName
        },
        success: function (res) {
            dataObject = JSON.parse(res.data);
            var photoVideoUrl = data.config.domain +'/'+ dataObject.key;
            photoArr.push(photoVideoUrl)
            success++;
            console.log("上传七牛成功",i,res)
        },
        fail: function (error) {
            fail++;
            console.log('fail:'+i+"fail:"+fail);
        },
        complete: function() {
          console.log(i);
          i++;
          if(i==data.filePath.length){  //当图片传完时，停止调用     
            console.log('执行完毕');
            console.log('成功：'+success+" 失败："+fail);

            // 修改data值
            var list = data.that.data.photoVideoList;
            list.push({photoVideoUrl:photoArr,type:data.type})
            data.that.setData({
              photoVideoList: list
            })
            data.app.photoVideoList = list
            
            dataObject.photoVideoUrl = photoArr
            dataObject.content = data.content
            // 保存信息
            savePhotoVideoInfo(dataObject,data.type,data.config)
          }else{//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i=i;
            data.success=success;
            data.fail=fail;
            // 迭代
            uploadPhoto(data);
          }
        }
    })
}
// 上传视频
function uploadVideo(data) {
    // 区域上传地址
    var url = data.config.region;
    var fileName = data.filePath.split('//')[1];
    var videoInfo = {}
    var photoVideoUrl = ''
    wx.uploadFile({
        url: url,
        filePath: data.filePath,
        name: 'file',
        formData: {
          'token': data.uptoken,
          'key': fileName
        },
        success: function (res) {
          videoInfo = JSON.parse(res.data);
          photoVideoUrl = data.config.domain +'/'+ videoInfo.key;
          videoInfo.photoVideoUrl = photoVideoUrl
          videoInfo.thumbnailUrl = videoInfo.hash ? data.config.domain+'/Q9GLAFFqfCrYF6YfQAcON4w4Ezs=/'+videoInfo.hash :''
          var list = data.that.data.photoVideoList;
          list.push({photoVideoUrl:photoVideoUrl,type:data.type})
          data.that.setData({
            photoVideoList: list
          })
          // 保存视频信息
          savePhotoVideoInfo(videoInfo,data.type,data.config)
        },
        fail: function (error) {
            console.log("上传失败",err);
        },
        complete: function() {
        }
    })
}
// 获取七牛签名
function getQiniuToken(type,callback) {
  wx.request({
    url: config.uptokenURL,
    method: 'POST',
    data: {
        type: type,
        accessToken: config.accessToken
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      var uptoken = res.data.data.uptoken;;
      callback && callback(uptoken)
      console.log("成功获取七牛签名uptoken:"+type)
    },
    fail: function (error) {
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
        content: photoVideoInfo.content,
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
        photoVideoInfo.width = res.data.streams[0].width
        photoVideoInfo.height = res.data.streams[0].height
        
        console.log("视屏信息:",photoVideoInfo.width, photoVideoInfo.height)
      }else{
        photoVideoInfo.width = res.data.width
        photoVideoInfo.height = res.data.height

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

module.exports.uploadPhoto = uploadPhoto;
module.exports.uploadVideo = uploadVideo;
module.exports.getQiniuToken = getQiniuToken;

