(function (vc) {

    vc.extends({
        data: {
            importMeterWaterFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                configId: '',
                feeConfigs: [],
                feeTypeCd:''
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.importMeterWaterFeeInfo.feeTypeCds = _data;
            });

        },
        _initEvent: function () {
            vc.on('importMeterWaterFee', 'openImportMeterWaterFeeModal',
                function (_room) {
                    $('#importMeterWaterFeeModel').modal('show');

                });
        },
        methods: {

            importMeterWaterFeeValidate() {
                return vc.validate.validate({
                    importMeterWaterFeeInfo: vc.component.importMeterWaterFeeInfo
                },
                    {
                        'importMeterWaterFeeInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "数据异常还没有入驻小区"
                        }
                        ],
                        'importMeterWaterFeeInfo.configId': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }
                        ],
                        'importMeterWaterFeeInfo.excelTemplate': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "文件不能为空"
                            }
                        ]
                    });
            },
            _importMeterWaterData: function () {

                if (!vc.component.importMeterWaterFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkFileType(vc.component.importMeterWaterFeeInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkFileSize(vc.component.importMeterWaterFeeInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importMeterWaterFeeInfo.excelTemplate);
                param.append('communityId', vc.component.importMeterWaterFeeInfo.communityId);
                param.append('feeTypeCd', vc.component.importMeterWaterFeeInfo.feeTypeCd);


                vc.http.upload(
                    'importMeterWaterFee',
                    'importData',
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
                            $('#importMeterWaterFeeModel').modal('hide');
                            vc.jumpToPage('/admin.html#/pages/property/listOwner')

                            vc.emit('roomFeeImport', 'listFee', {});
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            _exportMeterWaterFeeTemplate: function () {
                let _meterType = '1010';

                let _feeTypeCd = $that.importMeterWaterFeeInfo.feeTypeCd;

                if(!vc.notNull(_feeTypeCd)){
                    vc.toast('请选择费用类型');
                    return ;
                }

                if(_feeTypeCd == '888800010015'){
                    _meterType = '2020';
                }
                vc.jumpToPage('/callComponent/importMeterWaterFee/exportData?communityId=' + vc.getCurrentCommunity().communityId+'&meterType='+_meterType);
            },
            clearAddFeeConfigInfo: function () {
                vc.component.importMeterWaterFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    configId: '',
                    feeConfigs: [],
                    feeTypeCd:''
                };

            },
            getExcelTemplate: function (e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importMeterWaterFeeInfo.excelTemplate = e.target.files[0];
            },
            checkFileType: function (fileType) {
                const acceptTypes = ['xlsx'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkFileSize: function (fileSize) {
                //2M
                const MAX_SIZE = 2 * 1024 * 1024;
                if (fileSize > MAX_SIZE) {
                    return false;
                }
                return true;
            },
            _changeImportMeterWaterFeeTypeCd: function (_feeTypeCd) {

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
                        vc.component.importMeterWaterFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });

})(window.vc);