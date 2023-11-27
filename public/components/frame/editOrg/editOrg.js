(function (vc, vm) {
    vc.extends({
        data: {
            editOrgInfo: {
                orgId: '',
                orgName: '',
                orgLevel: '',
                parentOrgId: '',
                parentOrgName: '',
                belongCommunityId: '',
                description: '',
                parentOrg: [],
                belongCommunitys: []
            }
        },
        _initMethod: function () {
            $that._editOrgListParentOrgInfo();
        },
        _initEvent: function () {
            vc.on('editOrg', 'openEditOrgModal', function (_params) {
                $that.refreshEditOrgInfo();
                $('#editOrgModel').modal('show');
                vc.copyObject(_params, $that.editOrgInfo);
                $that.editOrgInfo.parentOrgId = _params.parentId;
                $that._listEditOrgs();
                //$that.editOrgInfo.communityId = $that.editOrgInfo.belongCommunityId;
            });
        },
        methods: {
            editOrgValidate: function () {
                return vc.validate.validate({
                    editOrgInfo: $that.editOrgInfo
                }, {
                    'editOrgInfo.orgName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组织名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "组织名称长度为2至50"
                        }
                    ],
                    'editOrgInfo.parentOrgId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "上级ID不能为空"
                        }
                    ],
                    'editOrgInfo.description': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能为空"
                        }
                    ],
                    'editOrgInfo.orgId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "组织ID不能为空"
                        }
                    ]
                });
            },
            editOrg: function () {
                if (!$that.editOrgValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/org.updateOrg',
                    JSON.stringify($that.editOrgInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editOrgModel').modal('hide');
                            vc.emit('orgTree', 'refreshTree', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditOrgInfo: function () {
                $that.editOrgInfo = {
                    orgId: '',
                    orgName: '',
                    orgLevel: '',
                    parentOrgId: '',
                    parentOrgName: '',
                    description: '',
                    belongCommunityId: '',
                    communityId: '',
                    parentOrg: [],
                    belongCommunitys: []
                }
            },
            _editOrgListParentOrgInfo: function () {
                let _tmpOrgLevel = $that.editOrgInfo.orgLevel;
                if (_tmpOrgLevel > 1) {
                    _tmpOrgLevel = _tmpOrgLevel - 1;
                }
                let param = {
                    params: {
                        orgLevel: _tmpOrgLevel,
                        page: 1,
                        row: 30,
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function (json, res) {
                        var _orgManageInfo = JSON.parse(json);
                        $that.editOrgInfo.parentOrg = _orgManageInfo.orgs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listEditOrgs: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        orgId: $that.editOrgInfo.orgId
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrg',
                    param,
                    function (json, res) {
                        let _orgManageInfo = JSON.parse(json);
                        vc.copyObject(_orgManageInfo.data[0], $that.editOrgInfo)
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.$that);