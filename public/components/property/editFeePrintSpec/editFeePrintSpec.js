(function (vc, vm) {

    vc.extends({
        data: {
            editFeePrintSpecInfo: {
                printId: '',
                specCd: '',
                content: '',
                qrImg: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editFeePrintSpec', 'openEditFeePrintSpecModal', function (_params) {
                vc.component.refreshEditFeePrintSpecInfo();
                $('#editFeePrintSpecModel').modal('show');
                vc.copyObject(_params, vc.component.editFeePrintSpecInfo);
                vc.component.editFeePrintSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                var photos = [];
                photos.push(_params.qrImg);
                vc.emit('editFeePrintSpec', 'uploadImage', 'notifyPhotos', photos);
            });

            vc.on("editFeePrintSpec", "notifyUploadImage", function (_param) {
                if (!vc.isEmpty(_param) && _param.length > 0) {
                    vc.component.editFeePrintSpecInfo.qrImg = _param[0];
                } else {
                    vc.component.editFeePrintSpecInfo.qrImg = '';
                }
            });
        },
        methods: {
            editFeePrintSpecValidate: function () {
                return vc.validate.validate({
                    editFeePrintSpecInfo: vc.component.editFeePrintSpecInfo
                }, {
                    'editFeePrintSpecInfo.specCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规格不是有效数字"
                        },
                    ],
                    'editFeePrintSpecInfo.content': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1000",
                            errInfo: "说明不能超过1000位"
                        },
                    ],
                    'editFeePrintSpecInfo.qrImg': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }
                    ]

                });
            },
            editFeePrintSpec: function () {
                if (!vc.component.editFeePrintSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/feePrintSpec/updateFeePrintSpec',
                    JSON.stringify(vc.component.editFeePrintSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeePrintSpecModel').modal('hide');
                            vc.emit('feePrintSpecManage', 'listFeePrintSpec', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditFeePrintSpecInfo: function () {
                vc.component.editFeePrintSpecInfo = {
                    printId: '',
                    specCd: '',
                    content: '',
                    qrImg: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
