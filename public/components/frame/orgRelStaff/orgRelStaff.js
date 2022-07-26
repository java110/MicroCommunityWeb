(function(vc, vm) {

    vc.extends({
        data: {
            orgRelStaffInfo: {
                orgId: '',
                name: '',
                description: '',
                staffs: [],
                selectStaffs: [],
                quanGroup: false,
            }
        },
        watch: { // 监视双向绑定的数据数组
            orgRelStaffInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if (vc.component.orgRelStaffInfo.selectStaffs.length == vc.component.orgRelStaffInfo.staffs.length) {
                        vc.component.orgRelStaffInfo.quanGroup = true;
                    } else {
                        vc.component.orgRelStaffInfo.quanGroup = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('orgRelStaff', 'orgRelStaffModel', function(_params) {
                $('#orgRelStaffModel').modal('show');
                // 初始化时清空已选择权限
                vc.component.orgRelStaffInfo.selectStaffs = [];
                vc.component.orgRelStaffInfo.orgId = _params.orgId;
                vc.component._listStaffsNoInOrg();
            });
        },
        methods: {
            _listStaffsNoInOrg: function() {
                vc.component.orgRelStaffInfo.staffs = [];
                let param = {
                    params: {
                        orgId: vc.component.orgRelStaffInfo.orgId,
                        page: 1,
                        row: 15,
                        staffName: $that.orgRelStaffInfo.name
                    }
                }
                vc.http.apiGet(
                    '/user.listStaffsNoInOrg',
                    param,
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            vc.component.orgRelStaffInfo.staffs = _json.data;
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.component.orgRelStaffInfo.errorInfo = errInfo;
                    });
            },
            _saveOrgRelStaff: function() {
                let _selectStaffs = vc.component.orgRelStaffInfo.selectStaffs;
                if (_selectStaffs.length < 1) {
                    vc.toast('未选择员工');
                    return;
                }
                let param = {
                    orgId: $that.orgRelStaffInfo.orgId,
                    staffIds: _selectStaffs.join(','),
                };
                vc.http.apiPost(
                    '/user.saveStaffOrgRel',
                    JSON.stringify(param), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#orgRelStaffModel').modal('hide');
                            vc.emit('orgManage', 'notice', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(_json.msg);
                    });
            },
            checkAllGroup: function(e) {
                var checkObj = document.querySelectorAll('.checkGroupItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.orgRelStaffInfo.selectStaffs.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.orgRelStaffInfo.selectStaffs = [];
                }
            },
            _queryOrgRelStaffs: function() {
                $that._listStaffsNoInOrg();
            }
        }
    });

})(window.vc, window.vc.component);