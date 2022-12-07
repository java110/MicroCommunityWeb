(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCarBlackWhiteInfo: {
                bwId: '',
                blackWhite: '',
                carNum: '',
                startTime: '',
                endTime: '',
                paId: ''
            }
        },
        _initMethod: function () {
            vc.component._initAddCarBlackWhiteDateInfo();
        },
        _initEvent: function () {
            vc.on('addCarBlackWhite', 'openAddCarBlackWhiteModal',
                function () {
                    $('#addCarBlackWhiteModel').modal('show');
                });
            vc.on('addCarBlackWhite', 'notify',
                function (_param) {
                    if (_param.hasOwnProperty('paId')) {
                        $that.addCarBlackWhiteInfo.paId = _param.paId;
                    }
                });
        },
        methods: {
            _initAddCarBlackWhiteDateInfo: function () {
                vc.component.addCarBlackWhiteInfo.startTime = vc.dateTimeFormat(new Date().getTime());
                $('.addCarBlackWhiteStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addCarBlackWhiteStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addCarBlackWhiteStartTime").val();
                        vc.component.addCarBlackWhiteInfo.startTime = value;
                    });
                $('.addCarBlackWhiteEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addCarBlackWhiteEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addCarBlackWhiteEndTime").val();
                        var start = Date.parse(new Date(vc.component.addCarBlackWhiteInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".addCarBlackWhiteEndTime").val('')
                        } else {
                            vc.component.addCarBlackWhiteInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addCarBlackWhiteStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addCarBlackWhiteEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addCarBlackWhiteValidate() {
                return vc.validate.validate({
                    addCarBlackWhiteInfo: vc.component.addCarBlackWhiteInfo
                }, {
                    'addCarBlackWhiteInfo.blackWhite': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名单类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "名单类型格式错误"
                        },
                    ],
                    'addCarBlackWhiteInfo.carNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,12",
                            errInfo: "车牌号大于12位"
                        },
                    ],
                    'addCarBlackWhiteInfo.paId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "停车场不能为空"
                        }
                    ],
                    'addCarBlackWhiteInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "不是有效的时间格式"
                        },
                    ],
                    'addCarBlackWhiteInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "不是有效的时间格式"
                        },
                    ],
                });
            },
            saveCarBlackWhiteInfo: function () {
                if (!vc.component.addCarBlackWhiteValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addCarBlackWhiteInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCarBlackWhiteInfo);
                    $('#addCarBlackWhiteModel').modal('hide');
                    return;
                }
                vc.http.apiPost('/carBlackWhite.saveCarBlackWhite', JSON.stringify(vc.component.addCarBlackWhiteInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCarBlackWhiteModel').modal('hide');
                            vc.component.clearAddCarBlackWhiteInfo();
                            vc.emit('carBlackWhiteManage', 'listCarBlackWhite', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddCarBlackWhiteInfo: function () {
                vc.component.addCarBlackWhiteInfo = {
                    blackWhite: '',
                    carNum: '',
                    startTime: '',
                    endTime: '',
                    paId: ''
                };
            }
        }
    });
})(window.vc);