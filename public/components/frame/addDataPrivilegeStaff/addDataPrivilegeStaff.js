(function (vc) {
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
            emitListener: vc.propTypes.string,
            emitFunction: vc.propTypes.string
        },
        data: {
            addDataPrivilegeStaffInfo: {
                total: 0,
                records: 1,
                staffs: [],
                staffName: '',
                dpId: '',
                orgName: '',
                selectStaffs: []
            }
        },
        watch: { // 监视双向绑定的数据数组
            addDataPrivilegeStaffInfo: {
                handler() { // 数据数组有变化将触发此函数
                    if ($that.addDataPrivilegeStaffInfo.selectStaffs.length == $that.addDataPrivilegeStaffInfo.staffs.length) {
                        document.querySelector('#staffQuan').checked = true;
                    } else {
                        document.querySelector('#staffQuan').checked = false;
                    }
                },
                deep: true // 深度监视
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addDataPrivilegeStaff', 'openAddDataPrivilegeStaffModal', function (_param) {
                $that._refreshChooseOrgInfo();
                $('#addDataPrivilegeStaffModel').modal('show');
                vc.copyObject(_param, $that.addDataPrivilegeStaffInfo);
                $that._loadAllStaffInfo(1, 10, '');
            });
            vc.on('addDataPrivilegeStaff', 'paginationPlus', 'page_event', function (_currentPage) {
                $that._loadAllStaffInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _loadAllStaffInfo: function (_page, _row, _name) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        staffName: _name,
                        dpId: $that.addDataPrivilegeStaffInfo.dpId
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataPrivilegeStaff.listStaffNotInDataPrivilege',
                    param,
                    function (json) {
                        var _staffInfo = JSON.parse(json);
                        $that.addDataPrivilegeStaffInfo.total = _staffInfo.total;
                        $that.addDataPrivilegeStaffInfo.records = _staffInfo.records;
                        $that.addDataPrivilegeStaffInfo.staffs = _staffInfo.data;
                        vc.emit('addDataPrivilegeStaff', 'paginationPlus', 'init', {
                            total: $that.addDataPrivilegeStaffInfo.records,
                            dataCount: $that.addDataPrivilegeStaffInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            addDataPrivilegeStaff: function (_org) {
                var _selectStaffs = $that.addDataPrivilegeStaffInfo.selectStaffs;
                var _tmpStaffs = $that.addDataPrivilegeStaffInfo.staffs;
                if (_selectStaffs.length < 1) {
                    vc.toast("请选择员工");
                    return;
                }
                let _staffs = [];
                for (var _selectIndex = 0; _selectIndex < _selectStaffs.length; _selectIndex++) {
                    for (var _staffIndex = 0; _staffIndex < _tmpStaffs.length; _staffIndex++) {
                        if (_selectStaffs[_selectIndex] == _tmpStaffs[_staffIndex].userId) {
                            _staffs.push({
                                staffId: _tmpStaffs[_staffIndex].userId,
                                staffName: _tmpStaffs[_staffIndex].name
                            });
                        }
                    }
                }
                let _objData = {
                    dpId: $that.addDataPrivilegeStaffInfo.dpId,
                    staffs: _staffs,
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost('/dataPrivilegeStaff.saveDataPrivilegeStaff',
                    JSON.stringify(_objData), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        $('#addDataPrivilegeStaffModel').modal('hide');
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            vc.emit($props.emitListener, $props.emitFunction, {});
                            vc.toast("操作成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
                $('#addDataPrivilegeStaffModel').modal('hide');
            },
            queryStaffs: function () {
                $that._loadAllStaffInfo(1, 10, $that.addDataPrivilegeStaffInfo.staffName);
            },
            _refreshChooseOrgInfo: function () {
                $that.addDataPrivilegeStaffInfo = {
                    staffs: [],
                    staffName: '',
                    dpId: '',
                    orgName: '',
                    selectStaffs: []
                };
            },
            checkStaffAll: function (e) {
                let checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            $that.addDataPrivilegeStaffInfo.selectStaffs.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    $that.addDataPrivilegeStaffInfo.selectStaffs = [];
                }
            }
        }
    });
})(window.vc);