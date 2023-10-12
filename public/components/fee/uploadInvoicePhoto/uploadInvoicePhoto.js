(function (vc) {
    vc.extends({
        data: {
            uploadInvoicePhotoInfo: {
                applyId: '',
                invoiceCode:'',
                photos: [],
            }
        },
        _initMethod: function () {
            
        },
        _initEvent: function () {
            vc.on("uploadInvoicePhoto", "notifyUploadImage", function(_param) {
                if (!_param || _param.length < 1) {
                    return;
                }
                $that.uploadInvoicePhotoInfo.photos = [];
                _param.forEach(item => {
                    $that.uploadInvoicePhotoInfo.photos.push(item);
                });
            });
            vc.on('uploadInvoicePhoto', 'openInvoicePhotoModal', function(_param) {
                vc.copyObject(_param,$that.uploadInvoicePhotoInfo);
                $('#uploadInvoicePhotoModel').modal('show');
            });
        },
        methods: {
            saveUploadInvoicePhoto: function () {
                let _photos = $that.uploadInvoicePhotoInfo.photos;
                if (!_photos || _photos.length < 1) {
                    vc.toast("请选择发票");
                    return;
                }
                $that.uploadInvoicePhotoInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/invoice.uploadInvoicePhoto',
                    JSON.stringify($that.uploadInvoicePhotoInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == '0') {
                            //关闭model
                            $('#uploadInvoicePhotoModel').modal('hide');
                            $that.clearUploadInvoicePhotoInfo();
                            vc.emit('invoiceApply', 'listInvoiceApply', {});
                            vc.toast("上传成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            clearUploadInvoicePhotoInfo: function () {
                $that.uploadInvoicePhotoInfo = {
                    applyId: '',
                    invoiceCode:'',
                    photos: [],
                };
                vc.emit('uploadInvoicePhoto', 'uploadImage', 'clearImage', {});
            },
        }
    });
})(window.vc);