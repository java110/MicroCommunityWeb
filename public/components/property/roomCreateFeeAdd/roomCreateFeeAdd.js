(function (vc) {
    vc.extends({
        data: {
            roomCreateFeeAddInfo: {
                feeTypeCds: [],
                feeConfigs: [],
                locationTypeCd: '',
                locationObjId: '',
                floorId: '',
                floorNum: '',
                floorName: '',
                unitId: '',
                unitName: '',
                roomId: '',
                feeTypeCd: '',
                configId: '',
                roomState: ['2001'],
                isMore: false,
                locationTypeCdName: '',
                startTime: '',
                roomType: '1010301',
                feeLayer: '全部'
            }
        },
        _initMethod: function () {
            $that._initRoomCreateFeeAddInfo();
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                var _datanew = [];
                _data.forEach((item, index) => {
                    if (item.statusCd != "888800010015" && item.statusCd != "888800010016") {
                        _datanew.push(item);
                    }
                });
                $that.roomCreateFeeAddInfo.feeTypeCds = _datanew;
            });
        },
        _initEvent: function () {
            vc.on('roomCreateFeeAdd', 'openRoomCreateFeeAddModal',
                function (_room) {
                    $that.roomCreateFeeAddInfo.isMore = _room.isMore;
                    let room = _room.room;
                    if (!_room.isMore) {
                        $that.roomCreateFeeAddInfo.locationTypeCd = '5008';
                        $that.roomCreateFeeAddInfo.locationObjId = room.roomId;
                        $that.roomCreateFeeAddInfo.roomState.push('2003');
                        $that.roomCreateFeeAddInfo.roomState.push('2004');
                        $that.roomCreateFeeAddInfo.roomState.push('2005');
                        $that.roomCreateFeeAddInfo.locationTypeCdName = room.floorNum + '-' + room.unitNum + '-' + room.roomNum + '(' + room.ownerName + ')';
                    }
                    if (!_room.isMore && room.roomType == '2020602') {
                        $that.roomCreateFeeAddInfo.roomState.push('2006');
                        $that.roomCreateFeeAddInfo.roomState.push('2007');
                        $that.roomCreateFeeAddInfo.locationTypeCdName = room.floorNum + '-' + room.roomNum + '(' + room.ownerName + ')';
                        $that.roomCreateFeeAddInfo.roomType = room.roomType;
                    }
                    $('#roomCreateFeeAddModel').modal('show');
                });
            vc.on("roomCreateFeeAdd", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    $that.roomCreateFeeAddInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    $that.roomCreateFeeAddInfo.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    $that.roomCreateFeeAddInfo.roomId = _param.roomId;
                }
            });
        },
        methods: {
            _initRoomCreateFeeAddInfo: function () {
                $('.roomCreateFeeStartTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.roomCreateFeeStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".roomCreateFeeStartTime").val();
                        $that.roomCreateFeeAddInfo.startTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control roomCreateFeeStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            roomCreateFeeAddValidate() {
                return vc.validate.validate({
                        roomCreateFeeAddInfo: $that.roomCreateFeeAddInfo
                    },
                    {
                        'roomCreateFeeAddInfo.locationTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "收费范围不能为空"
                        },
                            {
                                limit: "num",
                                param: "",
                                errInfo: "收费范围格式错误"
                            },
                        ],
                        'roomCreateFeeAddInfo.locationObjId': [{
                            limit: "required",
                            param: "",
                            errInfo: "收费对象不能为空"
                        }],
                        'roomCreateFeeAddInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }],
                        'roomCreateFeeAddInfo.configId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用项目不能为空"
                        }],
                        'roomCreateFeeAddInfo.roomState': [{
                            limit: "required",
                            param: "",
                            errInfo: "房屋状态不能为空"
                        }],
                        'roomCreateFeeAddInfo.startTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "计费起始时间不能为空"
                        },
                            {
                                limit: "datetime",
                                param: "",
                                errInfo: "计费起始时间格式错误 YYYY-MM-DD hh:mm:ss"
                            }]
                    });
            },
            saveRoomCreateFeeInfo: function () {
                $that.roomCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                if ($that.roomCreateFeeAddInfo.locationTypeCd == '1000') { //大门时直接写 小区ID
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.communityId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '2000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.unitId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '3000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.roomId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '4000') {
                    $that.roomCreateFeeAddInfo.locationObjId = $that.roomCreateFeeAddInfo.floorId;
                } else if ($that.roomCreateFeeAddInfo.locationTypeCd == '5008') {
                } else {
                    vc.toast("收费范围错误");
                    return;
                }
                if (!$that.roomCreateFeeAddValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.roomCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                let _roomCreateFeeAddInfo = JSON.parse(JSON.stringify($that.roomCreateFeeAddInfo));
                if (_roomCreateFeeAddInfo.locationTypeCd == '5008') {
                    _roomCreateFeeAddInfo.locationTypeCd = '3000';
                }
                _roomCreateFeeAddInfo.roomState = _roomCreateFeeAddInfo.roomState.join(',');
                vc.http.post('roomCreateFeeAdd', 'save',
                    JSON.stringify(_roomCreateFeeAddInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            var _json = JSON.parse(json);
                            $('#roomCreateFeeAddModel').modal('hide');
                            $that.clearAddFeeConfigInfo();
                            vc.toast("创建收费成功，总共[" + _json.totalRoom + "]房屋，成功[" + _json.successRoom + "],失败[" + _json.errorRoom + "]", 8000);
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeConfigInfo: function () {
                var _feeTypeCds = $that.roomCreateFeeAddInfo.feeTypeCds;
                $that.roomCreateFeeAddInfo = {
                    feeConfigs: [],
                    locationTypeCd: '',
                    locationObjId: '',
                    floorId: '',
                    floorNum: '',
                    floorName: '',
                    unitId: '',
                    unitName: '',
                    roomId: '',
                    feeTypeCd: '',
                    configId: '',
                    billType: '',
                    roomState: ['2001'],
                    roomType: '1010301',
                    isMore: false,
                    locationTypeCdName: '',
                    startTime: '',
                    feeLayer: '全部'
                };
                $that.roomCreateFeeAddInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCdX: function (_feeTypeCd) {
                $that.roomCreateFeeAddInfo.configId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: 'F',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.roomCreateFeeAddInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _createFeeAddChangeRoomType: function () {
                if ($that.roomCreateFeeAddInfo.roomType == '1010301') {
                    $that.roomCreateFeeAddInfo.roomState = ['2001'];
                } else {
                    $that.roomCreateFeeAddInfo.roomState = ['2006'];
                }
            },
            _changeFeeLayer: function () {
                let _feeLayer = $that.roomCreateFeeAddInfo.feeLayer;
                if (_feeLayer == '全部') {
                    $that.roomCreateFeeAddInfo.feeLayer = ''
                } else {
                    $that.roomCreateFeeAddInfo.feeLayer = '全部'
                }
            }
        }
    });
})(window.vc);