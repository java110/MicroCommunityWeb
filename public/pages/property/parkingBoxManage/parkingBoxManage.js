/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingBoxManageInfo: {
                parkingBoxs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                boxId: '',
                conditions: {
                    boxId: '',
                    boxName: '',
                    tempCarIn: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('parkingBoxManage', 'listParkingBox', function (_param) {
                vc.component._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listParkingBoxs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingBoxs: function (_page, _rows) {

                vc.component.parkingBoxManageInfo.conditions.page = _page;
                vc.component.parkingBoxManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.parkingBoxManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/parkingBox.listParkingBox',
                    param,
                    function (json, res) {
                        var _parkingBoxManageInfo = JSON.parse(json);
                        vc.component.parkingBoxManageInfo.total = _parkingBoxManageInfo.total;
                        vc.component.parkingBoxManageInfo.records = _parkingBoxManageInfo.records;
                        vc.component.parkingBoxManageInfo.parkingBoxs = _parkingBoxManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingBoxManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddParkingBoxModal: function () {
                vc.emit('addParkingBox', 'openAddParkingBoxModal', {});
            },
            _openEditParkingBoxModel: function (_parkingBox) {
                vc.emit('editParkingBox', 'openEditParkingBoxModal', _parkingBox);
            },
            _openDeleteParkingBoxModel: function (_parkingBox) {
                vc.emit('deleteParkingBox', 'openDeleteParkingBoxModal', _parkingBox);
            },
            _queryParkingBoxMethod: function () {
                vc.component._listParkingBoxs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.parkingBoxManageInfo.moreCondition) {
                    vc.component.parkingBoxManageInfo.moreCondition = false;
                } else {
                    vc.component.parkingBoxManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);