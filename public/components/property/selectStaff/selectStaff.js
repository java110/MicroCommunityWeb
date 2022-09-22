(function (vc) {
    var default_row = 50;
    vc.extends({
        data: {
            selectStaffInfo: {
                flowId: '',
                flowName: '',
                describle: '',
                companys: [],
                departments: [],
                staffs: [],
                curCompanyId: '',
                curDepartmentId: '',
                curStaffId: '',
                curStaffName: '',
                staff: {}
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('selectStaff', 'openStaff', function (_staff) {
                //查询公司信息
                $('#selectStaffModel').modal('show');
                $that.selectStaffInfo.staff = _staff;
                $that.staff = _staff;
            });
            vc.on('selectStaff', 'switchOrg', function (_param) {
                $that.loadStaff(_param);
            })
        },
        methods: {
            _changeStaff: function (item) {
                $that.staff.staffId = item.userId;
                $that.staff.staffName = item.userName;
                $('#selectStaffModel').modal('hide');
                if ($that.staff.hasOwnProperty('call')) {
                    $that.staff.call($that.staff);
                }
            },
            loadStaff: function (_org) {
                let param = {
                    params: {
                        page: 1,
                        rows: default_row,
                        row: default_row,
                        orgId: _org.orgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function (json) {
                        var _staffInfo = JSON.parse(json);
                        $that.selectStaffInfo.staffs = _staffInfo.staffs;
                        if (_staffInfo.staffs.length < 1) {
                            return;
                        }
                        $that.selectStaffInfo.curStaffId = _staffInfo.staffs[0].orgId
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _firstUser: function () {
                $that.staff.staffId = '${startUserId}';
                $that.staff.staffName = '提交者';
                $('#selectStaffModel').modal('hide');
                if ($that.staff.hasOwnProperty('call')) {
                    $that.staff.call($that.staff);
                }
            },
            _customUser: function () {
                $that.staff.staffId = '${nextUserId}';
                $that.staff.staffName = '动态指定';
                $('#selectStaffModel').modal('hide');
                if ($that.staff.hasOwnProperty('call')) {
                    $that.staff.call($that.staff);
                }
            }
        }
    });
})(window.vc);