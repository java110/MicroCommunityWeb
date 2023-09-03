/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 100;
    vc.extends({
        data: {
            newOaWorkflowDoingInfo: {
                newOaWorkflows: [],
                conditions: {
                    state: 'C'
                },
                repair: 0,
                complaint: 0,
                purchase: 0,
                collection: 0,
                contractApply: 0,
                contractChange: 0,
                allocation: 0,
                itemReleaseCount: 0,
                visitUndoCount: 0,
                ownerSettledApplyCount: 0
            }
        },
        _initMethod: function() {
            $that._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadUndoInfo();
        },
        _initEvent: function() {},
        methods: {
            _toGo: function(_url) {
                vc.jumpToPage(_url);
            },
            _toGoA: function(item) {
                vc.jumpToPage('/form.html#/pages/property/newOaWorkflow?flowId=' + item.flowId + "&switchValue=newOaWorkflowUndo");
            },
            _toGoB: function(item) {
                vc.jumpToPage('/form.html#/pages/property/newOaWorkflow?flowId=' + item.flowId + "&switchValue=newOaWorkflowFinish");
            },
            _listNewOaWorkflows: function(_page, _rows) {
                let param = {
                    params: {
                        state: 'C',
                        page: 1,
                        row: 100,
                        flowType: '1001'
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow/queryOaWorkflow',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.newOaWorkflowDoingInfo.newOaWorkflows = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadUndoInfo: function() {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 10
                    }
                }
                vc.http.get(
                    'undo',
                    'list',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json).data;
                        vc.copyObject(_json, $that.newOaWorkflowDoingInfo);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryUndoOrderMethod: function() {
                $that._listNewOaWorkflows(DEFAULT_PAGE, DEFAULT_ROWS);
                $that._loadUndoInfo();
            }
        }
    });
})(window.vc);