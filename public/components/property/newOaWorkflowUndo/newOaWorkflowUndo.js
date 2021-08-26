/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            newOaWorkflowUndoInfo: {
                undos: [],
                total: 0,
                records: 1,
                formJson: [],
                conditions: {
                    createUserName: '',
                    startTime: '',
                    endTime: '',
                    flowId: ''
                }
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('newOaWorkflowUndo', 'witch', function (_value) {
                $that.newOaWorkflowUndoInfo.conditions.flowId = _value.flowId;
                vc.initDateTime('undoStartTime', function (_value) {
                    $that.newOaWorkflowUndoInfo.conditions.startTime = _value;
                });
                vc.initDateTime('undoEndTime', function (_value) {
                    $that.newOaWorkflowUndoInfo.conditions.endTime = _value;
                });
                $that._listOaWorkFlowUndoForm();
                vc.component._listOaWorkflowUndos(DEFAULT_PAGE, DEFAULT_ROWS);
            })
            vc.on('newOaWorkflowUndo','paginationPlus', 'page_event', function (_currentPage) {
                vc.component._listOaWorkflowUndos(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOaWorkFlowUndoForm: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowUndoInfo.conditions.flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function (json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowUndoInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson).components;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowUndos: function (_page, _rows) {
                vc.component.newOaWorkflowUndoInfo.conditions.page = _page;
                vc.component.newOaWorkflowUndoInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowUndoInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowUserTaskFormData',
                    param,
                    function (json, res) {
                        var _newOaWorkflowUndoInfo = JSON.parse(json);
                        vc.component.newOaWorkflowUndoInfo.total = _newOaWorkflowUndoInfo.total;
                        vc.component.newOaWorkflowUndoInfo.records = _newOaWorkflowUndoInfo.records;
                        vc.component.newOaWorkflowUndoInfo.undos = _newOaWorkflowUndoInfo.data;
                        vc.emit('newOaWorkflowUndo','paginationPlus', 'init', {
                            total: vc.component.newOaWorkflowUndoInfo.records,
                            dataCount: vc.component.newOaWorkflowUndoInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowUndoDetail: function (_undo) {
                vc.jumpToPage("/admin.html#/pages/property/newOaWorkflowDetail?id=" + _undo.id + "&flowId=" + $that.newOaWorkflowUndoInfo.conditions.flowId);
            },
            _openAuditNewOaWorkflowUndoDetail:function(_undo){
                vc.jumpToPage("/admin.html#/pages/property/newOaWorkflowDetail?id=" + _undo.id 
                + "&flowId=" + $that.newOaWorkflowUndoInfo.conditions.flowId
                + "&action=Audit"
                + "&taskId="+_undo.taskId);
            },
            _queryOaWorkflowUndoMethod: function () {
                vc.component._listOaWorkflowUndos(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getNewOaWorkflowUndoState: function (_undo) {
                /**
                 * 1001 申请 1002 待审核 1003 退回 1004 委托 1005 办结
                 */
                if (!_undo.hasOwnProperty('state')) {
                    return "未知";
                }

                switch (_undo.state) {
                    case '1001':
                        return "申请";
                    case '1002':
                        return "待审核";
                    case '1003':
                        return "退回";
                    case '1004':
                        return "委托";
                    case '1005':
                        return "办结";
                }

                return "未知"
            }
        }
    });
})(window.vc);