(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            roomToExamineInfo: {
                rId: '',
                roomName: '',
                state: '',
                remark: '',
                examineRemark: '',
                roomId: '',
                userId: '',
                startTime: '',
                endTime: '',
                detailType: '1001'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomToExamine', 'openRoomToExamineModal', function (_param) {
                $that.clearRoomToExamineInfo();
                $that.roomToExamineInfo.rId = _param.rId;
                $that.roomToExamineInfo.roomName = _param.roomName;
                $that.roomToExamineInfo.roomId = _param.roomId;
                $that.roomToExamineInfo.startTime = _param.startTime;
                $that.roomToExamineInfo.endTime = _param.endTime;
                $that.roomToExamineInfo.userId = _param.userId;
                $('#roomToExamineModel').modal('show');
            });
        },
        methods: {
            roomToExamineValidate() {
                return vc.validate.validate({
                    roomToExamineInfo: vc.component.roomToExamineInfo
                }, {
                    'roomToExamineInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "状态格式错误"
                        },
                    ],
                    'roomToExamineInfo.examineRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审核意见不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "审核意见错误"
                        },
                    ],
                    'roomToExamineInfo.rId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修Id不能为空"
                        }
                    ]
                });
            },
            saveRoomToExamineInfo: function () {
                if (!vc.component.roomToExamineValidate() && vc.component.roomToExamineInfo.state == '2000') {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.roomToExamineInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.roomToExamineInfo);
                    $('#roomToExamineModel').modal('hide');
                    return;
                }
                vc.component.roomToExamineInfo.roomName = vc.component.roomToExamineInfo.roomName.trim();
                if (vc.component.roomToExamineInfo.examineRemark != null && vc.component.roomToExamineInfo.examineRemark !== ''
                    && vc.component.roomToExamineInfo.examineRemark !== 'undefined') {
                    vc.component.roomToExamineInfo.examineRemark = vc.component.roomToExamineInfo.examineRemark.trim();
                }
                vc.http.apiPost(
                    '/roomRenovation/updateRoomToExamine',
                    JSON.stringify(vc.component.roomToExamineInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#roomToExamineModel').modal('hide');
                            vc.component.clearRoomToExamineInfo();
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
            clearRoomToExamineInfo: function () {
                vc.component.roomToExamineInfo = {
                    rId: '',
                    roomId: '',
                    state: '',
                    remark: '',
                    detailType: '1001'
                };
            },
        }
    });
})(window.vc);
