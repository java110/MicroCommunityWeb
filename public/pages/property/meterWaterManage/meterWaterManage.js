/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            meterWaterManageInfo: {
                meterWaters: [],
                total: 0,
                records: 1,
                moreCondition: false,
                waterId: '',
                conditions: {
                    waterId: '',
                    meterType: '',
                    roomNum: '',

                }
            }
        },
        _initMethod: function () {
            vc.component._listMeterWaters(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('meterWaterManage', 'listMeterWater', function (_param) {
                vc.component._listMeterWaters(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMeterWaters(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMeterWaters: function (_page, _rows) {

                vc.component.meterWaterManageInfo.conditions.page = _page;
                vc.component.meterWaterManageInfo.conditions.row = _rows;
                vc.component.meterWaterManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.meterWaterManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('meterWater.listMeterWaters',
                    param,
                    function (json, res) {
                        var _meterWaterManageInfo = JSON.parse(json);
                        vc.component.meterWaterManageInfo.total = _meterWaterManageInfo.total;
                        vc.component.meterWaterManageInfo.records = _meterWaterManageInfo.records;
                        vc.component.meterWaterManageInfo.meterWaters = _meterWaterManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.meterWaterManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {});
            },
            _openEditMeterWaterModel: function (_meterWater) {
                vc.emit('editMeterWater', 'openEditMeterWaterModal', _meterWater);
            },
            _openDeleteMeterWaterModel: function (_meterWater) {
                vc.emit('deleteMeterWater', 'openDeleteMeterWaterModal', _meterWater);
            },
            _queryMeterWaterMethod: function () {
                vc.component._listMeterWaters(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.meterWaterManageInfo.moreCondition) {
                    vc.component.meterWaterManageInfo.moreCondition = false;
                } else {
                    vc.component.meterWaterManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);
