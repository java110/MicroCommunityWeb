/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeManualCollectionDetailManageInfo: {
                feeManualCollectionDetails: [],
                total: 0,
                records: 1,
                moreCondition: false,
                collectionId: '',
                roomId: '',
                conditions: {
                    roomName: '',
                    ownerName: '',
                    link: '',
                    collectionId: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            let _collectionId = vc.getParam('collectionId');
            let _roomId = vc.getParam('roomId');
            $that.feeManualCollectionDetailManageInfo.conditions.collectionId = _collectionId;
            $that.feeManualCollectionDetailManageInfo.roomId = _roomId;
            vc.component._listFeeManualCollectionDetails(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('feeManualCollectionDetailManage', 'listFeeManualCollectionDetail', function (_param) {
                vc.component._listFeeManualCollectionDetails(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeManualCollectionDetails(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeManualCollectionDetails: function (_page, _rows) {

                vc.component.feeManualCollectionDetailManageInfo.conditions.page = _page;
                vc.component.feeManualCollectionDetailManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeManualCollectionDetailManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/feeManualCollection/queryCollectionDetail',
                    param,
                    function (json, res) {
                        var _feeManualCollectionDetailManageInfo = JSON.parse(json);
                        vc.component.feeManualCollectionDetailManageInfo.total = _feeManualCollectionDetailManageInfo.total;
                        vc.component.feeManualCollectionDetailManageInfo.records = _feeManualCollectionDetailManageInfo.records;
                        vc.component.feeManualCollectionDetailManageInfo.feeManualCollectionDetails = _feeManualCollectionDetailManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeManualCollectionDetailManageInfo.records,
                            dataCount: vc.component.feeManualCollectionDetailManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeManualCollectionDetailModal: function () {
                vc.emit('addFeeManualCollectionDetail', 'openAddFeeManualCollectionDetailModal', {});
            },
            _openTranslateFeeManualCollectionDetailModel: function (_feeManualCollectionDetail) {
                let _data = {
                    roomId: $that.feeManualCollectionDetailManageInfo.roomId,
                    communityId: vc.getCurrentCommunity().communityId
                }
                //重新同步房屋欠费
                vc.http.apiPost(
                    '/feeManualCollection/saveFeeManualCollection',
                    JSON.stringify(_data),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.emit('feeManualCollectionDetailManage', 'listFeeManualCollectionDetail', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _openDeleteFeeManualCollectionDetailModel: function (_feeManualCollectionDetail) {
                vc.emit('deleteFeeManualCollectionDetail','openDeleteFeeManualCollectionModal', _feeManualCollectionDetail);
            },
            _queryFeeManualCollectionDetailMethod: function () {
                vc.component._listFeeManualCollectionDetails(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.feeManualCollectionDetailManageInfo.moreCondition) {
                    vc.component.feeManualCollectionDetailManageInfo.moreCondition = false;
                } else {
                    vc.component.feeManualCollectionDetailManageInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            },
            _openTranslateFeeManualCollectionModel: function () {
                //重新同步房屋欠费
            },


        }
    });
})(window.vc);
