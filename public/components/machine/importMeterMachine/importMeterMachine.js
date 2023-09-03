(function(vc) {
    vc.extends({
        data: {
            importMeterMachineInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('importMeterMachine', 'openImportMeterMachineModal', function(_param) {
                $that.clearImportMeterMachinenfo();
                $('#importMeterMachineModel').modal('show');
            });
        },
        methods: {
            importMeterMachineValidate() {
                return vc.validate.validate({
                    importMeterMachineInfo: vc.component.importMeterMachineInfo
                }, {
                    'importMeterMachineInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'importMeterMachineInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _importData: function() {
                if (!vc.component.importMeterMachineValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.importMeterMachineInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.importMeterMachineInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importMeterMachineInfo.excelTemplate);
                param.append('communityId', vc.component.importMeterMachineInfo.communityId);
                param.append('importAdapt', "importMeterMachine");
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
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            // vc.toast(_json.data);
                            $('#importMeterMachineModel').modal('hide');
                            $that.clearImportMeterMachinenfo();

                            vc.jumpToPage('/#/pages/property/assetImportLogDetail?logId=' + _json.data.logId + '&logType=importMeterMachine');
                            return;
                        }
                        vc.toast(_json.msg, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            clearImportMeterMachinenfo: function() {
                vc.component.importMeterMachineInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: ''
                };
            },
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importMeterMachineInfo.excelTemplate = e.target.files[0];
            },
            checkOwnerFileType: function(fileType) {
                const acceptTypes = ['xlsx', 'xls'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkOwnerFileSize: function(fileSize) {
                //2M
                const MAX_SIZE = 2 * 1024 * 1024;
                if (fileSize > MAX_SIZE) {
                    return false;
                }
                return true;
            }
        }
    });
})(window.vc);