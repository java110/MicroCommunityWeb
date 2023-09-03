(function(vc) {
    vc.extends({
        data: {
            downloadCollectionLetterOrderInfo: {
                floors: [],
                floorId:'',
                roomId:''
            }
        },
        _initMethod: function() {
           
        },
        _initEvent: function() {
            vc.on('downloadCollectionLetterOrder', 'openExportExcel',
                function(_room) {
                    $that.clearRoomCreateFeeAddData();
                    $that._loadDownloadCollectionLetterFloors();
                    $that.downloadCollectionLetterOrderInfo.roomId = _room.roomId;
                    $('#downloadCollectionLetterOrderModel').modal('show');
                });
        },
        methods: {
            _loadDownloadCollectionLetterFloors: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                }
                vc.http.apiGet(
                    '/floor.queryFloors',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.downloadCollectionLetterOrderInfo.floors = _json.apiFloorDataVoList;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearRoomCreateFeeAddData: function() {
                $that.downloadCollectionLetterOrderInfo = {
                    floors: [],
                    floorId:'',
                    roomId:''
                };
            },
            _exportCollectionLetterExcel: function() {
                $('#downloadCollectionLetterOrderModel').modal('hide');
                let param = {
                    params: {
                        communityId:vc.getCurrentCommunity().communityId,
                        pagePath:'dataFeeManualCollection',
                        floorId:$that.downloadCollectionLetterOrderInfo.floorId,
                        roomId:$that.downloadCollectionLetterOrderInfo.roomId

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
        }
    });
})(window.vc);