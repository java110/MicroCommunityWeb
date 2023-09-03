/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataMonthOweStatisticsInfo: {
                fees: [],
                feeTypeCds: [],
                floors: [],
                floorId: '',
                ownerId: '',
                roomNum: '',
                feeStartDate: '',
                feeEndDate: '',
                feeTypeCd: '',
                feeAmount: '0'
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function (_data) {
                $that.dataMonthOweStatisticsInfo.feeTypeCds = _data;
                $that.dataMonthOweStatisticsInfo.feeTypeCd = _data[0].statusCd;
            });
            $that._loadMonthOweFloors();
        },
        _initEvent: function () {
            vc.on('dataMonthOweStatistics', 'switch', function (_data) {
                 $that.dataMonthOweStatisticsInfo.feeStartDate = _data.startDate;
                 $that.dataMonthOweStatisticsInfo.feeEndDate = _data.endDate;
                setTimeout(function(){
                    $that._initMonthOweDate();
                 },1000);
                $that._qureyDataMonthOweStatistics(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('dataMonthOweStatistics', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadDataMonthOweStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataMonthOweStatistics', 'notify', function (_data) {
                $that._loadDataMonthOweStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _initMonthOweDate: function () {
                vc.initDate('feeOweStartDate', function (_value) {
                    $that.dataMonthOweStatisticsInfo.feeStartDate = _value;
                });
                vc.initDate('feeOweEndDate', function (_value) {
                    $that.dataMonthOweStatisticsInfo.feeEndDate = _value;
                });
            },
            _loadDataMonthOweStatisticsData: function (_page,_row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeStartDate: $that.dataMonthOweStatisticsInfo.feeStartDate,
                        feeEndDate: $that.dataMonthOweStatisticsInfo.feeEndDate,
                        feeTypeCd: $that.dataMonthOweStatisticsInfo.feeTypeCd,
                        floorId: $that.dataMonthOweStatisticsInfo.floorId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/dataReport.queryMonthOweDetail',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.dataMonthOweStatisticsInfo.fees =  _json.data;
                        $that.dataMonthOweStatisticsInfo.feeAmount = _json.sumTotal;
                        vc.emit('dataMonthOweStatistics', 'paginationPlus', 'init', {
                            total: _json.records,
                            dataCount: _json.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadMonthOweFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                $that.dataMonthOweStatisticsInfo.fees = [];
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function (json, res) {
                        let listFloorData = JSON.parse(json);

                        let _floors = listFloorData.apiFloorDataVoList;
                        $that.dataMonthOweStatisticsInfo.floors = _floors;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataMonthOweStatistics: function () {
                $that._loadDataMonthOweStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportReportMonthOweFeeExcel: function () {
                
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeStartDate: $that.dataMonthOweStatisticsInfo.feeStartDate,
                        feeEndDate: $that.dataMonthOweStatisticsInfo.feeEndDate,
                        feeTypeCd: $that.dataMonthOweStatisticsInfo.feeTypeCd,
                        floorId: $that.dataMonthOweStatisticsInfo.floorId,
                        pagePath: 'dataMonthOweStatistics'
                    }
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _switchMonthOweStatisticsFeeTypeCd: function (_feeTypeCd) {
                $that.dataMonthOweStatisticsInfo.feeTypeCd = _feeTypeCd;
                $that._loadDataMonthOweStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);