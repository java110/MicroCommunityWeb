(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            applyRoomDiscountRecordInfo: {
                ardId: '',
                roomName: '',
                state: '',
                stateName: '',
                remark: '',
                roomId: '',
                photos: [],
                videoName: '',
                url: '',
                detailType: '1001',
                isTrue: '',
                communityId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('applyRoomDiscountRecord', 'openApplyRoomDiscountRecordModal', function (_param) {
                $that.clearApplyRoomDiscountRecordInfo();
                $that.applyRoomDiscountRecordInfo.ardId = _param[0];
                $that.applyRoomDiscountRecordInfo.state = _param[1];
                $that.applyRoomDiscountRecordInfo.stateName = _param[2];
                $that.applyRoomDiscountRecordInfo.roomId = _param[3];
                $that.applyRoomDiscountRecordInfo.roomName = _param[4];
                $('#applyRoomDiscountRecordModel').modal('show');
            });
            vc.on("applyRoomDiscountRecord", "notifyUploadImage", function (_param) {
                vc.component.applyRoomDiscountRecordInfo.photos = _param;
            });
            vc.on("applyRoomDiscountRecord", "notifyUploadVedio", function (_param) {
                vc.component.applyRoomDiscountRecordInfo.videoName = _param.realFileName;
            });
        },
        methods: {
            applyRoomDiscountRecordInfoValidate() {
                return vc.validate.validate({
                    applyRoomDiscountRecordInfo: vc.component.applyRoomDiscountRecordInfo
                }, {
                    'applyRoomDiscountRecordInfo.state': [
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
                    'applyRoomDiscountRecordInfo.isTrue': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否违规不能为空"
                        }
                    ],
                    'applyRoomDiscountRecordInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注错误"
                        },
                    ],
                    'applyRoomDiscountRecordInfo.ardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠申请Id不能为空"
                        }
                    ]
                });
            },
            saveApplyRoomDiscountRecordInfo: function () {
                if (!vc.component.applyRoomDiscountRecordInfoValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.applyRoomDiscountRecordInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.applyRoomDiscountRecordInfo);
                    $('#applyRoomDiscountRecordModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
                    JSON.stringify(vc.component.applyRoomDiscountRecordInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#applyRoomDiscountRecordModel').modal('hide');
                            vc.component.clearApplyRoomDiscountRecordInfo();
                            vc.emit('listApplyRoomDiscountRecord', 'listApplyRoomDiscountRecords', {});
                            location.reload();
                            vc.toast(_json.msg);
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearApplyRoomDiscountRecordInfo: function () {
                vc.component.applyRoomDiscountRecordInfo = {
                    ardrId: '',
                    roomName: '',
                    state: '',
                    stateName: '',
                    remark: '',
                    roomId: '',
                    photos: [],
                    videoName: '',
                    url: '',
                    detailType: '1001',
                    isTrue: '',
                    isTrues: []
                };
            },
        }
    });
})(window.vc);
