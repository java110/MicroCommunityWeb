/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var ALL_ROWS = 100;
    vc.extends({
        data: {
            orgManageInfo: {
                staffs: [],
                orgName: '',
                conditions: {
                    orgId: '',
                    staffName: ''
                }
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('org', 'switchOrg', function (_param) {
                $that.orgManageInfo.conditions.orgId = _param.orgId;
                $that.orgManageInfo.orgName = _param.orgName;
                vc.component._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('orgManage', 'notice', function () {
                vc.component._listStaffs(1, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listStaffs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listStaffs: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        orgId: $that.orgManageInfo.conditions.orgId,
                        staffName: $that.orgManageInfo.conditions.staffName.trim()
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        vc.component.orgManageInfo.total = _orgManageInfo.total;
                        vc.component.orgManageInfo.records = _orgManageInfo.records;
                        vc.component.orgManageInfo.staffs = _orgManageInfo.staffs;
                        vc.emit('pagination', 'init', {
                            total: vc.component.orgManageInfo.records,
                            dataCount: vc.component.orgManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryOrgMethod: function () {
                vc.component._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOrgMethod: function () {
                vc.component.orgManageInfo.conditions.staffName = "";
                vc.component._listStaffs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.orgManageInfo.moreCondition) {
                    vc.component.orgManageInfo.moreCondition = false;
                } else {
                    vc.component.orgManageInfo.moreCondition = true;
                }
            },
            _openOrgRelStaff: function () {
                if (!$that.orgManageInfo.conditions.orgId) {
                    vc.toast('请选择组织');
                    return;
                }
                vc.emit('orgRelStaff', 'orgRelStaffModel', {
                    orgId: $that.orgManageInfo.conditions.orgId
                })
            },
            _openDeleteOrgRelStaff: function (_rel) {
                vc.emit('deleteOrgRelStaff', 'openDeleteOrgModal', _rel)
            },
            _toStaffDetail: function (_staff) {
                vc.jumpToPage('/#/pages/frame/staffDetail?staffId=' + _staff.userId)
            }
        }
    });
})(window.vc);