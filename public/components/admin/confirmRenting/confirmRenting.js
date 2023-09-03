(function (vc, vm) {

    vc.extends({
        data: {
            confirmRentingInfo: {
                msg: '',
                appointmentId: '',
                tenantName: '',
                communityId: '',
                communitys: [],
                rentingPools: [],
                rentingId: ''
            }
        },
        _initMethod: function () {
            $that._loadCommunitys();
        },
        _initEvent: function () {
            vc.on('confirmRenting', 'openConfirmRentingModal', function (_params) {

                //vc.component.confirmRentingInfo = _params;
                vc.copyObject(_params, $that.confirmRentingInfo);
                $('#confirmRentingModel').modal('show');

            });
        },
        methods: {
            confirmRenting: function () {

                let data = {
                    appointmentId: $that.confirmRentingInfo.appointmentId,
                    rentingId: $that.confirmRentingInfo.rentingId
                };


                vc.http.apiPost(
                    '/rentingAppointment/confirmRenting',
                    JSON.stringify(data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#confirmRentingModel').modal('hide');
                            $that._clearRentingAppointment();
                            vc.emit('rentingAppointmentManage', 'listRentingAppointment', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);

                    });
            },
            closeConfirmRentingModel: function () {
                $('#confirmRentingModel').modal('hide');
            },
            _clearRentingAppointment: function () {
                let _communitys = $that.confirmRentingInfo.communitys;
                $that.confirmRentingInfo = {
                    msg: '',
                    appointmentId: '',
                    tenantName: '',
                    communityId: '',
                    communitys: _communitys,
                    rentingPools: [],
                    rentingId: ''
                }
            },
            _loadCommunitys: function () {
                let param = {
                    params: {
                        _uId: 'ccdd00opikookjuhyyttvhnnjuuu',
                        page: 1,
                        row: 50
                    }
                };
                vc.http.get('initData',
                    'getCommunitys',
                    param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _communityInfos = JSON.parse(json).communitys;
                            $that.confirmRentingInfo.communitys = _communityInfos;
                        }
                    }, function () {
                        console.log('请求失败处理');
                        vc.jumpToPage(_param.url);
                    }
                );
            },
            _changeCommunity: function () {
                $that._listRentingPoolsByConfirmRenting();
            },
            _listRentingPoolsByConfirmRenting: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.confirmRentingInfo.communityId,
                        state: '1,2,3,4,5'
                    }
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingPool',
                    param,
                    function (json, res) {
                        var _rentingPoolManageInfo = JSON.parse(json);
                        vc.component.confirmRentingInfo.rentingPools = _rentingPoolManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);
