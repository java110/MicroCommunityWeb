(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addComponentConditionInfo: {
                componentId: '',
                name: '',
                holdpace: '',
                param: '',
                type: '',
                remark: '',
                seq:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addComponentCondition', 'openAddComponentConditionModal', function (_param) {
                $that.addComponentConditionInfo.componentId = _param.componentId;
                $('#addComponentConditionModel').modal('show');
            });
        },
        methods: {
            addComponentConditionValidate() {
                return vc.validate.validate({
                    addComponentConditionInfo: vc.component.addComponentConditionInfo
                }, {
                    'addComponentConditionInfo.componentId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组件ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "组件ID不能超过30"
                        },
                    ],
                    'addComponentConditionInfo.name': [
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
                    'addComponentConditionInfo.holdpace': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "提示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "提示不能超过64"
                        },
                    ],
                    'addComponentConditionInfo.param': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "参数不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "参数不能超过64"
                        },
                    ],
                    'addComponentConditionInfo.type': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "类型不能超过12"
                        },
                    ],
                    'addComponentConditionInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序必须是数字"
                        },
                    ],
                    'addComponentConditionInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],
                });
            },
            saveComponentConditionInfo: function () {
                if (!vc.component.addComponentConditionValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addComponentConditionInfo);
                    $('#addComponentConditionModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomComponentCondition.saveReportCustomComponentCondition',
                    JSON.stringify(vc.component.addComponentConditionInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addComponentConditionModel').modal('hide');
                            vc.component.clearAddComponentConditionInfo();
                            vc.emit('componentConditionManage', 'listComponentCondition', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddComponentConditionInfo: function () {
                vc.component.addComponentConditionInfo = {
                    componentId: '',
                    name: '',
                    holdpace: '',
                    param: '',
                    type: '',
                    remark: '',
                    seq:''
                };
            }
        }
    });

})(window.vc);
