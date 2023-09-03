(function(vc) {
    vc.extends({
        data: {
            exportCarFeeImportExcelInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                isParkingAreaAll: true,
                isConfigAll: true,
                configIds: [],
                configs: [],
                paIds: [],
                parkingAreas: [],
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('exportCarFeeImportExcel', 'openExportCarFeeImportExcelModal', function(_param) {
                $that._loadExportParkingAreas();
                $that._listExportFeeConfigs();
                $('#exportCarFeeImportExcelModel').modal('show');
            });
        },
        methods: {
            _importData: function() {

                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.exportCarFeeImportExcelInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.exportCarFeeImportExcelInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.exportCarFeeImportExcelInfo.excelTemplate);
                param.append('communityId', vc.component.exportCarFeeImportExcelInfo.communityId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'exportCarFeeImportExcel',
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
                            vc.toast(_json.data);
                            $('#exportCarFeeImportExcelModel').modal('hide');
                            // vc.jumpToPage('/#/pages/property/listOwner')
                            vc.emit('room', 'listRoom', {});
                            return;
                        }
                        vc.toast(_json.msg, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            clearAddFeeConfigInfo: function() {
                // var _feeTypeCds = vc.component.importRoomFeeInfo.feeTypeCds;
                vc.component.exportCarFeeImportExcelInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    isParkingAreaAll: true,
                    isConfigAll: true,
                    configIds: [],
                    configs: [],
                    paIds: [],
                    parkingAreas: [],
                };
            },

            changeItemConfig: function() {
                if ($that.exportCarFeeImportExcelInfo.configIds.length < $that.exportCarFeeImportExcelInfo.configs.length) {
                    $that.exportCarFeeImportExcelInfo.isConfigAll = false;
                    return;
                }
                $that.exportCarFeeImportExcelInfo.isConfigAll = true;
            },

            changeItemParkingArea: function() {
                if ($that.exportCarFeeImportExcelInfo.paIds.length < $that.exportCarFeeImportExcelInfo.parkingAreas.length) {
                    $that.exportCarFeeImportExcelInfo.isParkingAreaAll = false;
                    return;
                }
                $that.exportCarFeeImportExcelInfo.isParkingAreaAll = true;
            },

            _loadExportParkingAreas: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 150,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/parkingArea.listParkingAreas',
                    param,
                    function(json, res) {
                        let listParkingAreaData = JSON.parse(json);
                        $that.exportCarFeeImportExcelInfo.parkingAreas = listParkingAreaData.parkingAreas;
                        listParkingAreaData.parkingAreas.forEach(item => {
                            $that.exportCarFeeImportExcelInfo.paIds.push(item.paId);
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listExportFeeConfigs: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        isDefault:'F'
                    }
                };

                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.exportCarFeeImportExcelInfo.configs = _feeConfigManageInfo.feeConfigs;

                        _feeConfigManageInfo.feeConfigs.forEach(item => {
                            $that.exportCarFeeImportExcelInfo.configIds.push(item.configId);
                        });

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },

            changeAllConfig: function() {
                $that.exportCarFeeImportExcelInfo.configIds = [];
                if (!$that.exportCarFeeImportExcelInfo.isConfigAll) {
                    return;
                }

                $that.exportCarFeeImportExcelInfo.configs.forEach(item => {
                    $that.exportCarFeeImportExcelInfo.configIds.push(item.configId);
                });
            },
            changeAllParkingAreas: function() {
                $that.exportCarFeeImportExcelInfo.paIds = [];
                if (!$that.exportCarFeeImportExcelInfo.isParkingAreaAll) {
                    return;
                }

                $that.exportCarFeeImportExcelInfo.parkingAreas.forEach(item => {
                    $that.exportCarFeeImportExcelInfo.paIds.push(item.paId);
                });
            },
            _exportExcel: function() {
                let _paIds = $that.exportCarFeeImportExcelInfo.paIds.join(',');
                let _configIds = $that.exportCarFeeImportExcelInfo.configIds.join(',');
                vc.jumpToPage('/callComponent/importAndExportFee/exportData?paIds=' + _paIds + "&configIds=" + _configIds + "&communityId=" + vc.getCurrentCommunity().communityId + "&type=2002");
                $('#exportCarFeeImportExcelModel').modal('hide');
            }
        }
    });
})(window.vc);