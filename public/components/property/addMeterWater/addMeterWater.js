(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMeterWaterInfo: {
                waterId: '',
                meterType: '',
                preDegrees: '',
                curDegrees: '',
                preReadingTime: '',
                curReadingTime: '',
                remark: '',
                roomId: '',
                objId: '',
                objName: '',
                feeTypeCd: '',
                feeConfigs: [],
                configId: '',
                objType: '1001',
                hasRoom: false,
                ownerName: '',
                objType: '3333'
            }
        },
        _initMethod: function () {
            $that._initAddMeterWaterDateInfo();
        },
        _initEvent: function () {
            vc.on('addMeterWater', 'openAddMeterWaterModal', function (_param) {
                console.log('params :', _param);
                if (_param.hasOwnProperty("objType")) {
                    $that.addMeterWaterInfo.objType = _param.objType;
                }
                if (_param.hasOwnProperty('roomId')) {
                    $that.addMeterWaterInfo.hasRoom = true;
                    $that.addMeterWaterInfo.roomId = _param.roomId;
                    $that.addMeterWaterInfo.objId = _param.roomId;
                    // $that.addMeterWaterInfo.objName = _param.roomName.replace('0单元', ''); //处理商铺
                    $that.addMeterWaterInfo.objName = $that.transRoomName(_param.roomName);
                    $that.addMeterWaterInfo.ownerName = _param.roomName + '(' + _param.ownerName + ')';
                    $that._queryPreMeterWater(_param.roomId);
                }
                $that.addMeterWaterInfo.preReadingTime = vcFramework.dateTimeFormat(new Date().getTime());
                $that.addMeterWaterInfo.preDegrees = 0;
                $('#addMeterWaterModel').modal('show');
            });
            vc.on("addMeterWater", "notify", function (_param) {
                if (_param.hasOwnProperty("roomId") && _param.roomId != "") {
                    vc.component.addMeterWaterInfo.roomId = _param.roomId;
                    vc.component.addMeterWaterInfo.objId = _param.roomId;
                    // $that.addMeterWaterInfo.objName = _param.name.replace('0单元', ''); //处理商铺;
                    $that.addMeterWaterInfo.objName = $that.transRoomName(_param.name);
                    $that._queryPreMeterWater(_param.roomId);
                }
            });
        },
        methods: {
            // 将1-1-1 转化为 1栋1单元1室
            transRoomName: function (roomName) {
                // 没有-则返回
                if (roomName.indexOf('-') < 0) {
                    return roomName;
                }
                roomName = roomName.split('-');
                return roomName[0] + '栋' + roomName[1] + '单元' + roomName[2] + '室';
            },
            _initAddMeterWaterDateInfo: function () {
                $('.addPreReadingTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addPreReadingTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addPreReadingTime").val();
                        vc.component.addMeterWaterInfo.preReadingTime = value;
                    });
                $('.addCurReadingTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addCurReadingTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addCurReadingTime").val();
                        var start = Date.parse(new Date(vc.component.addMeterWaterInfo.preReadingTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".addCurReadingTime").val('')
                        } else {
                            vc.component.addMeterWaterInfo.curReadingTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addPreReadingTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addCurReadingTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addMeterWaterValidate() {
                return vc.validate.validate({
                    addMeterWaterInfo: vc.component.addMeterWaterInfo
                }, {
                    'addMeterWaterInfo.preDegrees': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "上期度数不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "上期度数格式错误"
                        },
                    ],
                    'addMeterWaterInfo.curDegrees': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "本期度数不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "本期度数格式错误"
                        },
                    ],
                    'addMeterWaterInfo.preReadingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "上期读表时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "上期读表时间格式错误"
                        },
                    ],
                    'addMeterWaterInfo.curReadingTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "本期读表时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "本期读表时间格式错误"
                        },
                    ],
                    'addMeterWaterInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋必填"
                        }
                    ],
                    'addMeterWaterInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用必填"
                        }
                    ],
                    'addMeterWaterInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "备注格式错误"
                        },
                    ],
                });
            },
            saveMeterWaterInfo: function () {
                if (!vc.component.addMeterWaterValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addMeterWaterInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMeterWaterInfo);
                    $('#addMeterWaterModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'meterWater.saveMeterWater',
                    JSON.stringify(vc.component.addMeterWaterInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMeterWaterModel').modal('hide');
                            vc.component.clearAddMeterWaterInfo();
                            vc.emit('meterWaterManage', 'listMeterWater', {});
                            vc.emit('listRoomFee', 'notify', {});
                            vc.emit('listParkingSpaceFee', 'notify', {});
                            vc.emit('simplifyRoomFee', 'notify', {});
                            vc.emit('simplifyCarFee', 'notify', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _changeAddMeterWaterFeeTypeCd: function (_feeTypeCd) {
                var param = {
                    params: {
                        page: 1,
                        row: 20,
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
                        vc.component.addMeterWaterInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
                $that._queryPreMeterWater($that.addMeterWaterInfo.roomId);
            },
            _queryPreMeterWater: function (_roomId) {
                if(!_roomId){
                    return;
                }
                let _meterType = '1010';
                let _feeTypeCd = $that.addMeterWaterInfo.feeTypeCd;
                if (_feeTypeCd == '888800010015') {
                    _meterType = '2020';
                } else if (_feeTypeCd == '888800010009') {
                    _meterType = '3030';
                }
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: _roomId,
                        objType: $that.addMeterWaterInfo.objType,
                        meterType: _meterType
                    }
                };
                //发送get请求
                vc.http.apiGet('/meterWater/queryPreMeterWater', param,
                    function (json, res) {
                        let _meterWaterInfo = JSON.parse(json);
                        let _total = _meterWaterInfo.total;
                        if (_total < 1) {
                            $that.addMeterWaterInfo.preDegrees = '0';
                            $that.addMeterWaterInfo.preReadingTime = vcFramework.dateTimeFormat(new Date().getTime());
                            return;
                        }
                        $that.addMeterWaterInfo.preDegrees = _meterWaterInfo.data[0].curDegrees;
                        $that.addMeterWaterInfo.preReadingTime = _meterWaterInfo.data[0].curReadingTime;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            getChange: function () {
                //上期度数
                var preDegrees = parseFloat(vc.component.addMeterWaterInfo.preDegrees);
                //本期度数
                var curDegrees = parseFloat(vc.component.addMeterWaterInfo.curDegrees);
                if (preDegrees > curDegrees) {
                    vc.toast("本期度数不能小于上期度数！");
                    vc.component.addMeterWaterInfo.curDegrees = "";
                }
            },
            clearAddMeterWaterInfo: function () {
                vc.component.addMeterWaterInfo = {
                    waterId: '',
                    meterType: '',
                    preDegrees: '',
                    curDegrees: '',
                    preReadingTime: '',
                    curReadingTime: '',
                    remark: '',
                    roomId: '',
                    objId: '',
                    objName: '',
                    feeTypeCd: '',
                    feeConfigs: [],
                    configId: '',
                    objType: '1001',
                    hasRoom: false,
                    ownerName: '',
                    objType: '3333'
                };
            }
        }
    });
})(window.vc);
