/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyMeterWaterFeeInfo: {
                meterWaters: [],
                roomId: '',
                roomName: '',
                name: '',
                floorNum: '',
                unitNum: '',
                roomNum: '',
                meterType: ""
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyMeterWaterFee', 'switch', function (_param) {
                console.log('onload params : ',_param);
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyMeterWaterFeeInfo();
                vc.copyObject(_param, $that.simplifyMeterWaterFeeInfo)
                $that._listSimplifyMeterWaterFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });

            vc.on('simplifyMeterWaterFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listSimplifyMeterWaterFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyMeterWaterFee: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomNum: $that.simplifyMeterWaterFeeInfo.floorNum + '-' + $that.simplifyMeterWaterFeeInfo.unitNum + '-' + $that.simplifyMeterWaterFeeInfo.roomNum,
                        meterType: $that.simplifyMeterWaterFeeInfo.meterType
                    }
                };

                //发送get请求
                vc.http.apiGet('meterWater.listMeterWaters',
                    param,
                    function (json) {
                        let _meterWaterInfo = JSON.parse(json);
                        console.log('query res : ', _meterWaterInfo.data);
                        vc.component.simplifyMeterWaterFeeInfo.total = _meterWaterInfo.total;
                        vc.component.simplifyMeterWaterFeeInfo.records = _meterWaterInfo.records;
                        vc.component.simplifyMeterWaterFeeInfo.meterWaters = _meterWaterInfo.data;
                        vc.emit('simplifyMeterWaterFee', 'paginationPlus', 'init', {
                            total: _meterWaterInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.simplifyMeterWaterFeeInfo.roomId,
                    roomName: $that.simplifyMeterWaterFeeInfo.roomName,
                    ownerName: $that.simplifyMeterWaterFeeInfo.name

                });
            },
            clearSimplifyMeterWaterFeeInfo: function () {
                $that.simplifyMeterWaterFeeInfo = {
                    meterWaters: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    roomName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    meterType: ""
                }
            },
            _getMeteTypeName: function (_meterType) {
                if (_meterType == '1010') {
                    return "电表";
                } else if (_meterType == '2020') {
                    return "水表";
                }
                return "煤气费";
            }
        }
    });
})(window.vc);
