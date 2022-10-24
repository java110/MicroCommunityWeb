(function (vc, vm) {

    vc.extends({
        data: {
            editMarketPicInfo: {
                picId: '',
                name: '',
                picUrl: '',
                picLink: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editMarketPic', 'openEditMarketPicModal', function (_params) {
                vc.component.refreshEditMarketPicInfo();
                $('#editMarketPicModel').modal('show');
                vc.copyObject(_params, vc.component.editMarketPicInfo);
                let _photos = [];
                _photos.push(_params.picUrl);
                vc.emit('editMarketPic', 'uploadImage', 'notifyPhotos', _photos);
            });

            vc.on("editMarketPic", "notifyUploadImage", function(_param) {

                if (!_param || _param.length < 1) {
                    return;
                }
                _param.forEach(item => {
                    vc.component.editMarketPicInfo.picUrl = item;
                });
            });
        },
        methods: {
            editMarketPicValidate: function () {
                return vc.validate.validate({
                    editMarketPicInfo: vc.component.editMarketPicInfo
                }, {
                    'editMarketPicInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'editMarketPicInfo.picUrl': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "图片地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "图片地址不能超过512"
                        },
                    ],
                    'editMarketPicInfo.picLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "图片访问地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "图片访问地址不能超过512"
                        },
                    ],
                    'editMarketPicInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注'不能超过512"
                        },
                    ],
                    'editMarketPicInfo.picId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editMarketPic: function () {
                if (!vc.component.editMarketPicValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketPic.updateMarketPic',
                    JSON.stringify(vc.component.editMarketPicInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMarketPicModel').modal('hide');
                            vc.emit('marketPicManage', 'listMarketPic', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditMarketPicInfo: function () {
                vc.component.editMarketPicInfo = {
                    picId: '',
                    name: '',
                    picUrl: '',
                    picLink: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
