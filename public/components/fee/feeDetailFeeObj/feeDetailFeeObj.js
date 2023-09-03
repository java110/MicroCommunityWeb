/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailFeeObjInfo: {
                feeObjs: [],
                configId:'',
                payerObjType:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailFeeObj', 'switch', function (_data) {
                $that.feeDetailFeeObjInfo.configId = _data.configId;
                $that._loadFeeDetailFeeObjData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailFeeObj', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailFeeObjData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailFeeObjData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        configId:$that.feeDetailFeeObjInfo.configId,
                        payerObjType:$that.feeDetailFeeObjInfo.payerObjType,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/feeConfig.listConfigFeeObjs',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailFeeObjInfo.feeObjs = _roomInfo.data;
                        vc.emit('feeDetailFeeObj', 'paginationPlus', 'init', {
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
            _qureyFeeDetailFeeObj: function () {
                $that._loadFeeDetailFeeObjData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);