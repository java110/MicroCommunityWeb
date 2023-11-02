/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataReportFeeStatisticsInfo: {
                fees: [],
                feeTypeCds: [],
                floors: [],
                ownerId: '',
                roomNum: '',
                startDate: '',
                endDate: '',
                feeTypeCd: '',
                communityId:'',
                feeAmount: '0'
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd_show", function(_data) {
                $that.dataReportFeeStatisticsInfo.feeTypeCds = _data;
                $that.dataReportFeeStatisticsInfo.feeTypeCd = _data[0].statusCd;
            });
        },
        _initEvent: function() {
            vc.on('dataReportFeeStatistics', 'switch', function(_data) {
                $that.dataReportFeeStatisticsInfo.startDate = _data.startDate;
                $that.dataReportFeeStatisticsInfo.endDate = _data.endDate;
                $that.dataReportFeeStatisticsInfo.communityId = _data.communityId;
                // $that._loadDataReportFeeStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
                $that._loadFloors();
            });
            vc.on('dataReportFeeStatistics', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadDataReportFeeStatisticsData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('dataReportFeeStatistics', 'notify', function(_data) {
                $that._loadDataReportFeeStatisticsData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadDataReportFeeStatisticsData: function(_floorIds) {
                let param = {
                    params: {
                        communityId: $that.dataReportFeeStatisticsInfo.communityId,
                        startDate: $that.dataReportFeeStatisticsInfo.startDate,
                        endDate: $that.dataReportFeeStatisticsInfo.endDate,
                        feeTypeCd: $that.dataReportFeeStatisticsInfo.feeTypeCd,
                        floorIds: _floorIds,
                    }
                };

                //发送get请求
                vc.http.apiGet('/dataReport.queryDataReportFeeStatistics',
                    param,
                    function(json) {
                        let _json = JSON.parse(json);
                        _json.data.forEach(item => {
                            $that.dataReportFeeStatisticsInfo.fees.push(item);
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadFloors: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: $that.dataReportFeeStatisticsInfo.communityId
                    }
                };
                $that.dataReportFeeStatisticsInfo.fees = [];
                //发送get请求
                vc.http.apiGet('/floor.queryFloors',
                    param,
                    function(json, res) {
                        let listFloorData = JSON.parse(json);

                        let _floors = listFloorData.apiFloorDataVoList;
                        $that.dataReportFeeStatisticsInfo.floors = _floors;
                        let _floorIds = [];
                        for (let _floorIndex = 0; _floorIndex < _floors.length; _floorIndex++) {
                            _floorIds.push(_floors[_floorIndex].floorId);
                            if (_floorIds.length >= 5) {
                                $that._loadDataReportFeeStatisticsData(_floorIds.join(','));
                                _floorIds = [];
                            }
                        }

                        if (_floorIds.length > 0) {
                            $that._loadDataReportFeeStatisticsData(_floorIds.join(','));
                        }

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyDataReportFeeStatistics: function() {
                $that._loadFloors();
            },
            _exportReportFeeExcel: function() {
                let _floorIds = [];
                let _floors = $that.dataReportFeeStatisticsInfo.floors;
                for (let _floorIndex = 0; _floorIndex < _floors.length; _floorIndex++) {
                    _floorIds.push(_floors[_floorIndex].floorId);
                }
                if (!_floorIds || _floorIds.length < 1) {
                    vc.toast('没有可以导出的数据');
                    return;
                }
                let param = {
                    params: {
                        communityId: $that.dataReportFeeStatisticsInfo.communityId,
                        startDate: $that.dataReportFeeStatisticsInfo.startDate,
                        endDate: $that.dataReportFeeStatisticsInfo.endDate,
                        feeTypeCd: $that.dataReportFeeStatisticsInfo.feeTypeCd,
                        floorIds: _floorIds.join(','),
                        pagePath: 'dataReportFeeStatistics'
                    }
                };
                //发送get请求
                vc.http.apiGet('/export.exportData', param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.jumpToPage('/#/pages/property/downloadTempFile?tab=下载中心')
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            swatchFeeStatisticsFeeTypeCd:function(_feeTypeCd){
                $that.dataReportFeeStatisticsInfo.feeTypeCd = _feeTypeCd;
                $that._loadFloors();
            }
        }
    });
})(window.vc);