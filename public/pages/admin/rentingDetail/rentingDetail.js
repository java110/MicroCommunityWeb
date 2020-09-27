/**
    房源 组件
**/
(function (vc) {

    vc.extends({
        data: {
            rentingDetailInfo: {
                rentingFlows:[],
                fees:[]
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            $that._loadRentingFlow();
            $that._loadRentingFee();
        },
        _initEvent: function () {
          

        },
        methods: {

            _loadRentingFlow:function(){
                let _rentingId = vc.getParam('rentingId');

                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50,
                        rentingId: _rentingId
                    }
                };

                //发送get请求
                vc.http.apiGet('/rentingPoolFlow/queryRentingPoolFlow',
                    param,
                    function (json, res) {
                        var _rentingFlow = JSON.parse(json);
                        let total = _rentingFlow.total;
                        if (total < 1) {
                            return;
                        }
                        $that.rentingDetailInfo.rentingFlows = _rentingFlow.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadRentingFee:function(){
                let _rentingId = vc.getParam('rentingId');

                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50,
                        rentingId: _rentingId
                    }
                };

                //发送get请求
                vc.http.apiGet('/rentingFee/queryFee',
                    param,
                    function (json, res) {
                        var _rentingFlow = JSON.parse(json);
                        let total = _rentingFlow.total;
                        if (total < 1) {
                            return;
                        }
                        $that.rentingDetailInfo.fees = _rentingFlow.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getUserRole:function(_userRole){

                if(_userRole == 1){
                    return "业主";
                }else if(_userRole == 2){
                    return "租客";
                }{
                    return "运营团队";
                }
            }

          
        }
    });

})(window.vc);