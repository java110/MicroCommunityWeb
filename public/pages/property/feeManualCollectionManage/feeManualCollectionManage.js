/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeManualCollectionManageInfo: {
                feeManualCollections: [],
                total: 0,
                records: 1,
                moreCondition: false,
                collectionId: '',
                conditions: {
                    roomName: '',
                    ownerName: '',
                    link: '',
                    communityId:vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listFeeManualCollections(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('feeManualCollectionManage', 'listFeeManualCollection', function (_param) {
                vc.component._listFeeManualCollections(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listFeeManualCollections(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listFeeManualCollections: function (_page, _rows) {

                vc.component.feeManualCollectionManageInfo.conditions.page = _page;
                vc.component.feeManualCollectionManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.feeManualCollectionManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/feeManualCollection/queryFeeManualCollection',
                    param,
                    function (json, res) {
                        var _feeManualCollectionManageInfo = JSON.parse(json);
                        vc.component.feeManualCollectionManageInfo.total = _feeManualCollectionManageInfo.total;
                        vc.component.feeManualCollectionManageInfo.records = _feeManualCollectionManageInfo.records;
                        vc.component.feeManualCollectionManageInfo.feeManualCollections = _feeManualCollectionManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.feeManualCollectionManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddFeeManualCollectionModal: function () {
                vc.emit('addFeeManualCollection', 'openAddFeeManualCollectionModal', {});
            },
            
            _openDeleteFeeManualCollectionModel: function (_feeManualCollection) {
                vc.emit('deleteFeeManualCollection', 'openDeleteFeeManualCollectionModal', _feeManualCollection);
            },
            _openFeeManualCollectionDetail:function(_feeManualCollection){
                vc.jumpToPage('/admin.html#/pages/property/feeManualCollectionDetailManage?collectionId='+_feeManualCollection.collectionId+"&roomId="+_feeManualCollection.roomId)
            },
            _queryFeeManualCollectionMethod: function () {
                vc.component._listFeeManualCollections(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.feeManualCollectionManageInfo.moreCondition) {
                    vc.component.feeManualCollectionManageInfo.moreCondition = false;
                } else {
                    vc.component.feeManualCollectionManageInfo.moreCondition = true;
                }
            },
            _exitManualCollectionData: function () {
                vc.jumpToPage('/callComponent/feeManualCollection/exportData?communityId='+vc.getCurrentCommunity().communityId);
            },

        }
    });
})(window.vc);
