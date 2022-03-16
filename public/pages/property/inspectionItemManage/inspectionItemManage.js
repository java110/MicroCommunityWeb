/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionItemManageInfo: {
                inspectionItems: [],
                total: 0,
                records: 1,
                moreCondition: false,
                itemId: '',
                conditions: {
                    itemId: '',
                    itemName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function() {
            vc.component._listInspectionItems(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('inspectionItemManage', 'listInspectionItem', function(_param) {
                vc.component._listInspectionItems(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listInspectionItems(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionItems: function(_page, _rows) {

                vc.component.inspectionItemManageInfo.conditions.page = _page;
                vc.component.inspectionItemManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.inspectionItemManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/inspectionItem.listInspectionItem',
                    param,
                    function(json, res) {
                        let _inspectionItemManageInfo = JSON.parse(json);
                        vc.component.inspectionItemManageInfo.total = _inspectionItemManageInfo.total;
                        vc.component.inspectionItemManageInfo.records = _inspectionItemManageInfo.records;
                        vc.component.inspectionItemManageInfo.inspectionItems = _inspectionItemManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionItemManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionItemModal: function() {
                vc.emit('addInspectionItem', 'openAddInspectionItemModal', {});
            },
            _openEditInspectionItemModel: function(_inspectionItem) {
                vc.emit('editInspectionItem', 'openEditInspectionItemModal', _inspectionItem);
            },
            _openDeleteInspectionItemModel: function(_inspectionItem) {
                vc.emit('deleteInspectionItem', 'openDeleteInspectionItemModal', _inspectionItem);
            },
            _queryInspectionItemMethod: function() {
                vc.component._listInspectionItems(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.inspectionItemManageInfo.moreCondition) {
                    vc.component.inspectionItemManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionItemManageInfo.moreCondition = true;
                }
            },
            _toTitle: function(_item) {
                vc.jumpToPage('/#/pages/property/inspectionItemTitleManage?itemId=' + _item.itemId)
            }


        }
    });
})(window.vc);