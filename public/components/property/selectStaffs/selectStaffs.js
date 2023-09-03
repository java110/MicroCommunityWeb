(function(vc) {
    var default_row = 100;
    vc.extends({
        data: {
            selectStaffsInfo: {
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
                selectStaffs: [],
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('selectStaffs', 'setStaffs', function(_staffs) {
                $that.selectStaffsInfo.selectStaffs = _staffs;
            });
            vc.on('selectStaffs', 'switchOrg', function(_param) {
                $that.loadStaff(_param);
            })
        },
        methods: {
            loadStaff: function(_org) {
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
                    function(json) {
                        var _staffInfo = JSON.parse(json);
                        $that.selectStaffsInfo.staffs = _staffInfo.staffs;
                        if (_staffInfo.staffs.length < 1) {
                            return;
                        }
                        $that.selectStaffsInfo.curStaffId = _staffInfo.staffs[0].orgId
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeStaff: function(_staff) {
                let hasIn = false;
                $that.selectStaffsInfo.selectStaffs.forEach(item => {
                    if (item.userId == _staff.userId) {
                        hasIn = true;
                    }
                });

                if (hasIn) {
                    vc.toast('请勿重复选择');
                    return;
                }
                $that.selectStaffsInfo.selectStaffs.push(_staff);
            },
            _removeStaff: function(_staff) {
                let _staffs = $that.selectStaffsInfo.selectStaffs;
                for (let _staffIndex = 0; _staffIndex < _staffs.length; _staffIndex++) {
                    if (_staffs[_staffIndex].userId == _staff.userId) {
                        $that.selectStaffsInfo.selectStaffs.splice(_staffIndex, 1);
                    }
                }
            }
        }
    });
})(window.vc);