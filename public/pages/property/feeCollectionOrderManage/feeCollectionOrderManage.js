/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeCollectionOrderManageInfo: {
                feeCollectionOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                orderId: '',
                conditions: {
                    collectionName: '',
                    staffName: '',
                    collectionWay: '',
                    state: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('feeCollectionOrderManage', 'listFeeCollectionOrder', function (_param) {
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeCollectionOrders(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeCollectionOrders: function (_page, _rows) {
                vc.component.feeCollectionOrderManageInfo.conditions.page = _page;
                vc.component.feeCollectionOrderManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeCollectionOrderManageInfo.conditions
                };
                param.params.staffName = param.params.staffName.trim();
                //发送get请求
                vc.http.apiGet('/feeCollectionOrder/queryFeeCollectionOrder',
                    param,
                    function (json, res) {
                        var _feeCollectionOrderManageInfo = JSON.parse(json);
                        vc.component.feeCollectionOrderManageInfo.total = _feeCollectionOrderManageInfo.total;
                        vc.component.feeCollectionOrderManageInfo.records = _feeCollectionOrderManageInfo.records;
                        vc.component.feeCollectionOrderManageInfo.feeCollectionOrders = _feeCollectionOrderManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeCollectionOrderManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeCollectionOrderModal: function () {
                vc.emit('addFeeCollectionOrder', 'openAddFeeCollectionOrderModal', {});
            },
            _openDeleteFeeCollectionOrderModel: function (_feeCollectionOrder) {
                vc.emit('deleteFeeCollectionOrder', 'openDeleteFeeCollectionOrderModal', _feeCollectionOrder);
            },
            //查询
            _queryFeeCollectionOrderMethod: function () {
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetFeeCollectionOrderMethod: function () {
                vc.component.feeCollectionOrderManageInfo.conditions.state = "";
                vc.component.feeCollectionOrderManageInfo.conditions.staffName = "";
                vc.component.feeCollectionOrderManageInfo.conditions.collectionWay = "";
                vc.component._listFeeCollectionOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getStateName: function (_state) {
                //状态 W 等待催缴 ，D 催缴中  F 催缴完成
                if (_state == 'W') {
                    return '待催缴';
                } else if (_state == 'D') {
                    return '催缴中';
                }
                return "催缴完成";
            },
            _getCollectionWayName: function (_collectionWay) {
                //状态 W 等待催缴 ，D 催缴中  F 催缴完成
                if (_collectionWay == '001') {
                    return '短信方式';
                } else if (_collectionWay == '002') {
                    return '短信微信方式';
                }
                return "微信方式";
            },
            _toFeeCollectionDetailModel: function (order) {
                vc.jumpToPage('/#/pages/property/feeCollectionDetailManage?orderId=' + order.orderId)
            },
            _moreCondition: function () {
                if (vc.component.feeCollectionOrderManageInfo.moreCondition) {
                    vc.component.feeCollectionOrderManageInfo.moreCondition = false;
                } else {
                    vc.component.feeCollectionOrderManageInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);