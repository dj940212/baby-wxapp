// created by gpake
(function() {

var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null
}

module.exports = {
    init: init,
    upload: upload,
}

// 在整个程序生命周期中，只需要 init 一次即可
// 如果需要变更参数，再调用 init 即可
function init(options) {
    config = {
        qiniuRegion: '',
        qiniuImageURLPrefix: '',
        qiniuUploadToken: '',
        qiniuUploadTokenURL: '',
        qiniuUploadTokenFunction: null,
    };
    updateConfigWithOptions(options);
}
// 初始化配置文件
function updateConfigWithOptions(options) {
    if (options.region) {
        config.qiniuRegion = options.region;
    } else {
        console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
        config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
        config.qiniuUploadTokenURL = options.uptokenURL;
    } else if(options.uptokenFunc) {
        config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
        config.qiniuImageURLPrefix = options.domain;
    }
}

function upload(filePath, type, success, fail, options) {
    if (null == filePath) {
        console.error('qiniu uploader need filePath to upload');
        return;
    }
    if (options) {
        // 初始化配置
        init(options);
    }
    // 七牛签名
    if (config.qiniuUploadToken) {
        doUpload(filePath, type, success, fail, options);
    } else if (config.qiniuUploadTokenURL) {
        getQiniuToken(type, function() {
            doUpload(filePath, type, success, fail, options);
        });
    } else if (config.qiniuUploadTokenFunction) {
        config.qiniuUploadToken = config.qiniuUploadTokenFunction();
    } else {
        console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
        return;
    }
}

// 上传文件
function doUpload(filePath, type, success, fail, options) {
    console.log('filePath',filePath,options)
    // 区域上传地址
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    console.log("上传地址",url)
    var fileName = filePath.split('//')[1];
    if (options && options.key) {
        fileName = options.key;
    }
    var formData = {
        'token': config.qiniuUploadToken,
        'key': fileName
    };
    console.log("formData",formData)
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
            var dataString = res.data
            var dataObject = JSON.parse(dataString);
            //do something
            var imageUrl = config.qiniuImageURLPrefix +'/'+ dataObject.key;
            dataObject.imageURL = imageUrl;
            // console.log(dataObject);
            if (success) {
                success(dataObject);
                console.log("djdj",dataObject)
                savePhotoVideoInfo(dataObject.imageURL,type)
            }
        },
        fail: function (error) {
            console.log(error);
            if (fail) {
                fail(error);
            }
        }
    })
}

// 获取七牛签名
function getQiniuToken(type, callback) {
  wx.request({
    url: config.qiniuUploadTokenURL,
    method: 'POST',
    data: {
        type: type,
        accessToken: '8591137c-ff1c-4565-bf1f-19a540acde1b'
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      var token = res.data.data.uptoken;

      console.log("获取七牛签名uptoken"+type+':'+token)

      config.qiniuUploadToken = token;

      if (callback) {
          callback();
      }
    },
    fail: function (error) {
      console.log(error);
    }
  })
}

// 保存照片信息到数据库
function savePhotoVideoInfo(photoVideoUrl,type){
  wx.request({
    url: 'http://localhost:1234/api/photoVideo/save',
    method: 'POST',
    data: {
        photoVideoUrl: photoVideoUrl,
        type: type,
        accessToken: '8591137c-ff1c-4565-bf1f-19a540acde1b'
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log('保存照片信息到'+type+'数据库成功')
    },
    fail: function (error) {
      console.log(error);
    }
  })

}

// 获取地区上传地址
function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch(code) {
        case 'ECN': uploadURL = 'https://up.qbox.me'; break;
        case 'NCN': uploadURL = 'https://up-z1.qbox.me'; break;
        case 'SCN': uploadURL = 'http://up-z2.qiniu.com/'; break;
        case 'NA': uploadURL = 'https://up-na0.qbox.me'; break;
        default: console.error('please make the region is with one of [ECN, SCN, NCN, NA]');
    }
    return uploadURL;
}

})();