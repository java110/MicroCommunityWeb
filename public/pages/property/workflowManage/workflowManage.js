/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            workflowManageInfo: {
                workflows: [],
                total: 0,
                records: 1,
                moreCondition: false,
                title: '',
                flowTypes: [],
                conditions: {
                    flowName: '',
                    flowId: '',
                    flowType: ''

                }
            }
        },
        _initMethod: function () {
            vc.component._listWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('workflow', "flow_type", function (_data) {
                $that.workflowManageInfo.flowTypes = _data;
            });
        },
        _initEvent: function () {

            vc.on('workflowManage', 'listWorkflow', function (_param) {
                vc.component._listWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listWorkflows(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listWorkflows: function (_page, _rows) {

                vc.component.workflowManageInfo.conditions.page = _page;
                vc.component.workflowManageInfo.conditions.row = _rows;
                vc.component.workflowManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.workflowManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflows',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        vc.component.workflowManageInfo.total = _workflowManageInfo.total;
                        vc.component.workflowManageInfo.records = _workflowManageInfo.records;
                        vc.component.workflowManageInfo.workflows = _workflowManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.workflowManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openEditWorkflowModel: function (_workflow) {

                vc.jumpToPage('/admin.html#/pages/property/workflowSettingManage?' + vc.objToGetParam(_workflow));

            },
            _queryWorkflowMethod: function () {
                vc.component._listWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.workflowManageInfo.moreCondition) {
                    vc.component.workflowManageInfo.moreCondition = false;
                } else {
                    vc.component.workflowManageInfo.moreCondition = true;
                }
            },
            _openWorkflowImage: function (_workflow) {

                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _workflow.flowId
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if(_workflowManageInfo.code != '0'){
                            vc.toast(_workflowManageInfo.msg);

                            return ;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,'+_workflowManageInfo.data
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
                
            }


        }
    });
})(window.vc);
