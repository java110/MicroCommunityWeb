(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPropertyCompanyInfo: {
                name: '',
                address: '',
                tel: '',
                corporation: '',
                foundingTime: '',
                nearbyLandmarks: '',
                menuGroups: [],
                groupIds: [],
                communitys: [],
                communityIds: [],
                isAll: true
            }
        },
        watch: {
            'addPropertyCompanyInfo.communitys': function () { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                console.log('addPropertyCompanyInfo.communitys')
                this.$nextTick(function () {
                    $('#communityIds').selectpicker({
                        title: '选填，请选择开通小区',
                        styleBase: 'form-control',
                        width: 'auto'
                    });
                    $('#communityIds').selectpicker('refresh');
                })
            }
        },
        _initMethod: function () {
            vc.initDate('foundingTime', function (_value) {
                $that.addPropertyCompanyInfo.foundingTime = _value;
            });
        },
        _initEvent: function () {
            vc.on('addPropertyCompany', 'openAddPropertyCompanyModal', function () {
                $that._listPropertyMenuGroups();
                $that._listFreeCommunitys();
                $('#addPropertyCompanyModel').modal('show');
            });
        },
        methods: {
            addPropertyCompanyValidate() {
                return vc.validate.validate({
                    addPropertyCompanyInfo: vc.component.addPropertyCompanyInfo
                }, {
                    'addPropertyCompanyInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "名称不能超过100"
                        }
                    ],
                    'addPropertyCompanyInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地址不能超过200"
                        }
                    ],
                    'addPropertyCompanyInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "电话不能超过11"
                        }
                    ],
                    'addPropertyCompanyInfo.corporation': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公司法人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "公司法人不能空"
                        }
                    ],
                    'addPropertyCompanyInfo.foundingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "成立日期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "成立日期不能空"
                        }
                    ],
                    'addPropertyCompanyInfo.nearbyLandmarks': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地标不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地标不能超过200"
                        }
                    ]
                });
            },
            savePropertyCompanyInfo: function () {
                if (!vc.component.addPropertyCompanyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/property.saveProperty',
                    JSON.stringify(vc.component.addPropertyCompanyInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPropertyCompanyModel').modal('hide');
                            vc.component.clearAddPropertyCompanyInfo();
                            vc.emit('propertyCompanyManage', 'listPropertyCompany', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddPropertyCompanyInfo: function () {
                vc.component.addPropertyCompanyInfo = {
                    name: '',
                    address: '',
                    tel: '',
                    corporation: '',
                    foundingTime: '',
                    nearbyLandmarks: '',
                    menuGroups: [],
                    groupIds: [],
                    communitys: [],
                    communityIds: [],
                    isAll: true,
                };
            },
            changeAll: function () {
                $that.addPropertyCompanyInfo.groupIds = [];
                if (!$that.addPropertyCompanyInfo.isAll) {
                    return;
                }
                $that.addPropertyCompanyInfo.menuGroups.forEach(item => {
                    $that.addPropertyCompanyInfo.groupIds.push(item.groupId);
                });
            },
            changeItem: function () {
                if ($that.addPropertyCompanyInfo.groupIds.length < $that.addPropertyCompanyInfo.menuGroups.length) {
                    $that.addPropertyCompanyInfo.isAll = false;
                    return;
                }
                $that.addPropertyCompanyInfo.isAll = true;
            },
            _listPropertyMenuGroups: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        storeType: '800900000003'
                    }
                };
                //发送get请求
                vc.http.apiGet('/menuGroup.listMenuGroup',
                    param,
                    function (json, res) {
                        let _propertyCompanyManageInfo = JSON.parse(json);
                        $that.addPropertyCompanyInfo.menuGroups = _propertyCompanyManageInfo.data;
                        _propertyCompanyManageInfo.data.forEach(item => {
                            $that.addPropertyCompanyInfo.groupIds.push(item.gId)
                        })
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listFreeCommunitys: function () {
                let param = {
                    params: {
                        communityName: ''
                    }
                }
                //发送get请求
                vc.http.get('storeEnterCommunity',
                    'listNoEnterCommunity',
                    param,
                    function (json, res) {
                        vc.component.addPropertyCompanyInfo.communitys = JSON.parse(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);