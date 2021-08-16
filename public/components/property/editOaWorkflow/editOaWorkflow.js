(function (vc, vm) {

    vc.extends({
        data: {
            editOaWorkflowInfo: {
                flowId: '',
                flowName: '',
                flowType: '',
                describle: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editOaWorkflow', 'openEditOaWorkflowModal', function (_params) {
                vc.component.refreshEditOaWorkflowInfo();
                $('#editOaWorkflowModel').modal('show');
                vc.copyObject(_params, vc.component.editOaWorkflowInfo);
                vc.component.editOaWorkflowInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editOaWorkflowValidate: function () {
                return vc.validate.validate({
                    editOaWorkflowInfo: vc.component.editOaWorkflowInfo
                }, {
                    'editOaWorkflowInfo.flowName': [
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
                    'editOaWorkflowInfo.flowType': [
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
                    'editOaWorkflowInfo.describle': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],
                    'editOaWorkflowInfo.flowId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "工作流ID不能为空"
                        }]

                });
            },
            editOaWorkflow: function () {
                if (!vc.component.editOaWorkflowValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/oaWorkflow/updateOaWorkflow',
                    JSON.stringify(vc.component.editOaWorkflowInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editOaWorkflowModel').modal('hide');
                            vc.emit('oaWorkflowManage', 'listOaWorkflow', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditOaWorkflowInfo: function () {
                vc.component.editOaWorkflowInfo = {
                    flowId: '',
                    flowName: '',
                    flowType: '',
                    describle: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
