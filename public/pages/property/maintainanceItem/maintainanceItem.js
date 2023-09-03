/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainanceItemInfo: {
                inspectionItemTitles: [],
                total: 0,
                records: 1,
                moreCondition: false,
                titleId: '',
                conditions: {
                    titleType: '',
                    itemTitle: '',
                    title: '',
                    titleId: '',
                    seq: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            vc.component._listMaintainanceItems(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('maintainanceItem', 'listMaintainanceItem', function (_param) {
                vc.component._listMaintainanceItems(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMaintainanceItems(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMaintainanceItems: function (_page, _rows) {
                vc.component.maintainanceItemInfo.conditions.page = _page;
                vc.component.maintainanceItemInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.maintainanceItemInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/maintainance.listMaintainanceItem',
                    param,
                    function (json, res) {
                        let _maintainanceItemInfo = JSON.parse(json);
                        vc.component.maintainanceItemInfo.total = _maintainanceItemInfo.total;
                        vc.component.maintainanceItemInfo.records = _maintainanceItemInfo.records;
                        vc.component.maintainanceItemInfo.inspectionItemTitles = _maintainanceItemInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.maintainanceItemInfo.records,
                            dataCount: vc.component.maintainanceItemInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMaintainanceItemModal: function () {
                vc.emit('addMaintainanceItem', 'openAddMaintainanceItemModal', {
                    itemId: $that.maintainanceItemInfo.conditions.itemId,
                });
            },
            _openEditMaintainanceItemModel: function (_inspectionItemTitle) {
                vc.emit('editMaintainanceItem', 'openEditMaintainanceItemModal', _inspectionItemTitle);
            },
            _openDeleteMaintainanceItemModel: function (_inspectionItemTitle) {
                vc.emit('deleteMaintainanceItem', 'openDeleteMaintainanceItemModal', _inspectionItemTitle);
            },
            //查询
            _queryMaintainanceItemMethod: function () {
                vc.component._listMaintainanceItems(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMaintainanceItemMethod: function () {
                vc.component.maintainanceItemInfo.conditions.titleId = "";
                vc.component.maintainanceItemInfo.conditions.itemTitle = "";
                vc.component.maintainanceItemInfo.conditions.titleType = "";
                vc.component._listMaintainanceItems(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.maintainanceItemInfo.moreCondition) {
                    vc.component.maintainanceItemInfo.moreCondition = false;
                } else {
                    vc.component.maintainanceItemInfo.moreCondition = true;
                }
            },
            _getTitleTypeName: function (_titleType) {
                if (_titleType == '1001') {
                    return '单选';
                } else if (_titleType == '2002') {
                    return '多选';
                } else {
                    return '简答';
                }
            },
            _openQuestionValueModel: function (_inspectionItemTitle) {
                vc.emit('inspectionItemTitleValue', 'openinspectionItemTitleValueModel', _inspectionItemTitle);
            },
            _toQuestionValueModel: function (_inspectionItemTitle) {
                vc.jumpToPage('/#/pages/property/reportInfoAnswerValueManage?titleId=' + _inspectionItemTitle.titleId)
            }
        }
    });
})(window.vc);