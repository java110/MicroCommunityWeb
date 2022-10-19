(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPurchaseApplyViewInfo2: {
                flowComponent: 'addPurchaseApplyView2',
                description: '',
                endUserName: '',
                endUserTel: '',
                staffId: '',
                staffName: '',
                resOrderType: ''
            }
        },
        watch: {
            addPurchaseApplyViewInfo2: {
                deep: true,
                handler: function() {
                    vc.component.saveAddComplainInfo();
                }
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {

            vc.on('addPurchaseApplyViewInfo2', 'setResourcesOut', function(_resOrderType) {
                vc.component.addPurchaseApplyViewInfo2.resOrderType = _resOrderType;
            });

            vc.on("addPurchaseApplyViewInfo2", "notify", function(_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addPurchaseApplyViewInfo2.staffId = _param.staffId;
                    vc.component.addPurchaseApplyViewInfo2.staffName = _param.staffName;
                }
            });

            vc.on('addPurchaseApplyViewInfo2', 'switchOrg', function(_org) {
                vc.emit('addPurchaseApplyViewInfo2', 'staffSelect2', 'setStaff', _org)
            });

            // vc.on('addPurchaseApplyViewInfo2', 'setPurchaseApplyInfo', function () {
            //     vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPurchaseApplyViewInfo2);
            // });

            vc.on('addPurchaseApplyViewInfo2', 'onIndex', function(_index) {
                vc.component.addPurchaseApplyViewInfo2.index = _index;
            });
            vc.on("addPurchaseApplyViewInfo2", "clear", function(_param) {
                vc.component.addPurchaseApplyViewInfo2.description = '';
                vc.component.addPurchaseApplyViewInfo2.endUserName = '';
                vc.component.addPurchaseApplyViewInfo2.endUserTel = '';
            });
        },
        methods: {
            addComplainValidate: function() {
                return vc.validate.validate({
                    addPurchaseApplyViewInfo2: vc.component.addPurchaseApplyViewInfo2
                }, {
                    'addPurchaseApplyViewInfo2.description': [{
                            limit: "required",
                            param: "",
                            errInfo: "申请说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "申请说明不能超过200位"
                        },
                    ],
                    'addPurchaseApplyViewInfo2.endUserName': [{
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "联系人不能超过50位"
                        },
                    ],
                    'addPurchaseApplyViewInfo2.endUserTel': [{
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "不是有效手机号"
                        },
                    ]

                });
            },
            addComplainValidate2: function() {
                return vc.validate.validate({
                    addPurchaseApplyViewInfo2: vc.component.addPurchaseApplyViewInfo2
                }, {
                    'addPurchaseApplyViewInfo2.description': [{
                            limit: "required",
                            param: "",
                            errInfo: "申请说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "申请说明不能超过200位"
                        },
                    ],
                    'addPurchaseApplyViewInfo2.endUserName': [{
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "联系人不能超过50位"
                        },
                    ],
                    'addPurchaseApplyViewInfo2.staffId': [{
                        limit: "required",
                        param: "",
                        errInfo: "出库对象不能为空"
                    }],
                    'addPurchaseApplyViewInfo2.endUserTel': [{
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "不是有效手机号"
                        },
                    ]

                });
            },
            saveAddComplainInfo: function() {
                if (vc.component.addPurchaseApplyViewInfo2.resOrderType == 10000 && vc.component.addComplainValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPurchaseApplyViewInfo2);
                    return;
                } else if (vc.component.addPurchaseApplyViewInfo2.resOrderType == 20000 && vc.component.addComplainValidate2()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addPurchaseApplyViewInfo2);
                } else {
                    vc.emit($props.callBackListener, $props.callBackFunction, null);
                }
            }
        }
    });

})(window.vc);