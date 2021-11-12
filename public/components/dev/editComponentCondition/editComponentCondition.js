(function (vc, vm) {

    vc.extends({
        data: {
            editComponentConditionInfo: {
                conditionId: '',
                componentId: '',
                name: '',
                holdpace: '',
                param: '',
                type: '',
                remark: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editComponentCondition', 'openEditComponentConditionModal', function (_params) {
                vc.component.refreshEditComponentConditionInfo();
                $('#editComponentConditionModel').modal('show');
                vc.copyObject(_params, vc.component.editComponentConditionInfo);
            });
        },
        methods: {
            editComponentConditionValidate: function () {
                return vc.validate.validate({
                    editComponentConditionInfo: vc.component.editComponentConditionInfo
                }, {
                    'editComponentConditionInfo.componentId': [
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
                    'editComponentConditionInfo.name': [
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
                    'editComponentConditionInfo.holdpace': [
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
                    'editComponentConditionInfo.param': [
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
                    'editComponentConditionInfo.type': [
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
                    'editComponentConditionInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述不能超过512"
                        },
                    ],
                    'editComponentConditionInfo.conditionId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "条件ID不能为空"
                        }]

                });
            },
            editComponentCondition: function () {
                if (!vc.component.editComponentConditionValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/reportCustomComponentCondition.updateReportCustomComponentCondition',
                    JSON.stringify(vc.component.editComponentConditionInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editComponentConditionModel').modal('hide');
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
            refreshEditComponentConditionInfo: function () {
                vc.component.editComponentConditionInfo = {
                    conditionId: '',
                    componentId: '',
                    name: '',
                    holdpace: '',
                    param: '',
                    type: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
