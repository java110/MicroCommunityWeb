(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addOaWorkflowInfo: {
                flowId: '',
                flowName: '',
                flowType: '',
                flowTypes: [],
                describle: ''
            }
        },
        _initMethod: function () {
            vc.getDict('oa_workflow', "flow_type", function (_data) {
                vc.component.addOaWorkflowInfo.flowTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('addOaWorkflow', 'openAddOaWorkflowModal', function () {
                $('#addOaWorkflowModel').modal('show');
            });
        },
        methods: {
            addOaWorkflowValidate() {
                return vc.validate.validate({
                    addOaWorkflowInfo: vc.component.addOaWorkflowInfo
                }, {
                    'addOaWorkflowInfo.flowName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "流程名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "流程名称超过64位"
                        },
                    ],
                    'addOaWorkflowInfo.flowType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "流程类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "流程类型不能为空"
                        },
                    ],
                    'addOaWorkflowInfo.describle': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        }
                    ]
                });
            },
            saveOaWorkflowInfo: function () {
                if (!vc.component.addOaWorkflowValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addOaWorkflowInfo);
                    $('#addOaWorkflowModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/oaWorkflow/saveOaWorkflow',
                    JSON.stringify(vc.component.addOaWorkflowInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addOaWorkflowModel').modal('hide');
                            vc.component.clearAddOaWorkflowInfo();
                            vc.emit('oaWorkflowManage', 'listOaWorkflow', {});
                            vc.toast("添加成功")
                            vc.getDict('oa_workflow', "flow_type", function (_data) {
                                vc.component.addOaWorkflowInfo.flowTypes = _data;
                            });
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    }
                );
            },
            clearAddOaWorkflowInfo: function () {
                vc.component.addOaWorkflowInfo = {
                    flowId: '',
                    flowName: '',
                    flowType: '',
                    flowTypes: [],
                    describle: ''
                };
            }
        }
    });
})(window.vc);
