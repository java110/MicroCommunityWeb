/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingSpaceApplyManageInfo: {
                parkingSpaceApplys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                applyId: '',
                conditions: {
                    state: '',
                    carNum: '',
                    carBrand: '',
                    applyPersonName: '',
                    applyPersonLink: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listParkingSpaceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('parkingSpaceApplyManage', 'listParkingSpaceApply', function(_param) {
                vc.component._listParkingSpaceApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listParkingSpaceApplys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingSpaceApplys: function(_page, _rows) {

                vc.component.parkingSpaceApplyManageInfo.conditions.page = _page;
                vc.component.parkingSpaceApplyManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.parkingSpaceApplyManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('parkingSpaceApply.listParkingSpaceApply',
                    param,
                    function(json, res) {
                        var _parkingSpaceApplyManageInfo = JSON.parse(json);
                        vc.component.parkingSpaceApplyManageInfo.total = _parkingSpaceApplyManageInfo.total;
                        vc.component.parkingSpaceApplyManageInfo.records = _parkingSpaceApplyManageInfo.records;
                        vc.component.parkingSpaceApplyManageInfo.parkingSpaceApplys = _parkingSpaceApplyManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingSpaceApplyManageInfo.records,
                            dataCount: vc.component.parkingSpaceApplyManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddParkingSpaceApplyModal: function() {
                //vc.emit('addParkingSpaceApply','openAddParkingSpaceApplyModal',{});
                vc.jumpToPage('/#/pages/property/addParkingSpaceApply')
            },
            _openAuditParkingSpaceApplyModal: function(_apply) {
                vc.jumpToPage('/#/pages/property/auditParkingSpaceApply?applyId=' + _apply.applyId)
            },
            _openEditParkingSpaceApplyModel: function(_parkingSpaceApply) {
                vc.emit('editParkingSpaceApply', 'openEditParkingSpaceApplyModal', _parkingSpaceApply);
            },
            _openDeleteParkingSpaceApplyModel: function(_parkingSpaceApply) {
                vc.emit('deleteParkingSpaceApply', 'openDeleteParkingSpaceApplyModal', _parkingSpaceApply);
            },
            _queryParkingSpaceApplyMethod: function() {
                vc.component._listParkingSpaceApplys(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.parkingSpaceApplyManageInfo.moreCondition) {
                    vc.component.parkingSpaceApplyManageInfo.moreCondition = false;
                } else {
                    vc.component.parkingSpaceApplyManageInfo.moreCondition = true;
                }
            },
            _getState: function(_state) {
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
            _getCatType: function(_type) {
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