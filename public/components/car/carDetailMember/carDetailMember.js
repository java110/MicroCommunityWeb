/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailMemberInfo: {
                ownerCars: [],
                carId: '',
                carNum:'',
                memberId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailMember', 'switch', function (_data) {
                $that.carDetailMemberInfo.carId = _data.carId;
                $that.carDetailMemberInfo.carNum = _data.carNum;
                $that.carDetailMemberInfo.memberId = _data.memberId;
                $that._loadCarDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailMember', 'notify',
                function (_data) {
                    $that._loadCarDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailMember', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailMemberData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailMemberData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carId: $that.carDetailMemberInfo.carId,
                        carTypeCd: '1002',
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/owner.queryOwnerCars',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailMemberInfo.ownerCars = _roomInfo.data;
                        vc.emit('carDetailMember', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyCarDetailMember: function () {
                $that._loadCarDetailMemberData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _addOwnerCarMember: function () {
                vc.emit('addCarModal', 'openAddCarModel', {
                    carId: $that.carDetailMemberInfo.carId
                });
            },
            _openEditOwnerCar: function (_car) {
                vc.emit('editMemberCar', 'openEditCar', _car);
            },
            _openDelOwnerCarModel: function (_car) {
                vc.emit('deleteOwnerCar', 'openOwnerCarModel', _car);
            },
            _viewIotStateRemark:function(_car){
                let _data = {
                    "同步说明": _car.iotRemark
                };
                vc.emit('viewData', 'openViewDataModal', {
                    title: _car.carNum + " 同步物联网详情",
                    data: _data
                });
            }
        }
    });
})(window.vc);