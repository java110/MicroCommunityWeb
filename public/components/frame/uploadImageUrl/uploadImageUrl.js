(function (vc) {
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string, //父组件监听方法
            imageCount: vc.propTypes.string = '99' // -1 不限制
        },
        data: {
            uploadImageUrlInfo: {
                photos: [], // 子组件显示图片用的数组 数组子元素为base64格式
                photosUrl: [], // 向父组件传递的数组 数组子元素为 {fileId: ..., url: ...}
                imageCount: 99,
            }
        },
        watch: {
            uploadImageUrlInfo: {
                deep: true,
                handler: function () {
                    vc.emit($props.callBackListener, $props.callBackFunction, this.uploadImageUrlInfo.photosUrl);
                }
            }
        },
        _initMethod: function () {
            let _imageCount = $props.imageCount;
            if (_imageCount != 99) {
                this.uploadImageUrlInfo.imageCount = _imageCount;
            }
        },
        _initEvent: function () {
            vc.on('uploadImageUrl', 'openAddApplicationKeyModal', function () {

            });
            vc.on('uploadImageUrl', 'clearImage', function () {
                let _imageCount = this.uploadImageUrlInfo.imageCount;
                this.uploadImageUrlInfo = {
                    photos: [],
                    photosUrl: [],
                    imageCount: _imageCount,
                }
            });
            vc.on('uploadImageUrl', 'notifyPhotos', function (_photos) {
                let _imageCount = this.uploadImageUrlInfo.imageCount;
                this.uploadImageUrlInfo = {
                    photos: [],
                    photosUrl: [],
                    imageCount: _imageCount
                };
                _photos.forEach(function (_photo) {
                    //?objId=772019092507000013&communityId=7020181217000001&fileTypeCd=10000
                    if (_photo.indexOf('base64,') > -1) {
                        this.uploadImageUrlInfo.photos.push(_photo);
                        return;
                    }
                    if (_photo.indexOf("https") > -1 || _photo.indexOf("http") > -1) {
                        vc.urlToBase64(_photo, function (_base64Data) {
                            this.uploadImageUrlInfo.photos.push(_base64Data);
                        });
                        let urlParams = this._getUrlParams(_photo);
                        if(!vc.isEmpty(urlParams['fileId'])){
                            this.uploadImageUrlInfo.photosUrl.push({fileId:urlParams['fileId'], url:_photo});
                        }
                        return;
                    }
                    if (_photo.indexOf(photoUrl) > -1) {
                        vc.urlToBase64(_photo, function (_base64Data) {
                            this.uploadImageUrlInfo.photos.push(_base64Data);
                        });
                        let urlParams = this._getUrlParams(_photo);
                        if(!vc.isEmpty(urlParams['fileId'])){
                            this.uploadImageUrlInfo.photosUrl.push({fileId:urlParams['fileId'], url:_photo});
                        }
                        return;
                    }
                    let url = photoUrl + "?fileId=" + _photo + "&communityId=-1&time=" + new Date();
                    vc.urlToBase64(url, function (_base64Data) {
                        this.uploadImageUrlInfo.photos.push(_base64Data);
                        this.uploadImageUrlInfo.photosUrl.push({fileId:_photo, url:url});
                    })
                });
            });
        },
        methods: {
            _getUrlParams: function(url) {
                if(url.indexOf('?')<0){
                    return {
                        fileId:url
                    }
                }
                let urlStr = url.split('?')[1]
                let obj = {};
                let paramsArr = urlStr.split('&')
                for(let i = 0,len = paramsArr.length;i < len;i++){
                    let arr = paramsArr[i].split('=')
                    obj[arr[0]] = arr[1];
                }
                return obj
            },
            _uploadPhoto: function (event) {
                $("#uploadImage").trigger("click")
            },
            _choosePhoto: function (event) {
                var photoFiles = event.target.files;
                if (photoFiles && photoFiles.length > 0) {
                    // 获取目前上传的文件
                    var file = photoFiles[0]; // 文件大小校验的动作
                    if (file.size > 1024 * 1024 * 2) {
                        vc.toast("图片大小不能超过 2MB!")
                        return false;
                    }
                    var reader = new FileReader(); //新建FileReader对象
                    reader.readAsDataURL(file); //读取为base64
                    reader.onloadend = function (e) {
                        this.uploadImageUrlInfo.photos.push(reader.result);
                    }
                    this._doUploadImageUrl(file);
                }
                event.target.value = null;
            },
            _removeImage: function (_photo) {
                let delIndex = this.uploadImageUrlInfo.photos.indexOf(_photo);
                this.uploadImageUrlInfo.photos.splice(delIndex, 1);
                this.uploadImageUrlInfo.photosUrl.splice(delIndex, 1);
            },
            _doUploadImageUrl: function (_file) {
                var param = new FormData();
                param.append("uploadFile", _file);
                param.append('communityId', vc.getCurrentCommunity().communityId);
                //发送get请求
                vc.http.upload('uploadFile',
                    'uploadImage',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        if (res.status != 200) {
                            vc.toast("上传文件失败");
                            return;
                        }
                        var data = JSON.parse(json);
                        this.uploadImageUrlInfo.photosUrl.push(data);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
        }
    });
})(window.vc);