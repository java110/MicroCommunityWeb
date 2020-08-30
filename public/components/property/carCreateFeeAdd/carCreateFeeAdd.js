(function(vc) {

    vc.extends({
        data: {
            carCreateFeeAddInfo: {
                feeTypeCds:[],
                feeConfigs:[],
                parkingAreas:[],
                locationTypeCd: '',
                locationObjId: '',
                carId: '',
                feeTypeCd:'',
                configId:'',
                carState:'SH',
                isMore:false,
                locationTypeCdName:'',
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config',"fee_type_cd",function(_data){
                vc.component.carCreateFeeAddInfo.feeTypeCds = _data;
            });

            vc.component._loadParkingAreas();

        },
        _initEvent: function() {
            vc.on('carCreateFeeAdd', 'openCarCreateFeeAddModal',
            function(_param) {
                vc.component.carCreateFeeAddInfo.isMore =_param.isMore;
                if(!_param.isMore){
                    vc.component.carCreateFeeAddInfo.locationTypeCd = '2000';
                    vc.component.carCreateFeeAddInfo.locationObjId = _param.car.carId;
                    vc.component.carCreateFeeAddInfo.carId = _param.car.carId;
                    vc.component.carCreateFeeAddInfo.locationTypeCdName = _param.car.carNum;
                }
                $('#carCreateFeeAddModel').modal('show');

            });
        },
        methods: {

            carCreateFeeAddValidate() {
                return vc.validate.validate({
                    carCreateFeeAddInfo: vc.component.carCreateFeeAddInfo
                },
                {
                    'carCreateFeeAddInfo.locationTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费范围不能为空"
                    },
                    {
                        limit: "num",
                        param: "",
                        errInfo: "收费范围格式错误"
                    },
                    ],
                    'carCreateFeeAddInfo.locationObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "收费对象不能为空"
                    }
                    ],
                    'carCreateFeeAddInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }
                    ],
                    'carCreateFeeAddInfo.configId': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用项目不能为空"
                    }
                    ],
                     'carCreateFeeAddInfo.carState': [{
                         limit: "required",
                         param: "",
                         errInfo: "出账类型不能为空"
                     }
                     ]
                });
            },
            saveCarCreateFeeInfo: function() {

                vc.component.carCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;
                if (vc.component.carCreateFeeAddInfo.locationTypeCd == '1000') { // 小区ID
                    vc.component.carCreateFeeAddInfo.locationObjId = vc.component.carCreateFeeAddInfo.communityId;
                } else if (vc.component.carCreateFeeAddInfo.locationTypeCd == '2000') {
                    vc.component.carCreateFeeAddInfo.locationObjId = vc.component.carCreateFeeAddInfo.carId;
                } else {
                    vc.toast("收费范围错误");
                    return;
                }

                if (!vc.component.carCreateFeeAddValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.component.carCreateFeeAddInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.post('parkingSpaceCreateFeeAdd', 'save', JSON.stringify(vc.component.carCreateFeeAddInfo), {
                    emulateJSON: true
                },
                function(json, res) {
                    if (res.status == 200) {
                        //关闭model
                        var _json = JSON.parse(json);
                        $('#carCreateFeeAddModel').modal('hide');
                        vc.component.clearAddFeeConfigInfo();
                        vc.toast("创建收费成功，总共["+_json.totalCar+"]车位，成功["+_json.successCar+"],失败["+_json.errorCar+"]",8000);
                        return;
                    }
                    vc.toast(json);

                },
                function(errInfo, error) {
                    console.log('请求失败处理');

                    vc.toast(errInfo);

                });
            },
            clearAddFeeConfigInfo: function() {
                var _feeTypeCds = vc.component.carCreateFeeAddInfo.feeTypeCds;
                var _parkingAreas = vc.component.carCreateFeeAddInfo.parkingAreas;
                vc.component.carCreateFeeAddInfo = {
                     feeTypeCds:[],
                    feeConfigs:[],
                    parkingAreas:[],
                    locationTypeCd: '',
                    locationObjId: '',
                    psId: '',
                    feeTypeCd:'',
                    configId:'',
                    billType:'',
                    carState:'',
                    isMore:false,
                    locationTypeCdName:'',
                };

                vc.component.carCreateFeeAddInfo.feeTypeCds = _feeTypeCds;
                vc.component.carCreateFeeAddInfo.parkingAreas = _parkingAreas;
            },
            _changeFeeTypeCd:function(_feeTypeCd){

                var param = {
                    params: {
                        page:1,
                        row:20,
                        communityId:vc.getCurrentCommunity().communityId,
                        feeTypeCd:_feeTypeCd,
                        isDefault:'F',
                        valid:'1'
                    }
                };

                //发送get请求
                vc.http.get('parkingSpaceCreateFeeAdd', 'list', param,
                function(json, res) {
                    var _feeConfigManageInfo = JSON.parse(json);
                    vc.component.carCreateFeeAddInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                },
                function(errInfo, error) {
                    console.log('请求失败处理');
                });
            },
            _loadParkingAreas:function(_feeTypeCd){

                var param = {
                    params: {
                        page:1,
                        row:20,
                        communityId:vc.getCurrentCommunity().communityId,
                    }
                };

                //发送get请求
                vc.http.get('parkingSpaceCreateFeeAdd', 'listParkingArea', param,
                function(json, res) {
                    if(res.status == 200){
                        var _parkingAreaInfo = JSON.parse(json);
                        vc.component.carCreateFeeAddInfo.parkingAreas = _parkingAreaInfo.parkingAreas;
                    }
                },
                function(errInfo, error) {
                    console.log('请求失败处理');
                });
            }
        }
    });

})(window.vc);