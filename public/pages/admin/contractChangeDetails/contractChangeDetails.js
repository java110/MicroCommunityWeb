/**
    合同信息 组件
**/
(function (vc) {

    vc.extends({

        data: {
            contractChangeDetailsInfo: {
                contractDetails: [],
                auditUsers: [],
                planId:''
            }
        },
        _initMethod: function () {
            $that.contractChangeDetailsInfo.planId = vc.getParam('planId');
            $that._listContractDetails();
            $that._loadAuditUser();
           
        },
        _initEvent: function () {


        },
        methods: {
            _listContractDetails: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 10,
                        planId: $that.contractChangeDetailsInfo.planId
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContractChangePlanDetail',
                    param,
                    function (json, res) {
                        var _contractChangeManageInfo = JSON.parse(json);
                        _contractChangeManageInfo.data.sort(function (_child, _newChild) {
                            return _newChild.operate.charCodeAt(0) - _child.operate.charCodeAt(0)
                        });
                        vc.component.contractChangeDetailsInfo.contractDetails = _contractChangeManageInfo.data;


                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAuditUser: function () {
                var param = {
                    params: {
                        businessKey: $that.contractChangeDetailsInfo.planId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowAuditInfo',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.contractChangeDetailsInfo.auditUsers = _json.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });

})(window.vc);
