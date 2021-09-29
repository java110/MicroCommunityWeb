/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaManageInfo: {
                parkingAreas: [],
                total: 0,
                records: 1,
                moreCondition: false,
                num: '',
                listColumns: [],
                conditions: {
                    num: '',
                    typeCd: '',
                    paId: ''
                }
            }
        },
        _initMethod: function () {
            
            $that._getColumns(function () {
                vc.component._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {
            vc.on('parkingAreaManage', 'listParkingArea',
                function (_param) {
                    vc.component._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
                });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    vc.component._listParkingAreas(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listParkingAreas: function (_page, _rows) {
                vc.component.parkingAreaManageInfo.conditions.page = _page;
                vc.component.parkingAreaManageInfo.conditions.row = _rows;
                vc.component.parkingAreaManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.parkingAreaManageInfo.conditions
                };
                //发送get请求
                vc.http.get('parkingAreaManage', 'list', param,
                    function (json, res) {
                        var _parkingAreaManageInfo = JSON.parse(json);
                        vc.component.parkingAreaManageInfo.total = _parkingAreaManageInfo.total;
                        vc.component.parkingAreaManageInfo.records = _parkingAreaManageInfo.records;
                        vc.component.parkingAreaManageInfo.parkingAreas = _parkingAreaManageInfo.parkingAreas;
                        $that.dealParkingAreaAttr(_parkingAreaManageInfo.parkingAreas);
                        vc.emit('pagination', 'init', {
                            total: vc.component.parkingAreaManageInfo.records,
                            dataCount: vc.component.parkingAreaManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _openAddParkingAreaModal: function () {
                vc.emit('addParkingArea', 'openAddParkingAreaModal', {});
            },
            _openEditParkingAreaModel: function (_parkingArea) {
                vc.emit('editParkingArea', 'openEditParkingAreaModal', _parkingArea);
            },
            _openDeleteParkingAreaModel: function (_parkingArea) {
                vc.emit('deleteParkingArea', 'openDeleteParkingAreaModal', _parkingArea);
            },
            _queryParkingAreaMethod: function () {
                vc.component._listParkingAreas(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.parkingAreaManageInfo.moreCondition) {
                    vc.component.parkingAreaManageInfo.moreCondition = false;
                } else {
                    vc.component.parkingAreaManageInfo.moreCondition = true;
                }
            },
            dealParkingAreaAttr: function (parkingAreas) {
                parkingAreas.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_parkingArea) {
                _parkingArea.listValues = [];
                console.log('attr',_parkingArea)
                if (!_parkingArea.hasOwnProperty('attrs') || _parkingArea.attrs.length < 1) {
                    $that.parkingAreaManageInfo.listColumns.forEach(_value => {
                        _parkingArea.listValues.push('');
                    })
                    return;
                }
                let _parkingAreaAttrDtos = _parkingArea.attrs;
                $that.parkingAreaManageInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _parkingAreaAttrDtos.forEach(_attrItem => {
                        if (_value.specCd == _attrItem.specCd) {
                            _tmpValue = _attrItem.value;
                        }
                    })
                    _parkingArea.listValues.push(_tmpValue);
                })
            },
            _getColumns: function (_call) {
                console.log('_getColumns');
                $that.parkingAreaManageInfo.listColumns = [];
                vc.getAttrSpec('parking_area_attr', function (data) {
                    $that.parkingAreaManageInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.parkingAreaManageInfo.listColumns.push({
                                specCd: item.specCd,
                                specName: item.specName
                            });
                        }
                    });
                    _call();
                });
            },
            _openParkingAreaText:function(_parkingArea){
                vc.jumpToPage('/admin.html#/pages/property/parkingAreaText?paId='+_parkingArea.paId)
            },
            _openParkingAreaControl:function(_parkingArea){

            }
        }
    });
})(window.vc);