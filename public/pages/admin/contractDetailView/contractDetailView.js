/**
    合同信息 组件
**/
(function (vc) {

    vc.extends({

        data: {
            contractChangeDetailsInfo: {
                contractDetails: []

            }
        },
        _initMethod: function () {
            $that._listContractDetails()
        },
        _initEvent: function () {


        },
        methods: {
            _listContractDetails: function () {
                var param = {
                    params: {
                        page:1,
                        row:10,
                        contractId:vc.getParam('contractId')
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContractChangePlanDetail',
                    param,
                    function (json, res) {
                        var _contractChangeManageInfo = JSON.parse(json);

                        console.log('666',_contractChangeManageInfo);
                        _contractChangeManageInfo.data.sort(function (_child, _newChild) {
                            return  _newChild.operate.charCodeAt(0) - _child.operate.charCodeAt(0)
                        });
                        vc.component.contractChangeDetailsInfo.contractDetails = _contractChangeManageInfo.data;

                        
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
