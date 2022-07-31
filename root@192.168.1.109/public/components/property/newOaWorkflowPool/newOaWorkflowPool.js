/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            newOaWorkflowPoolInfo: {
                pools: [],
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
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('newOaWorkflowPool', 'witch', function(_value) {
                $that.newOaWorkflowPoolInfo.conditions.flowId = _value.flowId;
                vc.initDateTime('poolStartTime', function(_value) {
                    $that.newOaWorkflowPoolInfo.conditions.startTime = _value;
                });
                vc.initDateTime('poolEndTime', function(_value) {
                    $that.newOaWorkflowPoolInfo.conditions.endTime = _value;
                });
                $that._listOaWorkFlowPoolForm();
                vc.component._listOaWorkflowPools(DEFAULT_PAGE, DEFAULT_ROWS);
            })
            vc.on('newOaWorkflowPool', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listOaWorkflowPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listOaWorkFlowPoolForm: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        flowId: $that.newOaWorkflowPoolInfo.conditions.flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowForm',
                    param,
                    function(json, res) {
                        let _newOaWorkflowFormInfo = JSON.parse(json);
                        $that.newOaWorkflowPoolInfo.formJson = JSON.parse(_newOaWorkflowFormInfo.data[0].formJson).components;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOaWorkflowPools: function(_page, _rows) {
                vc.component.newOaWorkflowPoolInfo.conditions.page = _page;
                vc.component.newOaWorkflowPoolInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowPoolInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflowFormData',
                    param,
                    function(json, res) {
                        var _newOaWorkflowPoolInfo = JSON.parse(json);
                        vc.component.newOaWorkflowPoolInfo.total = _newOaWorkflowPoolInfo.total;
                        vc.component.newOaWorkflowPoolInfo.records = _newOaWorkflowPoolInfo.records;
                        vc.component.newOaWorkflowPoolInfo.pools = _newOaWorkflowPoolInfo.data;
                        vc.emit('newOaWorkflowPool', 'paginationPlus', 'init', {
                            total: vc.component.newOaWorkflowPoolInfo.records,
                            dataCount: vc.component.newOaWorkflowPoolInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openNewOaWorkflowPoolDetail: function(_pool) {
                vc.jumpToPage("/#/pages/property/newOaWorkflowDetail?id=" + _pool.id + "&flowId=" + $that.newOaWorkflowPoolInfo.conditions.flowId);
            },
            _queryOaWorkflowPoolMethod: function() {
                vc.component._listOaWorkflowPools(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openNewOaWorkflowPoolImg: function(_pool) { //展示流程图
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _pool.id
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function(json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getNewOaWorkflowPoolState: function(_pool) {
                /**
                 * 1001 申请 1002 待审核 1003 退回 1004 委托 1005 办结
                 */
                if (!_pool.hasOwnProperty('state')) {
                    return "未知";
                }

                switch (_pool.state) {
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