(function (vc) {
    vc.extends({
        data: {
            addItemReleaseViewInfo: {
                irId: '',
                typeId: '',
                applyCompany: '',
                applyPerson: '',
                idCard: '',
                applyTel: '',
                passTime: '',
                resNames: [],
                state: '',
                carNum: '',
                remark: '',
                itemReleaseTypes: [],
                audit: {
                    assignee: '',
                    staffId: '',
                    staffName: '',
                    taskId: ''
                },
            }
        },
        _initMethod: function () {
            $that._listItemReleaseTypes();
            vc.initDateTime('addPassTime', function (_value) {
                $that.addItemReleaseViewInfo.passTime = _value;
            })
        },
        _initEvent: function () {
        },
        methods: {
            addItemReleaseViewValidate() {
                return vc.validate.validate({
                    addItemReleaseViewInfo: $that.addItemReleaseViewInfo
                }, {
                    'addItemReleaseViewInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "放行类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "放行类型不能超过30"
                        }
                    ],
                    'addItemReleaseViewInfo.applyCompany': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请单位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请单位不能超过64"
                        }
                    ],
                    'addItemReleaseViewInfo.applyPerson': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请人不能超过64"
                        }
                    ],
                    'addItemReleaseViewInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "18",
                            errInfo: "身份证不能超过18"
                        }
                    ],
                    'addItemReleaseViewInfo.applyTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号不能超过11"
                        }
                    ],
                    'addItemReleaseViewInfo.passTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通行时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "通行时间格式错误"
                        }
                    ],
                    'addItemReleaseViewInfo.carNum': [
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车牌号不能超过12"
                        }
                    ],
                    'addItemReleaseViewInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ]
                });
            },
            saveItemReleaseInfo: function () {
                if (!$that.addItemReleaseViewValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addItemReleaseViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/itemRelease.saveItemRelease',
                    JSON.stringify($that.addItemReleaseViewInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("添加成功");
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
            _listItemReleaseTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseType',
                    param,
                    function (json, res) {
                        let _itemReleaseTypeManageInfo = JSON.parse(json);
                        $that.addItemReleaseViewInfo.itemReleaseTypes = _itemReleaseTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addResName: function () {
                $that.addItemReleaseViewInfo.resNames.push({
                    resName: '',
                    amount: ''
                })
            },
            // 移除选中item
            _removeResName: function (resName) {
                $that.addItemReleaseViewInfo.resNames.forEach((item, index) => {
                    if (item.resName == resName) {
                        $that.addItemReleaseViewInfo.resNames.splice(index, 1);
                    }
                })
            },
            _changeItemReleaseType: function () {
                let _flowId = '';
                $that.addItemReleaseViewInfo.itemReleaseTypes.forEach(item => {
                    if (item.typeId == $that.addItemReleaseViewInfo.typeId) {
                        _flowId = item.flowId;
                    }
                });
                $that._loadStaffOrg(_flowId);
            },
            _loadStaffOrg: function (_flowId) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowId: _flowId
                    }
                };
                //发送get请求
                vc.http.apiGet('/oaWorkflow.queryFirstAuditStaff',
                    param,
                    function (json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data[0], $that.addItemReleaseViewInfo.audit);
                        if(!_data[0].assignee.startsWith('-')){
                            $that.addItemReleaseViewInfo.audit.staffId = $that.addItemReleaseViewInfo.audit.assignee;
                        }
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            chooseStaff: function () {
                vc.emit('selectStaff', 'openStaff', $that.addItemReleaseViewInfo.audit);
            },
        }
    });
})(window.vc);
