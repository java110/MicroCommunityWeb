(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            flowAuditInfo: {
                state: '',
                remark: '',
                taskId: '',
                startUserId: '',
                assignee: '',
                staffId: '',
                staffName: ''
            }
        },
        watch: {
            "flowAuditInfo.state": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (vc.notNull(val) && $that.flowAuditInfo.state == '1100') {
                        vc.component.flowAuditInfo.remark = "同意";
                        $that._listWorkflow();
                    } else {
                        vc.component.flowAuditInfo.remark = "";
                    }
                },
                deep: true
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('flowAudit', 'openAuditModal', function(_param) {
                vc.copyObject(_param, $that.flowAuditInfo);
            });
        },
        methods: {
            flowAuditValidate() {
                return vc.validate.validate({
                    flowAuditInfo: vc.component.flowAuditInfo
                }, {
                    'flowAuditInfo.state': [{
                            limit: "required",
                            param: "",
                            errInfo: "审核状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "审核状态错误"
                        },
                    ],
                    'flowAuditInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "原因内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "原因内容不能超过200"
                        },
                    ]
                });
            },
            _flowAuditSubmit: function() {
                if (!vc.component.flowAuditValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                if ($that.flowAuditInfo.assignee == '-2' && !$that.flowAuditInfo.staffId) {
                    vc.toast('请选择下一处理人');
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    let _flowAuditInfo = {
                        state: vc.component.flowAuditInfo.state,
                        remark: vc.component.flowAuditInfo.remark,
                        nextUserId: $that.flowAuditInfo.staffId
                    };
                    if (_flowAuditInfo.state == '1200') {
                        _flowAuditInfo.remark = '拒绝:' + _flowAuditInfo.remark;
                    }
                    vc.emit($props.callBackListener, $props.callBackFunction, _flowAuditInfo);
                    $('#flowAuditModel').modal('hide');
                    vc.component.clearAddBasePrivilegeInfo();
                    return;
                }
            },
            clearAddBasePrivilegeInfo: function() {
                vc.component.flowAuditInfo = {
                    state: '',
                    remark: ''
                }
            },
            _listWorkflow: function() {
                if ($that.flowAuditInfo.state != '1100') {
                    return;
                }
                let param = {
                    params: {
                        taskId: $that.flowAuditInfo.taskId,
                        startUserId: $that.flowAuditInfo.startUserId
                    }
                }

                vc.http.apiGet('/workflow.listWorkflowNextNode',
                    param,
                    function(json, res) {
                        let _auditOrdersInfo = JSON.parse(json);
                        $that.flowAuditInfo.auditOrders = _auditOrdersInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.flowAuditInfo);
            },
            _goBack: function() {
                vc.emit($props.callBackListener, 'list', {});
            }
        }
    });
})(window.vc);