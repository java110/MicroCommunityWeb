/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            dataPrivilegeDivInfo: {
                dataPrivileges: [],
                dpId: '',
                curDataPrivilege: {}
            }
        },
        _initMethod: function () {
            $that._loadDataPrivileges();
        },
        _initEvent: function () {
            vc.on('dataPrivilegeDiv', '_loadDataPrivilege', function (_param) {
                $that._loadDataPrivileges();
            });
        },
        methods: {
            _loadDataPrivileges: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/dataPrivilege.listDataPrivilege',
                    param,
                    function (json, res) {
                        let _dataPrivilegeManageInfo = JSON.parse(json);
                        vc.component.dataPrivilegeDivInfo.dataPrivileges = _dataPrivilegeManageInfo.data;
                        if (_dataPrivilegeManageInfo.data && _dataPrivilegeManageInfo.data.length > 0) {
                            $that._switchDataPrivilege(_dataPrivilegeManageInfo.data[0])
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _switchDataPrivilege: function (_dataPrivilege) {
                $that.dataPrivilegeDivInfo.curDataPrivilege = _dataPrivilege;
                vc.emit('dataPrivilege', 'switchDataPrivilege', _dataPrivilege);
            },
            _openAddDataPrivilegeModal: function () {
                vc.emit('addDataPrivilege', 'openAddDataPrivilegeModal', {});
            },
            _openEditDataPrivilegeModel: function () {
                vc.emit('editDataPrivilege', 'openEditDataPrivilegeModal', $that.dataPrivilegeDivInfo.curDataPrivilege);
            },
            _openDeleteDataPrivilegeModel: function () {
                vc.emit('deleteDataPrivilege', 'openDeleteDataPrivilegeModal', $that.dataPrivilegeDivInfo.curDataPrivilege);
            }
        }
    });
})(window.vc);
