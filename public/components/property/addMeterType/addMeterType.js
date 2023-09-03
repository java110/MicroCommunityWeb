(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMeterTypeInfo: {
                typeId: '',
                typeName: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addMeterType', 'openAddMeterTypeModal', function () {
                $('#addMeterTypeModel').modal('show');
            });
        },
        methods: {
            addMeterTypeValidate() {
                return vc.validate.validate({
                    addMeterTypeInfo: vc.component.addMeterTypeInfo
                }, {
                    'addMeterTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "名称不能超过12"
                        }
                    ],
                    'addMeterTypeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过200"
                        }
                    ]
                });
            },
            saveMeterTypeInfo: function () {
                if (!vc.component.addMeterTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addMeterTypeInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMeterTypeInfo);
                    $('#addMeterTypeModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'meterType.saveMeterType',
                    JSON.stringify(vc.component.addMeterTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMeterTypeModel').modal('hide');
                            vc.component.clearAddMeterTypeInfo();
                            vc.emit('meterTypeManage', 'listMeterType', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddMeterTypeInfo: function () {
                vc.component.addMeterTypeInfo = {
                    typeName: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
