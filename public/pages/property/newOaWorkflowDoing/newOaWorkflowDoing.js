/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowManageInfo: {
                newOaWorkflows: [],
                conditions: {
                    state: 'C'
                }
            }
        },
        _initMethod: function () {
            vc.component._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

        },
        methods: {
            _listNewOaWorkflows: function (_page, _rows) {

                vc.component.newOaWorkflowManageInfo.conditions.page = _page;
                vc.component.newOaWorkflowManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.newOaWorkflowManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflow',
                    param,
                    function (json, res) {
                        var _newOaWorkflowManageInfo = JSON.parse(json);
                        $that.newOaWorkflowManageInfo.newOaWorkflows = _newOaWorkflowManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toGo:function(_url){
                vc.jumpToPage(_url);
            }
        }
    });
})(window.vc);
