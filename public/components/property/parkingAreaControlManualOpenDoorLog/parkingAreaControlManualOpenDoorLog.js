/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlManualOpenDoorLog: {
                logs: [],
                boxId: '',
                staffName: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('parkingAreaControlManualOpenDoorLog', 'switch', function(_data) {
                $that.parkingAreaControlManualOpenDoorLog.boxId = _data.boxId;
                $that._loadParkingAreaControlManualOpenDoorLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlManualOpenDoorLog', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlManualOpenDoorLogs(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlManualOpenDoorLogs: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlManualOpenDoorLog.boxId,
                        staffName: $that.parkingAreaControlManualOpenDoorLog.staffName,
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.getManualOpenDoorLogs',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        $that.parkingAreaControlManualOpenDoorLog.total = _json.total;
                        $that.parkingAreaControlManualOpenDoorLog.records = _json.records;
                        $that.parkingAreaControlManualOpenDoorLog.logs = _json.data;
                        vc.emit('parkingAreaControlManualOpenDoorLog', 'paginationPlus', 'init', {
                            total: $that.parkingAreaControlManualOpenDoorLog.records,
                            dataCount: $that.parkingAreaControlManualOpenDoorLog.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlManualOpenDoorLog: function() {
                $that._loadParkingAreaControlManualOpenDoorLogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDoorLogOpenFile: function(_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },

        }
    });
})(window.vc);