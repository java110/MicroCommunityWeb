(function (vc) {
    vc.extends({
        data: {
            auditDivInfo: {
                state: '',
                remark: '',
                action: '',
                createUserId: '',
                flowId: '',
                url: '',
                id: '',
                audit: {
                    auditCode: '1100',
                    auditMessage: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
                nextAudit: {}
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('auditDiv', 'noifyData', function (_data) {
                $that.auditDivInfo.createUserId = _data.createUserId;
                $that.auditDivInfo.action = _data.action;
                $that.auditDivInfo.audit.taskId = _data.taskId;
                $that.auditDivInfo.audit.flowId = _data.flowId;
                $that.auditDivInfo.url = _data.url;
                $that.auditDivInfo.id = _data.id;
                $that._loadNextAuditPerson();
            });
        },
        methods: {
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.auditDivInfo.audit);
            },
            _auditSubmit: function () {
                let _audit = $that.auditDivInfo.audit;
                _audit.flowId = $that.auditDivInfo.flowId;
                _audit.id = $that.auditDivInfo.id;
                /**
                 * assigness
                 *  -1 表示 下一个节点为 结束节点
                 *  -2 表示 需要指定依稀处理人
                 *  其他表示 下一指定人ID
                 *
                 */
                if ($that.auditDivInfo.nextAudit.assignee != '-2') {
                    _audit.staffId = $that.auditDivInfo.nextAudit.assignee;
                }
                if (!_audit.auditCode) {
                    vc.toast('请选择状态');
                    return;
                }
                if (!_audit.auditMessage) {
                    vc.toast('请填写说明');
                    return;
                }
                if (_audit.auditCode != '1200' && _audit.auditCode != '1400' && !_audit.staffId) {
                    vc.toast('请选择下一节点处理人');
                    return;
                }
                vc.http.apiPost(
                    $that.auditDivInfo.url,
                    JSON.stringify(_audit), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('提交成功');
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _loadNextAuditPerson: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        taskId: $that.auditDivInfo.audit.taskId,
                        startUserId: $that.auditDivInfo.createUserId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryNextDealUser',
                    param,
                    function (json, res) {
                        let _nextAudit = JSON.parse(json);
                        if (_nextAudit.code != '0') {
                            return;
                        }
                        $that.auditDivInfo.nextAudit = _nextAudit.data[0];
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddBasePrivilegeInfo: function () {
                $that.auditDivInfo = {
                    state: '',
                    remark: '',
                    action: '',
                    createUserId: '',
                    flowId: '',
                    url: '',
                    id: '',
                    audit: {
                        auditCode: '1100',
                        auditMessage: '',
                        staffId: '',
                        staffName: '',
                        taskId: ''
                    },
                    nextAudit: {},
                }
            }
        }
    });
})(window.vc);