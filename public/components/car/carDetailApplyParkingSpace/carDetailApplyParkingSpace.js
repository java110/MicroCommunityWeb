/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            carDetailApplyParkingSpaceInfo: {
                parkingSpaceApplys: [],
                carId: '',
                carNum:'',
                memberId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('carDetailApplyParkingSpace', 'switch', function (_data) {
                $that.carDetailApplyParkingSpaceInfo.carId = _data.carId;
                $that.carDetailApplyParkingSpaceInfo.carNum = _data.carNum;
                $that.carDetailApplyParkingSpaceInfo.memberId = _data.memberId;
                $that._loadCarDetailApplyParkingSpaceData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('carDetailApplyParkingSpace', 'notify',
                function (_data) {
                    $that._loadCarDetailApplyParkingSpaceData(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('carDetailApplyParkingSpace', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadCarDetailApplyParkingSpaceData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadCarDetailApplyParkingSpaceData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        carNum: $that.carDetailApplyParkingSpaceInfo.carNum,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingSpaceApply.listParkingSpaceApply',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        vc.component.carDetailApplyParkingSpaceInfo.parkingSpaceApplys = _roomInfo.data;
                        vc.emit('carDetailApplyParkingSpace', 'paginationPlus', 'init', {
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
            _qureyCarDetailApplyParkingSpace: function () {
                $that._loadCarDetailApplyParkingSpaceData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddParkingSpaceApplyModal: function () {
                //vc.emit('addParkingSpaceApply','openAddParkingSpaceApplyModal',{});
                vc.jumpToPage('/#/pages/property/addParkingSpaceApply')
            },
            _openAuditParkingSpaceApplyModal: function (_apply) {
                vc.jumpToPage('/#/pages/property/auditParkingSpaceApply?applyId=' + _apply.applyId)
            },
            _openEditParkingSpaceApplyModel: function (_parkingSpaceApply) {
                vc.emit('editParkingSpaceApply', 'openEditParkingSpaceApplyModal', _parkingSpaceApply);
            },
            _openDeleteParkingSpaceApplyModel: function (_parkingSpaceApply) {
                vc.emit('deleteParkingSpaceApply', 'openDeleteParkingSpaceApplyModal', _parkingSpaceApply);
            },
            _getParkingSpaceApplyState: function (_state) {
                if (_state == '1001') {
                    return '待审核';
                } else if (_state == '2002') {
                    return '待缴费';
                } else if (_state == '3003') {
                    return '完成';
                } else if (_state == '4004') {
                    return '审核失败';
                }
                return '状态异常';
            },
            _getParkingSpaceApplyCatType: function (_type) {
                if (_type == '9901') {
                    return '家用小汽车';
                } else if (_type == '9902') {
                    return '客车';
                } else if (_type == '9903') {
                    return '货车';
                }
                return '异常车辆';
            }
        }
    });
})(window.vc);