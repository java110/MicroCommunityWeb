(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string, //父组件监听方法
            flowType: vc.propTypes.string = '30003'
        },
        data: {
            purchaseApproversInfo: {
                flowComponent: 'purchaseApprovers',
                staffId: '',
                staffName: '',
                orgName: '',
                companyId: ''
            }
        },
        watch: {
            purchaseApproversInfo: {
                deep: true,
                handler: function() {
                    vc.component.savePurchaseApprovers();
                }
            }
        },
        _initMethod: function() {
            $that._loadStaffOrg();
        },
        _initEvent: function() {
            vc.on("purchaseApprovers", "notify", function(_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.purchaseApproversInfo.staffId = _param.staffId;
                    vc.component.purchaseApproversInfo.staffName = _param.staffName;
                }
            });
        },
        methods: {
            _loadStaffOrg: function() {
                let _userInfo = vc.getData("/nav/getUserInfo");
                if (_userInfo == null || _userInfo == undefined) {
                    vc.toast('用户可能还没有登陆，无法获取用户信息');
                    return;
                }
                let _staffId = _userInfo.userId;
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        flowType: $props.flowType
                    }
                };
                //发送get请求
                vc.http.apiGet('/workflow/getFirstStaff',
                    param,
                    function(json, res) {
                        var _staffInfo = JSON.parse(json);
                        if (_staffInfo.code != 0) {
                            //vc.toast(_staffInfo.msg);
                            return;
                        }
                        let _data = _staffInfo.data;
                        vc.copyObject(_data, $that.purchaseApproversInfo);
                        $that.purchaseApproversInfo.orgName = _data.orgName;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            purchaseApproversValidate: function() {
                return vc.validate.validate({
                    purchaseApproversInfo: vc.component.purchaseApproversInfo
                }, {
                    'purchaseApproversInfo.staffId': [{
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "员工信息不正确"
                        },
                    ],
                    'purchaseApproversInfo.staffName': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工名称不能为空"
                    }]
                });
            },
            savePurchaseApprovers: function() {
                if (vc.component.purchaseApproversValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.purchaseApproversInfo);
                    return;
                }
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.purchaseApproversInfo);
            },
        }
    });

})(window.vc);