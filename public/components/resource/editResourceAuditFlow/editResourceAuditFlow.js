(function(vc, vm) {

    vc.extends({
        data: {
            editResourceAuditFlowInfo: {
                rafId: '',
                flowName: '',
                auditType: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editResourceAuditFlow', 'openEditResourceAuditFlowModal', function(_params) {
                $that.refreshEditResourceAuditFlowInfo();
                $('#editResourceAuditFlowModel').modal('show');
                vc.copyObject(_params, $that.editResourceAuditFlowInfo);
                $that.editResourceAuditFlowInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editResourceAuditFlowValidate: function() {
                return vc.validate.validate({
                    editResourceAuditFlowInfo: $that.editResourceAuditFlowInfo
                }, {
                    'editResourceAuditFlowInfo.flowName': [{
                            limit: "required",
                            param: "",
                            errInfo: "流程名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "流程名称不能超过30"
                        },
                    ],
                    'editResourceAuditFlowInfo.auditType': [{
                            limit: "required",
                            param: "",
                            errInfo: "流程类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "流程类型不能超过12"
                        },
                    ],
                    'editResourceAuditFlowInfo.remark': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "备注不能超过512"
                    }, ],
                    'editResourceAuditFlowInfo.rafId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editResourceAuditFlow: function() {
                if (!$that.editResourceAuditFlowValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/resourceStore.updateResourceAuditFlow',
                    JSON.stringify($that.editResourceAuditFlowInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editResourceAuditFlowModel').modal('hide');
                            vc.emit('resourceAuditFlow', 'listResourceAuditFlow', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditResourceAuditFlowInfo: function() {
                $that.editResourceAuditFlowInfo = {
                    rafId: '',
                    flowName: '',
                    auditType: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.$that);