/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            rentingPoolManageInfo: {
                rentingPools: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rentingId: '',
                conditions: {
                    rentingTitle: '',
                    paymentType: '',
                    ownerName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    state: '1,2,3,4,5,7'
                }
            }
        },
        _initMethod: function () {
            vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('rentingPoolManage', 'listRentingPool', function (_param) {
                vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listRentingPools(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listRentingPools: function (_page, _rows) {

                vc.component.rentingPoolManageInfo.conditions.page = _page;
                vc.component.rentingPoolManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.rentingPoolManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/renting/queryRentingPool',
                    param,
                    function (json, res) {
                        var _rentingPoolManageInfo = JSON.parse(json);
                        vc.component.rentingPoolManageInfo.total = _rentingPoolManageInfo.total;
                        vc.component.rentingPoolManageInfo.records = _rentingPoolManageInfo.records;
                        vc.component.rentingPoolManageInfo.rentingPools = _rentingPoolManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.rentingPoolManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _listRentingFlow: function (_rentingPool, _callBack) {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: _rentingPool.communityId,
                        rentingId: _rentingPool.rentingId,
                        state: '4004'
                    }
                };

                //发送get请求
                vc.http.apiGet('/rentingPoolFlow/queryRentingPoolFlow',
                    param,
                    function (json, res) {
                        let _rentingPoolFlow = JSON.parse(json);
                        if (_rentingPoolFlow.total < 1) {
                            vc.total('未找到租房者信息');
                            return;
                        }
                        _callBack(_rentingPoolFlow.data[0]);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRentingPoolModal: function () {
                vc.emit('addRentingPool', 'openAddRentingPoolModal', {});
            },
            _openEditRentingPoolModel: function (_rentingPool) {
                vc.emit('editRentingPool', 'openEditRentingPoolModal', _rentingPool);
            },
            _openDeleteRentingPoolModel: function (_rentingPool) {
                vc.emit('deleteRentingPool', 'openDeleteRentingPoolModal', _rentingPool);
            },
            _queryRentingPoolMethod: function () {
                vc.component._listRentingPools(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.rentingPoolManageInfo.moreCondition) {
                    vc.component.rentingPoolManageInfo.moreCondition = false;
                } else {
                    vc.component.rentingPoolManageInfo.moreCondition = true;
                }
            },
            _openRentingPayModel: function (_rentingPool, _userRole) {
                _rentingPool.userRole = _userRole;
                vc.emit('rentingPay', 'openRentingPayModal', _rentingPool);
            },
            _applyContract: function (_rentingPool) { //申请合同
                let _loginUser = vc.getData('/nav/getUserInfo');
                $that._listRentingFlow(_rentingPool,function(_flow){
                    vc.emit('addContract', 'openAddContractModal', {
                        contractName: _rentingPool.roomName + "租房合同",
                        partyA: _rentingPool.ownerName,
                        aContacts: _rentingPool.ownerName,
                        aLink: _rentingPool.ownerTel,
                        roomId: _rentingPool.roomId,
                        ownerName: _rentingPool.ownerName,
                        link: _rentingPool.ownerTel,
                        objId: _rentingPool.roomId,
                        allNum: _rentingPool.roomName,
                        partyB:_flow.useName,
                        bContacts:_flow.useName,
                        bLink:_flow.userTel,
                        operator: _loginUser.name
                    })
                });  

            }


        }
    });
})(window.vc);
