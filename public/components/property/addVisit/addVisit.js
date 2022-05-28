/**
 权限组
 **/
(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addVisitInfo: {
                vName: '',
                visitGender: '',
                phoneNumber: '',
                visitTime: '',
                departureTime: '',
                carNum: '',
                entourage: 0,
                paId: '',
                psId: '',
                num: '',
                parkingSpaceNum: '',
                parkingAreas: [],
                parkingSpaces: []
            }
        },
        _initMethod: function () {
            vc.component._initAddVisitInfo();
            // vc.component.queryParkingAreas();
        },
        _initEvent: function () {
            vc.on('addVisit', 'openAddVisitAppModal', function (_app) {
                $("#addNewVisitModel").modal("show");
            });
            vc.on('addVisit', 'onIndex', function (_index) {
                // vc.component.newVisitInfo.index = _index;
                // vc.emit('addVisitSpace', 'notify', _index);
            });
            vc.on('addVisit', 'clearInfo', function () {
                vc.component._clearAddVisitInfo();
            });
        },
        methods: {
            addAppValidate() {
                return vc.validate.validate({
                    addVisitInfo: vc.component.addVisitInfo
                }, {
                    'addVisitInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'addVisitInfo.visitGender': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客性别不能为空"
                        }
                    ],
                    'addVisitInfo.entourage': [
                        // {
                        //     limit: "required",
                        //     param: "",
                        //     errInfo: "随行人数不能为空"
                        // },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "随行人数有误"
                        }
                    ],
                    'addVisitInfo.phoneNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "访客手机号不正确"
                        },
                    ],
                    'addVisitInfo.visitTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        },
                    ],
                    'addVisitInfo.departureTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "访客时间格式错误"
                        },
                    ]
                });
            },
            _addNewVisitInfo() {
                if (!vc.component.addAppValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addVisitInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.emit("viewVisitInfo", "addNewVisit", vc.component.addVisitInfo);
                $('#addNewVisitModel').modal('hide');
            },
            _openAddAppInfoModel() {
                vc.emit('addApp', 'openAddAppModal', {});
            },
            _loadAppInfoData: function () {
            },
            _initAddVisitInfo: function () {
                vc.component.addVisitInfo.visitTime = vc.dateTimeFormat(new Date().getTime());
                $('.addVisitTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addVisitTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addVisitTime").val();
                        vc.component.addVisitInfo.visitTime = value;
                        let start = Date.parse(new Date(vc.component.addVisitInfo.visitTime))
                        let end = Date.parse(new Date(vc.component.addVisitInfo.departureTime))
                        if (end != 0 && start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间")
                            vc.component.addVisitInfo.visitTime = '';
                        }
                    });
                $('.addDepartureTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addDepartureTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addDepartureTime").val();
                        vc.component.addVisitInfo.departureTime = value;
                        let start = Date.parse(new Date(vc.component.addVisitInfo.visitTime))
                        let end = Date.parse(new Date(vc.component.addVisitInfo.departureTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            vc.component.addVisitInfo.departureTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control addVisitTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control addDepartureTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _clearAddVisitInfo: function () {
                vc.component.addVisitInfo.vName = '';
                vc.component.addVisitInfo.visitGender = '';
                vc.component.addVisitInfo.phoneNumber = '';
                vc.component.addVisitInfo.visitTime = '';
                vc.component.addVisitInfo.departureTime = '';
                vc.component.addVisitInfo.carNum = '';
                vc.component.addVisitInfo.entourage = 0;
                vc.component.addVisitInfo.paId = '';
                vc.component.addVisitInfo.psId = '';
                vc.component.addVisitInfo.num = '';
                vc.component.addVisitInfo.parkingSpaceNum = '';
            }
        }
    });
})(window.vc);