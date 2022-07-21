(function(vc) {

    vc.extends({

        data: {
            auditParkingSpaceApplyInfo: {
                psId: '',
                psName: '',
                applyId: '',
                carNum: '',
                carBrand: '',
                carType: '',
                carColor: '',
                startTime: '',
                endTime: '',
                applyPersonName: '',
                applyPersonLink: '',
                applyPersonId: '',
                state: '',
                remark: '',
                configId: '',
                remark2: '',
                feeConfigs: []

            }
        },
        _initMethod: function() {
            $that.auditParkingSpaceApplyInfo.applyId = vc.getParam('applyId');
            $that._listParkingSpaceApply();
            $that._listFeeConfigs();

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
                .on('changeDate', function(ev) {
                    var value = $(".editStartTime").val();
                    $that.auditParkingSpaceApplyInfo.startTime = value;
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
                .on('changeDate', function(ev) {
                    var value = $(".editEndTime").val();
                    $that.auditParkingSpaceApplyInfo.endTime = value;
                });
        },
        _initEvent: function() {
            vc.on('auditParkingSpaceApply', 'chooseParkingSpace', function(_parkingArea) {
                $that.auditParkingSpaceApplyInfo.psId = _parkingArea.psId;
                $that.auditParkingSpaceApplyInfo.psName = _parkingArea.num;
            });

        },
        methods: {
            //查询方法
            _listFeeConfigs: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        feeTypeCd: "888800010008", //默认停车费
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('feeConfigManage', 'list', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.auditParkingSpaceApplyInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            auditParkingSpaceApplyValidate() {
                return vc.validate.validate({
                    auditParkingSpaceApplyInfo: $that.auditParkingSpaceApplyInfo
                }, {
                    'auditParkingSpaceApplyInfo.psId': [{
                        limit: "required",
                        param: "",
                        errInfo: "车位不能为空"
                    }],
                    'auditParkingSpaceApplyInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项不能为空"
                    }]
                });
            },
            _listParkingSpaceApply: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: $that.auditParkingSpaceApplyInfo.applyId
                    }
                };

                //发送get请求
                vc.http.apiGet('parkingSpaceApply.listParkingSpaceApply',
                    param,
                    function(json, res) {
                        let _parkingSpaceApplyManageInfo = JSON.parse(json);
                        let _apply = _parkingSpaceApplyManageInfo.data[0];
                        vc.copyObject(_apply, $that.auditParkingSpaceApplyInfo);
                        $that.auditParkingSpaceApplyInfo.state = '';
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _doAuditParkingSpaceApply: function() {
                if (!$that.auditParkingSpaceApplyInfo.state) {
                    vc.toast("请选择审核结果");
                    return;
                }
                if ($that.auditParkingSpaceApplyInfo.state == '2002' && !$that.auditParkingSpaceApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if ($that.auditParkingSpaceApplyInfo.state == '4004' && !$that.auditParkingSpaceApplyInfo.remark2) {
                    vc.toast("审核结果不通过时，必须填写意见");
                    return;
                }
                $that.auditParkingSpaceApplyInfo.remark = $that.auditParkingSpaceApplyInfo.remark + "审核意见：" + $that.auditParkingSpaceApplyInfo.remark2;
                vc.http.apiPost(
                    '/parkingSpaceApply.auditParkingSpaceApply',
                    JSON.stringify($that.auditParkingSpaceApplyInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('保存成功');
                            $that.clearAddParkingSpaceApplyInfo();
                            $that._goBack();
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            clearAddParkingSpaceApplyInfo: function() {
                $that.auditParkingSpaceApplyInfo = {
                    psId: '',
                    psName: '',
                    carNum: '',
                    carBrand: '',
                    carType: '',
                    carColor: '',
                    startTime: '',
                    endTime: '',
                    applyPersonName: '',
                    applyPersonLink: '',
                    applyPersonId: '',
                    state: '',
                    remark: '',

                };
            },
            _goBack: function() {
                vc.goBack();
            },
            _openChooseParkingArea: function() {
                vc.emit('chooseParkingArea', 'openChooseParkingAreaModel', {});
            },
            _openChooseParkingSpace: function() {
                vc.emit('searchParkingSpace', 'openSearchParkingSpaceModel', {});
            },
        }
    });

})(window.vc);