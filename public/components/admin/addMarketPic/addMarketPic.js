(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketPicInfo: {
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
            vc.on('addMarketPic', 'openAddMarketPicModal', function () {
                $('#addMarketPicModel').modal('show');
            });

            vc.on("addMarketPic", "notifyUploadImage", function(_param) {
                if (!_param || _param.length < 1) {
                    return;
                }
                _param.forEach(item => {
                    vc.component.addMarketPicInfo.picUrl = item;
                });
            });
        },
        methods: {
            addMarketPicValidate() {
                return vc.validate.validate({
                    addMarketPicInfo: vc.component.addMarketPicInfo
                }, {
                    'addMarketPicInfo.name': [
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
                    'addMarketPicInfo.picUrl': [
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
                    'addMarketPicInfo.picLink': [
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
                    'addMarketPicInfo.remark': [
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




                });
            },
            saveMarketPicInfo: function () {
                if (!vc.component.addMarketPicValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }


                vc.http.apiPost(
                    '/marketPic.saveMarketPic',
                    JSON.stringify(vc.component.addMarketPicInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketPicModel').modal('hide');
                            vc.component.clearAddMarketPicInfo();
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
            clearAddMarketPicInfo: function () {
                vc.component.addMarketPicInfo = {
                    name: '',
                    picUrl: '',
                    picLink: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
