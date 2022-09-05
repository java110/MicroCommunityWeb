/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            dataPrivilegeManageInfo: {
                dataPrivileges: [],
                total: 0,
                records: 1,
                moreCondition: false,
                dpId: '',
                conditions: {
                    dpId: '',
                    name: '',
                    communityId: vc.getCurrentCommunity().communityId,

                }
            }
        },
        _initMethod: function() {
            vc.component._listDataPrivileges(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('dataPrivilegeManage', 'listDataPrivilege', function(_param) {
                vc.component._listDataPrivileges(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listDataPrivileges(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listDataPrivileges: function(_page, _rows) {

                vc.component.dataPrivilegeManageInfo.conditions.page = _page;
                vc.component.dataPrivilegeManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.dataPrivilegeManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/dataPrivilege.listDataPrivilege',
                    param,
                    function(json, res) {
                        var _dataPrivilegeManageInfo = JSON.parse(json);
                        vc.component.dataPrivilegeManageInfo.total = _dataPrivilegeManageInfo.total;
                        vc.component.dataPrivilegeManageInfo.records = _dataPrivilegeManageInfo.records;
                        vc.component.dataPrivilegeManageInfo.dataPrivileges = _dataPrivilegeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.dataPrivilegeManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddDataPrivilegeModal: function() {
                vc.emit('addDataPrivilege', 'openAddDataPrivilegeModal', {});
            },
            _openEditDataPrivilegeModel: function(_dataPrivilege) {
                vc.emit('editDataPrivilege', 'openEditDataPrivilegeModal', _dataPrivilege);
            },
            _openDeleteDataPrivilegeModel: function(_dataPrivilege) {
                vc.emit('deleteDataPrivilege', 'openDeleteDataPrivilegeModal', _dataPrivilege);
            },
            _queryDataPrivilegeMethod: function() {
                vc.component._listDataPrivileges(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.dataPrivilegeManageInfo.moreCondition) {
                    vc.component.dataPrivilegeManageInfo.moreCondition = false;
                } else {
                    vc.component.dataPrivilegeManageInfo.moreCondition = true;
                }
            }


        }
    });
})(window.vc);