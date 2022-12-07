(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addRoomRenovationInfo: {
                rId: '',
                roomId: '',
                roomName: '',
                personName: '',
                personTel: '',
                startTime: '',
                endTime: '',
                remark: '',
                userId: '',
                isPostpone: 'N',
                // postponeTime: '',
                renovationCompany: '',
                personMain: '',
                personMainTel: ''
            }
        },
        _initMethod: function () {
            vc.component._initAddRoomRenovationInfo();
        },
        _initEvent: function () {
            vc.on('addRoomRenovation', 'openAddRoomRenovationModal', function (_param) {
                // vc.component.addRoomRenovationInfo.userId = _param[0].userId
                $('#addRoomRenovationModel').modal('show');
            });
            /* vc.initDate('addStartTime', function (_startTime) {
                 $that.addRoomRenovationInfo.startTime = _startTime;
             });
             vc.initDate('addEndTime', function (_endTime) {
                 $that.addRoomRenovationInfo.endTime = _endTime;
                 let start = Date.parse(new Date($that.addRoomRenovationInfo.startTime))
                 let end = Date.parse(new Date($that.addRoomRenovationInfo.endTime))
                 if (start - end >= 0) {
                     vc.toast("结束时间必须大于开始时间")
                     $that.addRoomRenovationInfo.endTime = '';
                 }
             });*/
        },
        methods: {
            _initAddRoomRenovationInfo: function () {
                $('.addStartTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addStartTime").val();
                        vc.component.addRoomRenovationInfo.startTime = value;
                    });
                $('.addEndTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addEndTime").val();
                        var start = Date.parse(new Date(vc.component.addRoomRenovationInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".addEndTime").val('')
                        } else {
                            vc.component.addRoomRenovationInfo.endTime = value;
                        }
                    });
                // $('.addPostponeTime').datetimepicker({
                //     minView: "month",
                //     language: 'zh-CN',
                //     fontAwesome: 'fa',
                //     format: 'yyyy-mm-dd',
                //     initTime: true,
                //     initialDate: new Date(),
                //     autoClose: 1,
                //     todayBtn: true
                // });
                // $('.addPostponeTime').datetimepicker()
                //     .on('changeDate', function (ev) {
                //         var value = $(".addPostponeTime").val();
                //         vc.component.addRoomRenovationInfo.postponeTime = value;
                //     });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName("form-control addStartTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                // document.getElementsByClassName("form-control addPostponeTime")[0].addEventListener('click', myfunc)
                // function myfunc(e) {
                //     e.currentTarget.blur();
                // }
            },
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
                        }
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
                        }
                    ],
                    'addRoomRenovationInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系电话错误"
                        }
                    ],
                    'addRoomRenovationInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修开始时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "装修开始时间错误"
                        }
                    ],
                    'addRoomRenovationInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "装修结束时间错误"
                        }
                    ],
                    // 'addRoomRenovationInfo.isPostpone': [
                    //     {
                    //         limit: "required",
                    //         param: "",
                    //         errInfo: "是否延期不能为空"
                    //     }
                    // ],
                    'addRoomRenovationInfo.renovationCompany': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修单位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "装修单位格式错误"
                        }
                    ],
                    'addRoomRenovationInfo.personMain': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修负责人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "装修负责人格式错误"
                        }
                    ],
                    'addRoomRenovationInfo.personMainTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修负责人电话不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "装修负责人电话错误"
                        }
                    ],
                    'addRoomRenovationInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        }
                    ]
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
                vc.component.addRoomRenovationInfo.roomName = vc.component.addRoomRenovationInfo.roomName.trim();
                vc.component.addRoomRenovationInfo.remark = vc.component.addRoomRenovationInfo.remark.trim();
                vc.http.apiPost(
                    '/roomRenovation/saveRoomRenovation',
                    JSON.stringify(vc.component.addRoomRenovationInfo), {
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
            clearAddRoomRenovationInfo: function () {
                vc.component.addRoomRenovationInfo = {
                    roomId: '',
                    roomName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    isPostpone: 'N',
                    // postponeTime: '',
                    renovationCompany: '',
                    personMain: '',
                    personMainTel: ''
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
                vc.http.apiGet('/fee.listRoomsWhereFeeSet',
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
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo)
                        $that.addRoomRenovationInfo.roomId = "";
                        $that.addRoomRenovationInfo.personName = "";
                        $that.addRoomRenovationInfo.personTel = "";
                    }
                );
            }
        }
    });
})(window.vc);