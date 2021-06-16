(function (vc) {

    vc.extends({
        data: {
            importMeterWaterFee2Info: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                configId: '',
                feeConfigs: [],
                feeTypeCd:''
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.importMeterWaterFee2Info.feeTypeCds = _data;
            });

        },
        _initEvent: function () {
            vc.on('importMeterWaterFee2', 'openImportMeterWaterFeeModal',
                function (_room) {
                    $('#importMeterWaterFee2Model').modal('show');

                });
        },
        methods: {

            importMeterWaterFee2Validate() {
                return vc.validate.validate({
                    importMeterWaterFee2Info: vc.component.importMeterWaterFee2Info
                },
                    {
                        'importMeterWaterFee2Info.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "数据异常还没有入驻小区"
                        }
                        ],
                        'importMeterWaterFee2Info.configId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }
                        ],
                        'importMeterWaterFee2Info.excelTemplate': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "文件不能为空"
                            }
                        ]
                    });
            },
            _importMeterWater2Data: function () {

                if (!vc.component.importMeterWaterFee2Validate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkFileType2(vc.component.importMeterWaterFee2Info.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkFileSize2(vc.component.importMeterWaterFee2Info.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importMeterWaterFee2Info.excelTemplate);
                param.append('communityId', vc.component.importMeterWaterFee2Info.communityId);
                param.append('feeTypeCd', vc.component.importMeterWaterFee2Info.feeTypeCd);
                param.append('configId', vc.component.importMeterWaterFee2Info.configId);


                vc.http.upload(
                    'importMeterWaterFee',
                    'importData2',
                    param,
                    {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            vc.toast("处理成功");
                            $('#importMeterWaterFee2Model').modal('hide');
                            vc.emit('meterWaterManage', 'listMeterWater', {});
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
          
            _exportMeterWaterFeeTemplate2: function () {
                let _meterType = '1010';
                let _feeName = "电费";
                let _feeTypeCd = $that.importMeterWaterFee2Info.feeTypeCd;
                

                if(!vc.notNull(_feeTypeCd)){
                    vc.toast('请选择费用类型');
                    return ;
                }

                if(_feeTypeCd == '888800010015'){
                    _meterType = '2020';
                    _feeName = "水费";
                }else if(_feeTypeCd == '888800010009'){
                    _meterType = '3030';
                    _feeName = "煤气费";
                }
                vc.jumpToPage('/callComponent/importMeterWaterFee/exportData2?communityId=' + vc.getCurrentCommunity().communityId+'&meterType='+_meterType+"&feeName="+_feeName);
            },
            clearAddFeeConfigInfo2: function () {
                vc.component.importMeterWaterFee2Info = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    configId: '',
                    feeConfigs: [],
                    feeTypeCd:''
                };

            },
            getExcelTemplate2: function (e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importMeterWaterFee2Info.excelTemplate = e.target.files[0];
            },
            checkFileType2: function (fileType) {
                const acceptTypes = ['xlsx'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkFileSize2: function (fileSize) {
                //2M
                const MAX_SIZE = 2 * 1024 * 1024;
                if (fileSize > MAX_SIZE) {
                    return false;
                }
                return true;
            },
            _changeImportMeterWaterFeeTypeCd2: function (_feeTypeCd) {

                var param = {
                    params: {
                        page: 1,
                        row: 20,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: 'F',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.importMeterWaterFee2Info.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });

})(window.vc);