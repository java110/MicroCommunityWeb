/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataMonthReceivedStatisticsInfo: {
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
                $that.dataMonthReceivedStatisticsInfo.feeTypeCds = _data;
                $that.dataMonthReceivedStatisticsInfo.feeTypeCd = _data[0].statusCd;
            });
            $that._loadMonthReceivedFloors();
        },
        _initEvent: function () {
            vc.on('dataMonthReceivedStatistics', 'switch', function (_data) {
                 $that.dataMonthReceivedStatisticsInfo.feeStartDate = _data.startDate;
                 $that.dataMonthReceivedStatisticsInfo.feeEndDate = _data.endDate;
                 setTimeout(function(){
                    $that._initMonthReceivedDate();
                 },1000);
               
                $that._qureyDataMonthReceivedStatistics(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('dataMonthReceivedStatistics', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadDataMonthReceivedStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataMonthReceivedStatistics', 'notify', function (_data) {
                $that._loadDataMonthReceivedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _initMonthReceivedDate: function () {
                vc.initDate('feeStartDate', function (_value) {
                    $that.dataMonthReceivedStatisticsInfo.feeStartDate = _value;
                });
                vc.initDate('feeEndDate', function (_value) {
                    $that.dataMonthReceivedStatisticsInfo.feeEndDate = _value;
                });
            },
            _loadDataMonthReceivedStatisticsData: function (_page,_row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeStartDate: $that.dataMonthReceivedStatisticsInfo.feeStartDate,
                        feeEndDate: $that.dataMonthReceivedStatisticsInfo.feeEndDate,
                        feeTypeCd: $that.dataMonthReceivedStatisticsInfo.feeTypeCd,
                        floorId: $that.dataMonthReceivedStatisticsInfo.floorId,
                    }
                };

                //发送get请求
                vc.http.apiGet('/dataReport.queryMonthReceivedDetail',
                    param,
                    function (json) {
                        let _json = JSON.parse(json);
                        $that.dataMonthReceivedStatisticsInfo.fees =  _json.data;
                        $that.dataMonthReceivedStatisticsInfo.feeAmount = _json.sumTotal;
                        vc.emit('dataMonthReceivedStatistics', 'paginationPlus', 'init', {
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
            _loadMonthReceivedFloors: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                $that.dataMonthReceivedStatisticsInfo.fees = [];
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function (json, res) {
                        let listFloorData = JSON.parse(json);

                        let _floors = listFloorData.apiFloorDataVoList;
                        $that.dataMonthReceivedStatisticsInfo.floors = _floors;

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataMonthReceivedStatistics: function () {
                $that._loadDataMonthReceivedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _exportReportMonthReceivedFeeExcel: function () {
               
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeStartDate: $that.dataMonthReceivedStatisticsInfo.feeStartDate,
                        feeEndDate: $that.dataMonthReceivedStatisticsInfo.feeEndDate,
                        feeTypeCd: $that.dataMonthReceivedStatisticsInfo.feeTypeCd,
                        floorId: $that.dataMonthReceivedStatisticsInfo.floorId,
                        pagePath: 'dataMonthReceivedStatistics'
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
            switchMonthReceivedStatisticsFeeTypeCd: function (_feeTypeCd) {
                $that.dataMonthReceivedStatisticsInfo.feeTypeCd = _feeTypeCd;
                $that._loadDataMonthReceivedStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            }
        }
    });
})(window.vc);