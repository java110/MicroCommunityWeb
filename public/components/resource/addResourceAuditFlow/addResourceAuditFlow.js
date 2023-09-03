(function(vc) {

    vc.extends({
        data: {
            addResourceAuditFlowInfo: {
                rafId: '',
                flowName: '',
                auditType: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addResourceAuditFlow', 'openAddResourceAuditFlowModal', function() {
                $('#addResourceAuditFlowModel').modal('show');
            });
        },
        methods: {
            addResourceAuditFlowValidate() {
                return vc.validate.validate({
                    addResourceAuditFlowInfo: $that.addResourceAuditFlowInfo
                }, {
                    'addResourceAuditFlowInfo.flowName': [{
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
                    'addResourceAuditFlowInfo.auditType': [{
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
                    'addResourceAuditFlowInfo.remark': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "备注不能超过512"
                    }, ],




                });
            },
            saveResourceAuditFlowInfo: function() {
                if (!$that.addResourceAuditFlowValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                $that.addResourceAuditFlowInfo.communityId = vc.getCurrentCommunity().communityId;


                vc.http.apiPost(
                    '/resourceStore.saveResourceAuditFlow',
                    JSON.stringify($that.addResourceAuditFlowInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addResourceAuditFlowModel').modal('hide');
                            $that.clearAddResourceAuditFlowInfo();
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
            clearAddResourceAuditFlowInfo: function() {
                $that.addResourceAuditFlowInfo = {
                    flowName: '',
                    auditType: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);