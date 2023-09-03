/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailConfigInfo: {
                feeConfigs: [],
                configId:'',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailConfig', 'switch', function (_data) {
                $that.feeDetailConfigInfo.configId = _data.configId;
                $that._loadFeeDetailConfigData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailConfig', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailConfigData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeDetailConfig', 'notify', function (_data) {
                $that._loadFeeDetailConfigData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFeeDetailConfigData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        configId:$that.feeDetailConfigInfo.configId,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailConfigInfo.feeConfigs = _roomInfo.feeConfigs;
                        vc.emit('feeDetailConfig', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailConfig: function () {
                $that._loadFeeDetailConfigData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);