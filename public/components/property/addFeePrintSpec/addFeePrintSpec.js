(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeePrintSpecInfo: {
                specCd: '',
                specCd: '',
                content: '',
                qrImg: '',
                printName: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addFeePrintSpec', 'openAddFeePrintSpecModal', function () {
                $('#addFeePrintSpecModel').modal('show');
            });
            vc.on('addFeePrintSpec', 'notifyUploadImage', function (_img) {
                $that.addFeePrintSpecInfo.qrImg = _img[0];
            })
        },
        methods: {
            addFeePrintSpecValidate() {
                return vc.validate.validate({
                    addFeePrintSpecInfo: vc.component.addFeePrintSpecInfo
                }, {
                    'addFeePrintSpecInfo.specCd': [
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
                    'addFeePrintSpecInfo.printName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称太长"
                        },
                    ],
                    'addFeePrintSpecInfo.content': [
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
                    'addFeePrintSpecInfo.qrImg': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }
                    ],
                });
            },
            saveFeePrintSpecInfo: function () {
                if (!vc.component.addFeePrintSpecValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addFeePrintSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeePrintSpecInfo);
                    $('#addFeePrintSpecModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/feePrintSpec/saveFeePrintSpec',
                    JSON.stringify(vc.component.addFeePrintSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeePrintSpecModel').modal('hide');
                            vc.component.clearAddFeePrintSpecInfo();
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
            clearAddFeePrintSpecInfo: function () {
                vc.component.addFeePrintSpecInfo = {
                    specCd: '',
                    content: '',
                    qrImg: '',
                    printName: '',
                };
            }
        }
    });
})(window.vc);
