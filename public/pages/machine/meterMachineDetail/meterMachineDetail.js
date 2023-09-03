/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            meterMachineDetailInfo: {
                details: [],
                total: 0,
                records: 1,
                moreCondition: false,
                machineId: '',
               
            }
        },
        _initMethod: function () {
            $that.meterMachineDetailInfo.machineId = vc.getParam('machineId');
            vc.component._listMeterMachineDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            
        },
        _initEvent: function () {
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMeterMachineDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMeterMachineDetails: function (_page, _rows) {

                let param = {
                    params: {
                        page:_page,
                        row:_rows,
                        machineId:$that.meterMachineDetailInfo.machineId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/meterMachine.listMeterMachineDetail',
                    param,
                    function (json, res) {
                        var _meterMachineDetailInfo = JSON.parse(json);
                        vc.component.meterMachineDetailInfo.total = _meterMachineDetailInfo.total;
                        vc.component.meterMachineDetailInfo.records = _meterMachineDetailInfo.records;
                        vc.component.meterMachineDetailInfo.details = _meterMachineDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.meterMachineDetailInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
         
            _queryMeterMachineDetailMethod: function () {
                vc.component._listMeterMachineDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            },
        }
    });
})(window.vc);
