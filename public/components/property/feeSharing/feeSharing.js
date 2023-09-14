(function (vc) {
    vc.extends({
        data: {
            feeSharingInfo: {
                totalDegrees: '',
                scope: '1001',
                formulaId: '',
                floorId: '',
                unitId: '',
                objId: '',
                feeTypeCd: '',
                startTime: '',
                endTime: '',
                feeName: '',
                formulas: [],
                remark: '',
                roomState: ['2001'],
                roomType: '1010301',
                feeLayer: '全部'
            }
        },
        _initMethod: function () {
            $that._initFeeSharingDateInfo();
            $that._loadFormula();
        },
        _initEvent: function () {
            vc.on('feeSharing', 'openFeeSharingModal', function (_param) {
                $('#feeSharingModel').modal('show');
            });
            vc.on("feeSharing", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    $that.feeSharingInfo.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    $that.feeSharingInfo.unitId = _param.unitId;
                }
            });
        },
        methods: {
            _initFeeSharingDateInfo: function () {
                $('.feeSharingStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.feeSharingStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".feeSharingStartTime").val();
                        $that.feeSharingInfo.startTime = value;
                    });
                $('.feeSharingEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.feeSharingEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".feeSharingEndTime").val();
                        var start = Date.parse(new Date($that.feeSharingInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".addCurReadingTime").val('')
                        } else {
                            $that.feeSharingInfo.endTime = value;
                        }
                    });
            },
            feeSharingValidate() {
                return vc.validate.validate({
                    feeSharingInfo: $that.feeSharingInfo
                }, {
                    'feeSharingInfo.totalDegrees': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用量不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "使用量格式错误，如100.00"
                        }
                    ],
                    'feeSharingInfo.scope': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用范围不能为空"
                        }
                    ],
                    'feeSharingInfo.formulaId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公摊公式不能为空"
                        }
                    ],
                    'feeSharingInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        },
                    ], 'feeSharingInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        },
                    ],
                    'feeSharingInfo.feeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用名称必填"
                        }
                    ]
                });
            },
            saveFeeSharingInfo: function () {
                if ($that.feeSharingInfo.scope == '1001') {
                    $that.feeSharingInfo.objId = vc.getCurrentCommunity().communityId;
                } else if ($that.feeSharingInfo.scope == '2002') {
                    $that.feeSharingInfo.objId = $that.feeSharingInfo.floorId;
                } else {
                    $that.feeSharingInfo.objId = $that.feeSharingInfo.unitId;
                }
                if (!$that.feeSharingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _objId = $that.feeSharingInfo.objId;
                if (_objId == '' || _objId == '-1') {
                    vc.toast("请选择公摊楼栋或者单元");
                    return;
                }
                $that.feeSharingInfo.communityId = vc.getCurrentCommunity().communityId;
                $that.feeSharingInfo.roomState = $that.feeSharingInfo.roomState.join(',');
                vc.http.apiPost(
                    '/importFee/feeSharing',
                    JSON.stringify($that.feeSharingInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#feeSharingModel').modal('hide');
                            $that.clearFeeSharingInfo();
                            vc.emit('roomFeeImport', 'listFee', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            _loadFormula: function (_roomId) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeFormula/queryFeeFormula', param,
                    function (json, res) {
                        let _formulas = JSON.parse(json);
                        let _total = _formulas.total;
                        if (_total < 1) {
                            return;
                        }
                        $that.feeSharingInfo.formulas = _formulas.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            clearFeeSharingInfo: function () {
                let _formulas = $that.feeSharingInfo.formulas;
                $that.feeSharingInfo = {
                    totalDegrees: '',
                    scope: '1001',
                    formulaId: '',
                    floorId: '',
                    unitId: '',
                    objId: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: '',
                    feeName: '',
                    formulas: _formulas,
                    remark: '',
                    roomState: ['2001'],
                    roomType: '1010301',
                    feeLayer: '全部'
                };
            },
            feeSharingChangeRoomType: function () {
                if ($that.feeSharingInfo.roomType == '1010301') {
                    $that.feeSharingInfo.roomState = ['2001'];
                } else {
                    $that.feeSharingInfo.roomState = ['2006'];
                }
            },
            _changeShareFeeLayer: function () {
                let _feeLayer = $that.feeSharingInfo.feeLayer;

                if (_feeLayer == '全部') {
                    $that.feeSharingInfo.feeLayer = ''
                } else {
                    $that.feeSharingInfo.feeLayer = '全部'
                }
            }
        }
    });
})(window.vc);
