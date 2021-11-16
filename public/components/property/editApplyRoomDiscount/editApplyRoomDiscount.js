(function (vc, vm) {
    vc.extends({
        data: {
            editApplyRoomDiscountInfo: {
                ardId: '',
                startTime: '',
                endTime: '',
                checkRemark: '',
                createRemark: '',
                state: ''
            }
        },
        _initMethod: function () {
            vc.component._initEeditApplyRoomDiscountDateInfo();
        },
        _initEvent: function () {
            vc.on('editApplyRoomDiscount', 'openEditApplyRoomDiscountModal', function (_params) {
                _params = JSON.parse(_params);
                delete _params.state;
                vc.component.refreshEditApplyRoomDiscountInfo();
                $('#editApplyRoomDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.editApplyRoomDiscountInfo);
                vc.component.editApplyRoomDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            _initEeditApplyRoomDiscountDateInfo: function () {
                $('.editStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editStartTime").val();
                        vc.component.editApplyRoomDiscountInfo.startTime = value;
                    });
                $('.editEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editEndTime").val();
                        var start = Date.parse(new Date(vc.component.editApplyRoomDiscountInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间")
                            $(".editEndTime").val('')
                        } else {
                            vc.component.editApplyRoomDiscountInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editApplyRoomDiscountValidate: function () {
                return vc.validate.validate({
                    editApplyRoomDiscountInfo: vc.component.editApplyRoomDiscountInfo
                }, {
                    'editApplyRoomDiscountInfo.startTime': [
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
                    'editApplyRoomDiscountInfo.endTime': [
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
                    'editApplyRoomDiscountInfo.checkRemark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "验房说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "申请申请说明"
                        },
                    ],
                    'editApplyRoomDiscountInfo.ardId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请ID不能为空"
                        }],
                    'editApplyRoomDiscountInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "验房状态不能为空"
                        }]
                });
            },
            editApplyRoomDiscount: function () {
                if (!vc.component.editApplyRoomDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/applyRoomDiscount/updateApplyRoomDiscount',
                    JSON.stringify(vc.component.editApplyRoomDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editApplyRoomDiscountModel').modal('hide');
                            vc.emit('applyRoomDiscountManage', 'listApplyRoomDiscount', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditApplyRoomDiscountInfo: function () {
                vc.component.editApplyRoomDiscountInfo = {
                    ardId: '',
                    startTime: '',
                    endTime: '',
                    checkRemark: '',
                    createRemark: '',
                    state: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
