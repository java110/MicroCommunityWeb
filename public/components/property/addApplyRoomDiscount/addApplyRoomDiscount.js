(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addApplyRoomDiscountInfo: {
                ardId: '',
                roomId: '',
                roomName: '',
                applyType: '',
                createUserName: '',
                createUserTel: '',
                startTime: '',
                endTime: '',
                createRemark: '',
                applyTypes: []
            }
        },
        _initMethod: function () {
            vc.initDateTime('addStartTime', function (_value) {
                $that.addApplyRoomDiscountInfo.startTime = _value;
            });
            vc.initDateTime('addEndTime', function (_value) {
                $that.addApplyRoomDiscountInfo.endTime = _value;
            });

            $that._listAddApplyRoomDiscountTypes();
        },
        _initEvent: function () {
            vc.on('addApplyRoomDiscount', 'openAddApplyRoomDiscountModal', function () {
                $('#addApplyRoomDiscountModel').modal('show');
            });
        },
        methods: {
            addApplyRoomDiscountValidate() {
                return vc.validate.validate({
                    addApplyRoomDiscountInfo: vc.component.addApplyRoomDiscountInfo
                }, {
                    'addApplyRoomDiscountInfo.roomName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "房屋格式错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.applyType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "申请类型错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.createUserName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请人错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.createUserTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "申请电话错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'addApplyRoomDiscountInfo.createRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "申请申请说明"
                        },
                    ],
                });
            },
            saveApplyRoomDiscountInfo: function () {
                if (!vc.component.addApplyRoomDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addApplyRoomDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addApplyRoomDiscountInfo);
                    $('#addApplyRoomDiscountModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/applyRoomDiscount/saveApplyRoomDiscount',
                    JSON.stringify(vc.component.addApplyRoomDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addApplyRoomDiscountModel').modal('hide');
                            vc.component.clearAddApplyRoomDiscountInfo();
                            vc.emit('applyRoomDiscountManage', 'listApplyRoomDiscount', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddApplyRoomDiscountInfo: function () {
                let _applyTypes = $that.addApplyRoomDiscountInfo.applyTypes;
                vc.component.addApplyRoomDiscountInfo = {
                    roomName: '',
                    roomId: '',
                    applyType: '',
                    createUserName: '',
                    createUserTel: '',
                    startTime: '',
                    endTime: '',
                    createRemark: '',
                    applyTypes: _applyTypes
                };
            },
            _queryAddApplyRoomDiscountRoom: function () {
                let _allNum = $that.addApplyRoomDiscountInfo.roomName;
                if (_allNum == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                } else {
                    vc.toast('房屋填写格式错误，请填写 楼栋-单元-房屋格式')
                    return;
                }

                //发送get请求
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        let _rooms = listRoomData.rooms;

                        if (_rooms.length < 1) {
                            vc.toast('未找到房屋');
                            $that.addApplyRoomDiscountInfo.roomName = '';
                            return;
                        }

                        $that.addApplyRoomDiscountInfo.roomId = _rooms[0].roomId;
                        $that.addApplyRoomDiscountInfo.createUserName = _rooms[0].ownerName;
                        $that.addApplyRoomDiscountInfo.createUserTel = _rooms[0].link;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAddApplyRoomDiscountTypes: function (_page, _rows) {

                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/applyRoomDiscount/queryApplyRoomDiscountType',
                    param,
                    function (json, res) {
                        let _applyRoomDiscountTypeManageInfo = JSON.parse(json);
                        vc.component.addApplyRoomDiscountInfo.applyTypes = _applyRoomDiscountTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
