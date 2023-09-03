(function(vc) {
    var photoUrl = '/callComponent/download/getFile/file';
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string, //父组件监听方法
            imageCount: vc.propTypes.string = '99' // -1 不限制
        },
        data: {
            uploadImageInfo: {
                photos: [],
                fileName: '',
                realFileName: '',
                imageCount: 99,
                progress: 0
            }
        },
        _initMethod: function() {
            let _imageCount = $props.imageCount;
            if (_imageCount != 99) {
                this.uploadImageInfo.imageCount = _imageCount;
            }
        },
        _initEvent: function() {
            vc.on('uploadImage', 'clearImage', function() {
                let _imageCount = this.uploadImageInfo.imageCount;
                this.uploadImageInfo = {
                    photos: [],
                    fileName: '',
                    realFileName: '',
                    imageCount: _imageCount,
                    progress: 0
                }
            });
            vc.on('uploadImage', 'notifyPhotos', function(_photos) {
                let _imageCount = this.uploadImageInfo.imageCount;
                this.uploadImageInfo = {
                    photos: [],
                    imageCount: _imageCount
                };
                _photos.forEach(function(_photo) {
                    //?objId=772019092507000013&communityId=7020181217000001&fileTypeCd=10000
                    if (_photo.indexOf('base64,') > -1) {
                        this.uploadImageInfo.photos.push(_photo);
                        return;
                    }
                    if (_photo.indexOf("https") > -1 || _photo.indexOf("http") > -1) {
                        this.uploadImageInfo.photos.push(_photo);
                        return;
                    }
                    if (_photo.indexOf(photoUrl) > -1) {
                        vc.urlToBase64(_photo, function(_base64Data) {
                            this.uploadImageInfo.photos.push(_base64Data);
                        });
                        return;
                    }
                    this.uploadImageInfo.photos.push(_photo);
                });
            });
        },
        methods: {
            _uploadPhoto: function(event) {
                $("#uploadImage").trigger("click")
            },
            _choosePhoto: function(event) {
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
                    reader.onloadend = function(e) {
                        //this.uploadImageInfo.photos.push(reader.result);
                    }
                    this.uploadImageInfo.fileName = file.name;
                    this._doUploadImage(file);
                }
                event.target.value = null;
            },
            _removeImage: function(_photo) {
                var _tmpPhotos = this.uploadImageInfo.photos;
                this.uploadImageInfo.photos = [];
                for (var _photoIndex = 0; _photoIndex < _tmpPhotos.length; _photoIndex++) {
                    if (_tmpPhotos[_photoIndex] != _photo) {
                        this.uploadImageInfo.photos.push(_tmpPhotos[_photoIndex]);
                    }
                }
            },
            _doUploadImage: function(_file) {
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
                    function(json, res) {
                        if (res.status != 200) {
                            vc.toast("上传文件失败");
                            return;
                        }
                        let data = JSON.parse(json);
                        this.uploadImageInfo.photos.push(data.url);
                        vc.emit($props.callBackListener, $props.callBackFunction, this.uploadImageInfo.photos);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
        }
    });
})(window.vc);