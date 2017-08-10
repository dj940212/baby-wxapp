var config = require('../pages/config')
var util = require('./util')
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

            // loading
            data.app.index_this.setData({
              loadingValue: true
            })

            // 修改data值
            var list = data.that.data.photoVideoList;
            list.unshift({
              photoVideoUrl:photoArr,
              type:data.type,
              content:data.content,
              meta: {createAt: util.formatTime(new Date())}
            })

            data.that.setData({
              photoVideoList: list
            })
            data.app.photoVideoList = list
            
            dataObject.photoVideoUrl = photoArr
            dataObject.content = data.content
            dataObject.app = data.app
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
    // var fileName = data.filePath.split('//')[1];
    var videoInfo = {}
    var photoVideoUrl = ''
    wx.uploadFile({
        url: url,
        filePath: data.filePath,
        name: 'file',
        formData: {
          'token': data.uptoken,
          'key': data.key
        },
        success: function (res) {
          console.log(res)
          videoInfo = JSON.parse(res.data);
          photoVideoUrl = data.config.domain +'/'+ videoInfo.key;
          videoInfo.photoVideoUrl = photoVideoUrl
          videoInfo.thumbnailUrl = config.domain +'/'+ data.thumbKey
          videoInfo.content = data.content
          videoInfo.app = data.app

          var list = data.that.data.photoVideoList
          list.unshift({
            photoVideoUrl:photoVideoUrl,
            type:data.type,
            content:data.content,
            thumbnailUrl:videoInfo.thumbnailUrl,
            meta: {createAt: util.formatTime(new Date())}
          })
          data.that.setData({
            photoVideoList: list
          })
          // 保存视频信息
          savePhotoVideoInfo(videoInfo,data.type,data.config)
        },
        fail: function (err) {
          console.log("上传失败");
          data.app.index_this.setData({
            loadingValue: true
          })
        },
        complete: function() {
          // data.app.index_this.setData({
          //   loadingValue: true
          // })
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
      var resData = res.data.data;
      console.log(resData)
      callback && callback(resData)
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
      // 更新链接数组
      photoVideoInfo.app.getPhotoVideo(6,0)
      // loading
      photoVideoInfo.app.index_this.setData({
        loadingValue: true
      })
    },
    fail: function (error) {
      console.log(error);
      // loading
      photoVideoInfo.app.index_this.setData({
        loadingValue: true
      })
    }
  })
}
module.exports.uploadPhoto = uploadPhoto;
module.exports.uploadVideo = uploadVideo;
module.exports.getQiniuToken = getQiniuToken;

