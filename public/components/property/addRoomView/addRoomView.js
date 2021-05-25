(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRoomViewInfo: {
                flowComponent: 'addRoomView',
                roomNum: '',
                layer: '',
                section: '0',
                apartment: '',
                apartment1: '',
                apartment2: '',
                builtUpArea: '',
                feeCoefficient: '1.00',
                state: '2002',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                attrs:[]
            }
        },
        watch: {
            addRoomViewInfo: {
                deep: true,
                handler: function () {
                    vc.component.saveAddRoomInfo();
                }
            }
        },
        _initMethod: function () {
            $that._loadRoomAttrSpec();

        },
        _initEvent: function () {

            vc.on('addRoomViewInfo', 'onIndex',
                function (_index) {
                    vc.component.addRoomViewInfo.index = _index;
                });
        },
        methods: {
            addRoomValidate() {
                vc.component.addRoomViewInfo.apartment = vc.component.addRoomViewInfo.apartment1 + vc.component.addRoomViewInfo.apartment2;
                return vc.validate.validate({
                    addRoomViewInfo: vc.component.addRoomViewInfo
                },
                    {
                        'addRoomViewInfo.roomNum': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋编号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "房屋编号长度不能超过12位"
                        },
                        ],
                        'addRoomViewInfo.layer': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋楼层不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "房屋楼层高度必须为数字"
                        },
                        ],
                        'addRoomViewInfo.apartment': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋户型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "房屋户型不能大于50"
                        },
                        ],
                        'addRoomViewInfo.builtUpArea': [{
                            limit: "required",
                            param: "",
                            errInfo: "建筑面积不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "建筑面积错误，如 300.00"
                        },
                        ],
                        'addRoomViewInfo.feeCoefficient':[
                            {
                                limit:"required",
                                param:"",
                                errInfo:"算费系数不能为空"
                            },
                            {
                                limit:"money",
                                param:"",
                                errInfo:"算费系数错误，如 300.00"
                            }
                        ],
                        'addRoomViewInfo.state': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "房屋状态 不能超过12位"
                        },
                        ],
                        'addRoomViewInfo.remark': [{
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                        ],

                    });
            },
            _loadRoomAttrSpec: function () {
                $that.addRoomViewInfo.attrs = [];
                vc.getAttrSpec('building_room_attr', function (data) {
                    data.forEach(item => {
                        item.value = '';
                        if(item.specShow == 'Y'){
                            item.values = [];
                            $that._loadAttrValue(item.specCd,item.values);
                            $that.addRoomViewInfo.attrs.push(item);
                        }
                    });

                });
            },
            _loadAttrValue:function(_specCd,_values){
                vc.getAttrValue(_specCd, function (data) {
                    data.forEach(item => {
                        if(item.valueShow == 'Y'){
                            _values.push(item);
                        }
                    });

                });
            },
            saveAddRoomInfo: function () {
                if (vc.component.addRoomValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRoomViewInfo);
                    return;
                }
            }
        }
    });

})(window.vc);