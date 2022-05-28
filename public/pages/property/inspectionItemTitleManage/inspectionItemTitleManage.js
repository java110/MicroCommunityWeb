/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            inspectionItemTitleManageInfo: {
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
            let _itemId = vc.getParam('itemId');
            $that.inspectionItemTitleManageInfo.conditions.itemId = _itemId;
            vc.component._listInspectionItemTitles(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('inspectionItemTitleManage', 'listInspectionItemTitle', function (_param) {
                vc.component._listInspectionItemTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listInspectionItemTitles(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listInspectionItemTitles: function (_page, _rows) {
                vc.component.inspectionItemTitleManageInfo.conditions.page = _page;
                vc.component.inspectionItemTitleManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.inspectionItemTitleManageInfo.conditions
                };
                param.params.titleId = param.params.titleId.trim();
                param.params.itemTitle = param.params.itemTitle.trim();
                //发送get请求
                vc.http.apiGet('/inspectionItemTitle.listInspectionItemTitle',
                    param,
                    function (json, res) {
                        let _inspectionItemTitleManageInfo = JSON.parse(json);
                        vc.component.inspectionItemTitleManageInfo.total = _inspectionItemTitleManageInfo.total;
                        vc.component.inspectionItemTitleManageInfo.records = _inspectionItemTitleManageInfo.records;
                        vc.component.inspectionItemTitleManageInfo.inspectionItemTitles = _inspectionItemTitleManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.inspectionItemTitleManageInfo.records,
                            dataCount: vc.component.inspectionItemTitleManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddInspectionItemTitleModal: function () {
                vc.emit('addInspectionItemTitle', 'openAddInspectionItemTitleModal', {
                    itemId: $that.inspectionItemTitleManageInfo.conditions.itemId,
                });
            },
            _openEditInspectionItemTitleModel: function (_inspectionItemTitle) {
                vc.emit('editInspectionItemTitle', 'openEditInspectionItemTitleModal', _inspectionItemTitle);
            },
            _openDeleteInspectionItemTitleModel: function (_inspectionItemTitle) {
                vc.emit('deleteInspectionItemTitle', 'openDeleteInspectionItemTitleModal', _inspectionItemTitle);
            },
            //查询
            _queryInspectionItemTitleMethod: function () {
                vc.component._listInspectionItemTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionItemTitleMethod: function () {
                vc.component.inspectionItemTitleManageInfo.conditions.titleId = "";
                vc.component.inspectionItemTitleManageInfo.conditions.itemTitle = "";
                vc.component.inspectionItemTitleManageInfo.conditions.titleType = "";
                vc.component._listInspectionItemTitles(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _goBack: function () {
                vc.goBack();
            },
            _moreCondition: function () {
                if (vc.component.inspectionItemTitleManageInfo.moreCondition) {
                    vc.component.inspectionItemTitleManageInfo.moreCondition = false;
                } else {
                    vc.component.inspectionItemTitleManageInfo.moreCondition = true;
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