// 上传文件
function upload(data) {
    var i=data.i ? data.i:0
    var success=data.success?data.success:0
    var fail=data.fail?data.fail:0
    // 区域上传地址
    var url = data.config.region;
    var fileName = data.filePath[i].split('//')[1];
    wx.uploadFile({
        url: url,
        filePath: data.filePath[i],
        name: 'file',
        formData: {
          'token': data.uptoken,
          'key': fileName
        },
        success: function (res) {
            var dataObject = JSON.parse(res.data);
            var photoVideoUrl = data.config.domain +'/'+ dataObject.key;

            // 修改data值
            var list = data.that.data.photoVideoList;
            list.push({photoVideoUrl:photoVideoUrl,type:data.type})
            data.that.setData({
              photoVideoList: list
            })

            dataObject.photoVideoUrl = photoVideoUrl
            dataObject.thumbnailUrl = dataObject.hash ? data.config.domain+'/Q9GLAFFqfCrYF6YfQAcON4w4Ezs=/'+dataObject.hash :''
            // 保存视频照片信息
            savePhotoVideoInfo(dataObject,data.type,data.config)
            // console.log("视频照片信息",dataObject)
            success++;
            console.log(i);
            console.log("上传七牛成功",res)
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
          }else{//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i=i;
            data.success=success;
            data.fail=fail;
            upload(data);
          }
        }
    })
}
//多张图片上传
// function myupload(data){
//   var that=this
//   var i=data.i?data.i:0
//   var success=data.success?data.success:0
//   var fail=data.fail?data.fail:0;
//   wx.uploadFile({
//       url: data.url, 
//       filePath: data.path[i],
//       name: 'fileData',
//       formData:null,
//       success: (resp) => {
//         success++;
//         console.log(resp)
//         console.log(i);
//         //这里可能有BUG，失败也会执行这里
//       },
//       fail: (res) => {
//         fail++;
//         console.log('fail:'+i+"fail:"+fail);
//       },
//       complete: () => {
//         console.log(i);
//         i++;
//         if(i==data.path.length){  //当图片传完时，停止调用     
//           console.log('执行完毕');
//           console.log('成功：'+success+" 失败："+fail);
//         }else{//若图片还没有传完，则继续调用函数
//           console.log(i);
//           data.i=i;
//           data.success=success;
//           data.fail=fail;
//           that.uploadimg(data);
//         }
//       }
//   });
// }
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

