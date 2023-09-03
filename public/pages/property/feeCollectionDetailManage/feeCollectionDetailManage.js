/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeCollectionDetailManageInfo: {
                feeCollectionDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                orderId: '',
                conditions: {
                    ownerName: '',
                    payerObjName: '',
                    collectionWay: '',
                    orderId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that.feeCollectionDetailManageInfo.conditions.orderId = vc.getParam('orderId');
            vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('feeCollectionDetailManage', 'listFeeCollectionOrder', function (_param) {
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeCollectionOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeCollectionOrders: function (_page, _rows) {
                vc.component.feeCollectionDetailManageInfo.conditions.page = _page;
                vc.component.feeCollectionDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeCollectionDetailManageInfo.conditions
                };
                param.params.ownerName = param.params.ownerName.trim();
                param.params.payerObjName = param.params.payerObjName.trim();
                //发送get请求
                vc.http.apiGet('/feeCollectionDetail/queryFeeCollectionDetail',
                    param,
                    function (json, res) {
                        var _feeCollectionDetailManageInfo = JSON.parse(json);
                        vc.component.feeCollectionDetailManageInfo.total = _feeCollectionDetailManageInfo.total;
                        vc.component.feeCollectionDetailManageInfo.records = _feeCollectionDetailManageInfo.records;
                        vc.component.feeCollectionDetailManageInfo.feeCollectionDetails = _feeCollectionDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeCollectionDetailManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryFeeCollectionOrderMethod: function () {
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetFeeCollectionOrderMethod: function () {
                vc.component.feeCollectionDetailManageInfo.conditions.ownerName = "";
                vc.component.feeCollectionDetailManageInfo.conditions.payerObjName = "";
                vc.component.feeCollectionDetailManageInfo.conditions.collectionWay = "";
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.feeCollectionDetailManageInfo.moreCondition) {
                    vc.component.feeCollectionDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.feeCollectionDetailManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
