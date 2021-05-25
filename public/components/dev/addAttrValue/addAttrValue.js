(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAttrValueInfo: {
                specCd:'',
                valueId: '',
                value: '',
                valueName: '',
                valueShow: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addAttrValue', 'openAddAttrValueModal', function (item) {
                $that.addAttrValueInfo.specCd = item.specCd;
                $('#addAttrValueModel').modal('show');
            });
        },
        methods: {
            addAttrValueValidate() {
                return vc.validate.validate({
                    addAttrValueInfo: vc.component.addAttrValueInfo
                }, {
                    'addAttrValueInfo.value': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值超过200位"
                        },
                    ],
                    'addAttrValueInfo.valueName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "值名称超过200位"
                        },
                    ],
                    'addAttrValueInfo.valueShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "显示格式错误"
                        },
                    ],




                });
            },
            saveAttrValueInfo: function () {
                if (!vc.component.addAttrValueValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAttrValueInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAttrValueInfo);
                    $('#addAttrValueModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/attrValue/saveAttrValue',
                    JSON.stringify(vc.component.addAttrValueInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAttrValueModel').modal('hide');
                            vc.component.clearAddAttrValueInfo();
                            vc.emit('attrValueManage', 'listAttrValue', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddAttrValueInfo: function () {
                vc.component.addAttrValueInfo = {
                    specCd:'',
                    value: '',
                    valueName: '',
                    valueShow: '',
                };
            }
        }
    });

})(window.vc);
