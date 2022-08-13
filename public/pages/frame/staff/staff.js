(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffInfo: {
                moreCondition: false,
                branchOrgs: [],
                departmentOrgs: [],
                relCds: [],
                conditions: {
                    branchOrgId: '',
                    departmentOrgId: '',
                    orgId: '',
                    orgName: '',
                    orgLevel: '2',
                    parentOrgId: '',
                    name: '',
                    tel: '',
                    staffId: '',
                    parentOrgName: '',
                    orgNewName: ''
                }
            },
            staffData: [],
        },
        watch: {
            "staffInfo.conditions.branchOrgId": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component._getOrgsByOrgLevelStaff(DEFAULT_PAGE, DEFAULT_ROWS, 3, val);
                    vc.component.staffInfo.conditions.branchOrgId = val;
                    vc.component.staffInfo.conditions.parentOrgId = val;
                    vc.component.staffInfo.conditions.departmentOrgId = '';
                    vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS);
                },
                deep: true
            },
            "staffInfo.conditions.departmentOrgId": { //深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component.staffInfo.conditions.orgId = val;
                    vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS);
                },
                deep: true
            }
        },
        _initMethod: function () {
            // 查询岗位列表
            vc.getDict('u_org_staff_rel', "rel_cd", function (_data) {
                vc.component.staffInfo.relCds = _data;
                // 岗位列表获取比较慢， 获取到岗位列表后再加载数据
                vc.component.loadData(1, 10);
                vc.component._getOrgsByOrgLevelStaff(DEFAULT_PAGE, DEFAULT_ROWS, 2, '');
            });
        },
        _initEvent: function () {
            // vc.component.$on('pagination_page_event', function (_currentPage) {
            //     console.log(_currentPage);
            //     vc.component.currentPage(_currentPage);
            // });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component.loadData(_currentPage, DEFAULT_ROWS);
            });
            vc.on('staff', 'notify', function () {
                vc.component.loadData(1, DEFAULT_ROWS);
            });
            vc.component.$on('addStaff_reload_event', function () {
                vc.component.loadData(1, 10);
            });
            vc.component.$on('editStaff_reload_event', function () {
                vc.component.loadData(1, 10);
            });
            vc.component.$on('deleteStaff_reload_event', function () {
                vc.component.loadData(1, 10);
            });
        },
        methods: {
            loadData: function (_page, _rows) {
                vc.component.staffInfo.conditions.page = _page;
                vc.component.staffInfo.conditions.rows = _rows;
                vc.component.staffInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.staffInfo.conditions
                };
                param.params.name = param.params.name.trim();
                param.params.tel = param.params.tel.trim();
                param.params.staffId = param.params.staffId.trim();
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function (json) {
                        let _staffInfo = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        let staffList = _staffInfo.staffs;
                        let relCdsList = vc.component.staffInfo.relCds;
                        staffList.forEach((staff) => {
                            relCdsList.forEach((rel) => {
                                if (staff.relCd == rel.statusCd) {
                                    staff.relCdName = rel.name;
                                }
                            })
                        })
                        vc.component.staffData = staffList;
                        vc.component.$emit('pagination_info_event', {
                            total: _staffInfo.records,
                            dataCount: _staffInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            currentPage: function (_currentPage) {
                vc.component.loadData(_currentPage, 10);
            },
            openEditStaff: function (_staffInfo) {
                vc.component.$emit('edit_staff_event', _staffInfo);
            },
            openDeleteStaff: function (_staffInfo) {
                vc.component.$emit('delete_staff_event', _staffInfo);
            },
            _moreCondition: function () {
                if (vc.component.staffInfo.moreCondition) {
                    vc.component.staffInfo.moreCondition = false;
                } else {
                    vc.component.staffInfo.moreCondition = true;
                }
            },
            _getOrgsByOrgLevelStaff: function (_page, _rows, _orgLevel, _parentOrgId) {
                let param = {
                    params: {
                        page: _page,
                        row: _rows,
                        orgLevel: _orgLevel,
                        parentOrgId: _parentOrgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function (json, res) {
                        let _orgInfo = JSON.parse(json);
                        if (_orgLevel == 2) {
                            vc.component.staffInfo.branchOrgs = _orgInfo.orgs;
                        } else {
                            vc.component.staffInfo.departmentOrgs = _orgInfo.orgs;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddStaffStepPage: function () {
                vc.jumpToPage("/#/pages/frame/addStaff")
            },
            //查询
            _queryStaffMethod: function () {
                vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS)
            },
            //重置
            _resetStaffMethod: function () {
                vc.component.staffInfo.conditions.branchOrgId = "";
                vc.component.staffInfo.conditions.orgId = "";
                vc.component.staffInfo.conditions.departmentOrgId = "";
                vc.component.staffInfo.conditions.name = "";
                vc.component.staffInfo.conditions.tel = "";
                vc.component.staffInfo.conditions.staffId = "";
                vc.component.loadData(DEFAULT_PAGE, DEFAULT_ROWS)
            },
            _resetStaffPwd: function (_staff) {
                vc.emit('resetStaffPwd', 'openResetStaffPwd', _staff);
            },
            openStaffDetail: function (_staff) {
                vc.jumpToPage('/#/pages/frame/staffDetail?staffId=' + _staff.userId)
            }
        },
    });
})(window.vc);