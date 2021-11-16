(function (vc, vm) {

    vc.extends({
        data: {
            editApplyRoomDiscountRecordInfo: {
                ardId: '',
                roomName: '',
                roomId: '',
                discountId: '',
                discountName: '',
                applyTypeName: '',
                createUserName: '',
                createUserTel: '',
                startTime: '',
                endTime: '',
                stateName: '',
                state: '',
                applyRoomDiscountRecords: [],
                communityId: ''
            }
        },
        _initMethod: function () {
            $that._initEditApplyRoomDiscountRecordInfo();
        },
        _initEvent: function () {
            vc.on('editApplyRoomDiscountRecord', 'openEditApplyRoomDiscountRecordModal', function (_params) {
                vc.component.refreshEditApplyRoomDiscountRecordInfo();
                $('#editApplyRoomDiscountRecordModel').modal('show');
                vc.copyObject(_params, vc.component.editApplyRoomDiscountRecordInfo);
                vc.component.editApplyRoomDiscountRecordInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEditApplyRoomDiscountRecordInfo: function () {
                $('.startTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.editApplyRoomDiscountRecordInfo.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.editApplyRoomDiscountRecordInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于计费起始时间")
                            vc.component.editApplyRoomDiscountRecordInfo.endTime = "";
                        } else {
                            vc.component.editApplyRoomDiscountRecordInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editApplyRoomDiscountRecordValidate: function () {
                return vc.validate.validate({
                    editApplyRoomDiscountRecordInfo: vc.component.editApplyRoomDiscountRecordInfo
                }, {
                    'editApplyRoomDiscountRecordInfo.ardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请id不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.roomName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.applyTypeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请类型不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.createUserName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ],
                    'editApplyRoomDiscountRecordInfo.stateName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        }
                    ]
                });
            },
            editApplyRoomDiscountRecord: function () {
                if (!vc.component.editApplyRoomDiscountRecordValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/editApplyRoomDiscount',
                    JSON.stringify(vc.component.editApplyRoomDiscountRecordInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editApplyRoomDiscountRecordModel').modal('hide');
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
            refreshEditApplyRoomDiscountRecordInfo: function () {
                vc.component.editApplyRoomDiscountRecordInfo = {
                    ardId: '',
                    roomName: '',
                    roomId: '',
                    discountId: '',
                    discountName: '',
                    applyTypeName: '',
                    createUserName: '',
                    createUserTel: '',
                    startTime: '',
                    endTime: '',
                    stateName: '',
                    state: '',
                    applyRoomDiscountRecords: [],
                    communityId: ''
                }
            }
        }
    });

})(window.vc, window.vc.component);
