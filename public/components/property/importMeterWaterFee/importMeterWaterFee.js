(function (vc) {
    vc.extends({
        data: {
            importMeterWaterFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                configId: '',
                feeConfigs: [],
                feeTypeCd: '',
                meterTypes: [],
                meterType: ''
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
                    $that._listImportMeterTypes();
                    $('#importMeterWaterFeeModel').modal('show');
                }
            );
        },
        methods: {
            importMeterWaterFeeValidate() {
                return vc.validate.validate({
                    importMeterWaterFeeInfo: vc.component.importMeterWaterFeeInfo
                }, {
                    'importMeterWaterFeeInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "数据异常还没有入驻小区"
                        }
                    ],
                    'importMeterWaterFeeInfo.configId': [
                        {
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
                let param = new FormData();
                param.append("uploadFile", vc.component.importMeterWaterFeeInfo.excelTemplate);
                param.append('communityId', vc.component.importMeterWaterFeeInfo.communityId);
                param.append('feeTypeCd', vc.component.importMeterWaterFeeInfo.feeTypeCd);
                param.append('configId', vc.component.importMeterWaterFeeInfo.configId);
                param.append('meterType', vc.component.importMeterWaterFeeInfo.meterType);
                param.append('importAdapt', "importMeterWaterFee");
                vc.http.upload(
                    'assetImport',
                    'importData',
                    param, {
                        emulateJSON: true,
                        //添加请求头
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast("处理成功");
                            $('#importMeterWaterFeeModel').modal('hide');
                            vc.jumpToPage('/#/pages/property/assetImportLogDetail?logId=' + _json.data.logId + '&logType=importMeterWaterFee');
                            return;
                        }
                        vc.toast(_json.msg, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            _exportMeterWaterFeeTemplate: function () {
                let _meterType = $that.importMeterWaterFeeInfo.meterType;
                if (!vc.notNull(_meterType)) {
                    vc.toast('请选择抄表类型');
                    return;
                }
                vc.jumpToPage('/callComponent/importMeterWaterFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + '&meterType=' + _meterType);
            },
            _listImportMeterTypes: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('meterType.listMeterType',
                    param,
                    function (json, res) {
                        var _meterTypeManageInfo = JSON.parse(json);
                        $that.importMeterWaterFeeInfo.meterTypes = _meterTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddFeeConfigInfo: function () {
                vc.component.importMeterWaterFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    configId: '',
                    feeConfigs: [],
                    feeTypeCd: '',
                    meterTypes: [],
                    meterType: ''
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
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.importMeterWaterFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);