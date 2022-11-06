/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            maintainanceStandardManageInfo: {
                maintainanceStandards: [],
                total: 0,
                records: 1,
                moreCondition: false,
                standardId: '',
                conditions: {
                    standardId: '',
                    standardName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function () {
            vc.component._listMaintainanceStandards(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('maintainanceStandardManage', 'listMaintainanceStandard', function (_param) {
                vc.component._listMaintainanceStandards(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMaintainanceStandards(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMaintainanceStandards: function (_page, _rows) {

                vc.component.maintainanceStandardManageInfo.conditions.page = _page;
                vc.component.maintainanceStandardManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.maintainanceStandardManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/maintainance.listMaintainanceStandard',
                    param,
                    function (json, res) {
                        var _maintainanceStandardManageInfo = JSON.parse(json);
                        vc.component.maintainanceStandardManageInfo.total = _maintainanceStandardManageInfo.total;
                        vc.component.maintainanceStandardManageInfo.records = _maintainanceStandardManageInfo.records;
                        vc.component.maintainanceStandardManageInfo.maintainanceStandards = _maintainanceStandardManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.maintainanceStandardManageInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMaintainanceStandardModal: function () {
                vc.emit('addMaintainanceStandard', 'openAddMaintainanceStandardModal', {});
            },
            _openEditMaintainanceStandardModel: function (_maintainanceStandard) {
                vc.emit('editMaintainanceStandard', 'openEditMaintainanceStandardModal', _maintainanceStandard);
            },
            _openDeleteMaintainanceStandardModel: function (_maintainanceStandard) {
                vc.emit('deleteMaintainanceStandard', 'openDeleteMaintainanceStandardModal', _maintainanceStandard);
            },
            _queryMaintainanceStandardMethod: function () {
                vc.component._listMaintainanceStandards(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.maintainanceStandardManageInfo.moreCondition) {
                    vc.component.maintainanceStandardManageInfo.moreCondition = false;
                } else {
                    vc.component.maintainanceStandardManageInfo.moreCondition = true;
                }
            },
            _maintainanceItem:function(_maintainanceStandard){
                vc.jumpToPage('/#/pages/property/maintainanceStandardItem?standardId='+_maintainanceStandard.standardId)
            }


        }
    });
})(window.vc);
