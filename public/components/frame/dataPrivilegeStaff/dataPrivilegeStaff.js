/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            dataPrivilegeStaffInfo: {
                staffs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                dpId: '',
                staffName: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('dataPrivilegeStaffInfo', 'openDataPrivilegeStaff', function(_param) {
                vc.copyObject(_param, vc.component.dataPrivilegeStaffInfo);
                vc.component._listDataPrivilegeStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataPrivilegeStaffInfo', 'listDataPrivilegeStaff', function(_param) {
                //vc.copyObject(_param, vc.component.dataPrivilegeStaffInfo.conditions);
                vc.component._listDataPrivilegeStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('dataPrivilegeStaffInfo', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listDataPrivilegeStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listDataPrivilegeStaffs: function(_page, _rows) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        dpId: vc.component.dataPrivilegeStaffInfo.dpId,
                        staffName: $that.dataPrivilegeStaffInfo.staffName
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataPrivilegeStaff.listDataPrivilegeStaff',
                    param,
                    function(json, res) {
                        var _dataPrivilegeStaffInfo = JSON.parse(json);
                        vc.component.dataPrivilegeStaffInfo.total = _dataPrivilegeStaffInfo.total;
                        vc.component.dataPrivilegeStaffInfo.records = _dataPrivilegeStaffInfo.records;
                        vc.component.dataPrivilegeStaffInfo.staffs = _dataPrivilegeStaffInfo.data;
                        vc.emit('dataPrivilegeStaffInfo', 'paginationPlus', 'init', {
                            total: vc.component.dataPrivilegeStaffInfo.records,
                            dataCount: vc.component.dataPrivilegeStaffInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddDataPrivilegeStaffModal: function() {
                vc.emit('addDataPrivilegeStaff', 'openAddDataPrivilegeStaffModal', {
                    dpId: vc.component.dataPrivilegeStaffInfo.dpId,
                });
            },
            _openDeleteDataPrivilegeStaffModel: function(_dataPrivilegeStaff) {
                _dataPrivilegeStaff.dpId = $that.dataPrivilegeStaffInfo.dpId;
                vc.emit('deleteDataPrivilegeStaff', 'openDeleteDataPrivilegeStaffModal', _dataPrivilegeStaff);
            },
            _queryDataPrivilegeStaffMethod: function() {
                vc.component._listDataPrivilegeStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toStaffDetail: function(_dataPrivilegeStaff) {
                vc.jumpToPage('/#/pages/staff/staffDetail?staffId=' + _dataPrivilegeStaff.staffId)
            }
        }
    });
})(window.vc);