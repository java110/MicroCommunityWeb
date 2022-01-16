(function (vc) {

    vc.extends({
     
        data: {
            addParkingSpaceApplyInfo: {
                paName: '',
                paId: '',
                psId: '',
                psName:'',
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
                feeConfigs:[]

            }
        },
        _initMethod: function () {
            vc.component.addParkingSpaceApplyInfo.applyId = vc.getParam('applyId');
            vc.component._listParkingSpaceApply();
            vc.component._listFeeConfigs();

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
                    vc.component.addParkingSpaceApplyInfo.startTime = value;
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
                    vc.component.addParkingSpaceApplyInfo.endTime = value;
            });
        },
        _initEvent: function () {
            vc.on('addParkingSpaceApply', 'chooseParkingArea', function (_parkingArea) {
                vc.component.addParkingSpaceApplyInfo.paId = _parkingArea.paId;
                vc.component.addParkingSpaceApplyInfo.paName = _parkingArea.num;
            });
      
        },
        methods: {

              //查询方法
              _listFeeConfigs: function (){
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        feeTypeCd: "888800010008",//默认停车费
                        communityId : vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('feeConfigManage', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.addParkingSpaceApplyInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            addParkingSpaceApplyValidate() {
                return vc.validate.validate({
                    addParkingSpaceApplyInfo: vc.component.addParkingSpaceApplyInfo
                }, {
                    'addParkingSpaceApplyInfo.psId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车位不能为空"
                        }
                    ],
                    'addParkingSpaceApplyInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        }
                    ]
                });
            },
            _listParkingSpaceApply:function(){
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        applyId: vc.component.addParkingSpaceApplyInfo.applyId
                    }
               };

               //发送get请求
               vc.http.apiGet('parkingSpaceApply.listParkingSpaceApply',
                             param,
                             function(json,res){
                                var _parkingSpaceApplyManageInfo=JSON.parse(json);
                                var _apply = _parkingSpaceApplyManageInfo.data[0];
                                vc.copyObject(_apply, vc.component.addParkingSpaceApplyInfo);
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            
            auditParkingSpaceApplyInfo: function () {
                if (vc.component.addParkingSpaceApplyInfo.state == "") {
                    vc.toast("请选择审核结果");
                    return;
                }
                if (vc.component.addParkingSpaceApplyInfo.state == 2002 && !vc.component.addParkingSpaceApplyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                if (vc.component.addParkingSpaceApplyInfo.state == 4004 && vc.component.addParkingSpaceApplyInfo.remark2 == "") {
                    vc.toast("审核结果不通过时，必须填写意见");
                    return;
                }
                vc.component.addParkingSpaceApplyInfo.remark = vc.component.addParkingSpaceApplyInfo.remark+"审核意见："+vc.component.addParkingSpaceApplyInfo.remark2;
                vc.http.apiPost(
                    'parkingSpaceApply.updateParkingSpaceApply',
                    JSON.stringify(vc.component.addParkingSpaceApplyInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast('保存成功');
                            vc.component.clearAddParkingSpaceApplyInfo();
                            $that._goBack();
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            clearAddParkingSpaceApplyInfo: function () {
                vc.component.addParkingSpaceApplyInfo = {
                    paId: '',
                    psId: '',
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
            _goBack: function () {
                vc.goBack();
            },
            _openChooseParkingArea: function () {
                vc.emit('chooseParkingArea', 'openChooseParkingAreaModel', {});
            },
            _openChooseParkingSpace: function () {
                vc.emit('chooseParkingSpace', 'openChooseParkingSpaceModel', $that.addParkingSpaceApplyInfo);
            },
        }
    });

})(window.vc);
