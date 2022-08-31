/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingBoxAreaManageInfo: {
                parkingBoxAreas: [],
                total: 0,
                records: 1,
                moreCondition: false,
                boxId: '',
                boxName: ''
            }
        },
        _initMethod: function () {
            $that.parkingBoxAreaManageInfo.boxId = vc.getParam('boxId');
            $that.parkingBoxAreaManageInfo.boxName = vc.getParam('boxName');
            vc.component._listParkingBoxAreas(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('parkingBoxAreaManage', 'listParkingBoxArea', function (_param) {
                vc.component._listParkingBoxAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listParkingBoxAreas(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listParkingBoxAreas: function (_page, _rows) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        boxId: $that.parkingBoxAreaManageInfo.boxId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/parkingBoxArea.listParkingBoxArea',
                    param,
                    function (json, res) {
                        let _parkingBoxAreaManageInfo = JSON.parse(json);
                        $that.parkingBoxAreaManageInfo.total = _parkingBoxAreaManageInfo.total;
                        $that.parkingBoxAreaManageInfo.records = _parkingBoxAreaManageInfo.records;
                        $that.parkingBoxAreaManageInfo.parkingBoxAreas = _parkingBoxAreaManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingBoxAreaManageInfo.records,
                            dataCount: vc.component.parkingBoxAreaManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddParkingBoxAreaModal: function () {
                vc.emit('addParkingBoxArea', 'openAddParkingBoxAreaModal', {
                    boxId: $that.parkingBoxAreaManageInfo.boxId
                });
            },
            _openDeleteParkingBoxAreaModel: function (_parkingBoxArea) {
                vc.emit('deleteParkingBoxArea', 'openDeleteParkingBoxAreaModal', _parkingBoxArea);
            },
            _settingDefaultArea: function (_parkingBoxArea) {
                let _data = {
                    boxId: _parkingBoxArea.boxId,
                    communityId: _parkingBoxArea.communityId,
                    baId: _parkingBoxArea.baId,
                    defaultArea: 'T'
                }
                vc.http.apiPost(
                    'parkingBoxArea.updateParkingBoxArea',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.emit('parkingBoxAreaManage', 'listParkingBoxArea', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(json);
                    });
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);