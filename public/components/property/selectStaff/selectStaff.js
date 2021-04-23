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
            $that._initSelectStaffInfo();
        },
        _initEvent: function () {
            vc.on('selectStaff', 'openStaff', function (_staff) {
                //查询公司信息
                $that._initOrg(2, '');
                $('#selectStaffModel').modal('show');
                $that.staff = _staff;
            });

        },
        methods: {
            _initSelectStaffInfo: function () {

            },

            _changeCompany: function (item) {
                $that.selectStaffInfo.curCompanyId = item.orgId;
                //查询部门
                $that._initOrg(3, $that.selectStaffInfo.curCompanyId);
            },
            _changeDepartment: function (item) {
                $that.selectStaffInfo.curDepartmentId = item.orgId;
                //查询部门
                $that.loadStaff();
            },
            _changeStaff: function (item) {
                console.log('selectStaff',item);
                $that.staff.staffId = item.userId;
                $that.staff.staffName = item.userName;
                $('#selectStaffModel').modal('hide');
                if($that.staff.hasOwnProperty('call')){
                    $that.staff.call($that.staff);
                }
            },
            _initOrg: function (_orgLevel, _parentOrgId) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };

                //发送get请求
                vc.http.get('orgManage',
                    'list',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        if (_orgLevel == 2) {
                            $that.selectStaffInfo.companys = _orgManageInfo.orgs;
                            if (_orgManageInfo.orgs.length < 1) {
                                return;
                            }
                            $that.selectStaffInfo.curCompanyId = _orgManageInfo.orgs[0].orgId
                            //查询部门
                            $that._initOrg(3, $that.selectStaffInfo.curCompanyId);
                        } else if (_orgLevel == 3) {
                            $that.selectStaffInfo.departments = _orgManageInfo.orgs;
                            if (_orgManageInfo.orgs.length < 1) {
                                return;
                            }
                            $that.selectStaffInfo.curDepartmentId = _orgManageInfo.orgs[0].orgId
                            //查询部门
                            $that.loadStaff();
                        } else {
                            $that.selectStaffInfo.staffs = _orgManageInfo.orgs;
                        }

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            loadStaff: function () {
                var param = {
                    params: {
                        page: 1,
                        rows: default_row,
                        row: default_row,
                        orgId: $that.selectStaffInfo.curDepartmentId
                    }
                };

                //发送get请求
                vc.http.get('staff',
                    'loadData',
                    param,
                    function (json) {
                        var _staffInfo = JSON.parse(json);
                        $that.selectStaffInfo.staffs = _staffInfo.staffs;

                        if (_staffInfo.staffs.length < 1) {
                            return;
                        }
                        $that.selectStaffInfo.curStaffId = _staffInfo.staffs[0].orgId
                    }, function () {
                        console.log('请求失败处理');
                    }
                );

            },


        }
    });

})(window.vc);