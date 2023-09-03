/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailFlowInfo: {
                auditUsers: [],
                contractId: '',
                roomNum: '',
                totalArea: '0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('contractDetailFlow', 'switch', function (_data) {
                $that.contractDetailFlowInfo.contractId = _data.contractId;
                $that._loadContractDetailFlowInfoData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
           
        },
        methods: {
            _loadContractDetailFlowInfoData: function (_page, _row) {
                let param = {
                    params: {
                        businessKey: $that.contractDetailFlowInfo.contractId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.contractDetailFlowInfo.auditUsers = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);