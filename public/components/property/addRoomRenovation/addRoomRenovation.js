(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRoomRenovationInfo: {
                rId: '',
                roomId:'',
                roomName: '',
                personName: '',
                personTel: '',
                startTime: '',
                endTime: '',
                remark: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addRoomRenovation', 'openAddRoomRenovationModal', function () {
                $('#addRoomRenovationModel').modal('show');
            });
        },
        methods: {
            addRoomRenovationValidate() {
                return vc.validate.validate({
                    addRoomRenovationInfo: vc.component.addRoomRenovationInfo
                }, {
                    'addRoomRenovationInfo.roomName': [
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
                    'addRoomRenovationInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "联系人格式错误"
                        },
                    ],
                    'addRoomRenovationInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "联系电话错误"
                        },
                    ],
                    'addRoomRenovationInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "装修时间错误"
                        },
                    ],
                    'addRoomRenovationInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'addRoomRenovationInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],




                });
            },
            saveRoomRenovationInfo: function () {
                if (!vc.component.addRoomRenovationValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addRoomRenovationInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addRoomRenovationInfo);
                    $('#addRoomRenovationModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'roomRenovation.saveRoomRenovation',
                    JSON.stringify(vc.component.addRoomRenovationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addRoomRenovationModel').modal('hide');
                            vc.component.clearAddRoomRenovationInfo();
                            vc.emit('roomRenovationManage', 'listRoomRenovation', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddRoomRenovationInfo: function () {
                vc.component.addRoomRenovationInfo = {
                    roomId:'',
                    roomName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',
                    remark: ''

                };
            },
            _queryRoom: function () {
                let _allNum = $that.addRoomRenovationInfo.roomName;
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
                            $that.addRoomRenovationInfo.allNum = '';
                            return;
                        }

                        $that.addRoomRenovationInfo.roomId = _rooms[0].roomId;
                        $that.addRoomRenovationInfo.personName = _rooms[0].ownerName;
                        $that.addRoomRenovationInfo.personTel = _rooms[0].link;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);
