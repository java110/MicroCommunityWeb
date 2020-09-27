/**
    房源 组件
**/
(function (vc) {

    vc.extends({
        data: {
            viewRentingPoolInfo: {
                index: 0,
                flowComponent: 'viewRentingPoolInfo',
                rentingTitle: '',
                price: '',
                paymentType: '',
                checkInDate: '',
                rentingConfigId: '',
                rentingDesc: '',
                ownerName: '',
                ownerTel: '',
                paymentTypeName: '',
                roomName: '',
                serviceOwnerFee: 0.0,
                serviceTenantFee: 0.0
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadRentingPoolInfoData();


        },
        _initEvent: function () {
            vc.on('viewRentingPoolInfo', 'chooseRentingPool', function (_app) {
                vc.copyObject(_app, vc.component.viewRentingPoolInfo);
            });

            vc.on('viewRentingPoolInfo', 'onIndex', function (_index) {
                vc.component.viewRentingPoolInfo.index = _index;
            });
        },
        methods: {

            _openSelectRentingPoolInfoModel() {
                vc.emit('chooseRentingPool', 'openChooseRentingPoolModel', {});
            },
            _openAddRentingPoolInfoModel() {
                vc.emit('addRentingPool', 'openAddRentingPoolModal', {});
            },
            _loadRentingPoolInfoData: function () {
                let _rentingId = vc.getParam('rentingId');
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 1,
                        rentingId: _rentingId
                    }
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingPool',
                    param,
                    function (json, res) {
                        var _rentingPoolManageInfo = JSON.parse(json);
                        let total = _rentingPoolManageInfo.total;

                        if (total < 1) {
                            vc.toast('未查询到 房屋出租信息');
                            return;
                        }
                        vc.copyObject(_rentingPoolManageInfo.data[0], $that.viewRentingPoolInfo);

                        let _data = _rentingPoolManageInfo.data[0];

                        let _rentingFormula = _data.rentingFormula;
                        //收费计算公式,1001 固定值 ，2002 每月租金比例
                        if (_rentingFormula == '1001') {
                            $that.viewRentingPoolInfo.serviceOwnerFee = (_data.servicePrice * _data.serviceOwnerRate).toFixed(2);
                            $that.viewRentingPoolInfo.serviceTenantFee = (_data.servicePrice * _data.serviceTenantRate).toFixed(2);
                        } else {
                            let _monthPrice = _data.price;
                            $that.viewRentingPoolInfo.serviceOwnerFee = (_monthPrice * _data.servicePrice * _data.serviceOwnerRate).toFixed(2);
                            $that.viewRentingPoolInfo.serviceTenantFee = (_monthPrice * _data.servicePrice * _data.serviceTenantRate).toFixed(2);
                        }

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
