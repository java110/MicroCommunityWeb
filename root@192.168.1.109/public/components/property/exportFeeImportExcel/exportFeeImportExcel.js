(function(vc) {
    vc.extends({
        data: {
            exportFeeImportExcelInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                isFloorAll: true,
                isConfigAll: true,
                configIds: [],
                configs: [],
                floorIds: [],
                floors: [],
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('exportFeeImportExcel', 'openExportFeeImportExcelModal', function(_param) {
                $that._loadExportFloors();
                $that._listExportFeeConfigs();
                $('#exportFeeImportExcelModel').modal('show');
            });
        },
        methods: {
            _importData: function() {

                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.exportFeeImportExcelInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.exportFeeImportExcelInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.exportFeeImportExcelInfo.excelTemplate);
                param.append('communityId', vc.component.exportFeeImportExcelInfo.communityId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'exportFeeImportExcel',
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
                            $('#exportFeeImportExcelModel').modal('hide');
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
                vc.component.exportFeeImportExcelInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    isFloorAll: true,
                    isConfigAll: true,
                    configIds: [],
                    configs: [],
                    floorIds: [],
                    floors: [],
                };
            },

            changeItemConfig: function() {
                if ($that.exportFeeImportExcelInfo.configIds.length < $that.exportFeeImportExcelInfo.configs.length) {
                    $that.exportFeeImportExcelInfo.isConfigAll = false;
                    return;
                }
                $that.exportFeeImportExcelInfo.isConfigAll = true;
            },

            changeItemFloor: function() {
                if ($that.exportFeeImportExcelInfo.floorIds.length < $that.exportFeeImportExcelInfo.floors.length) {
                    $that.exportFeeImportExcelInfo.isFloorAll = false;
                    return;
                }
                $that.exportFeeImportExcelInfo.isFloorAll = true;
            },

            _loadExportFloors: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 150,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.get('listFloor',
                    'list',
                    param,
                    function(json, res) {
                        let listFloorData = JSON.parse(json);
                        $that.exportFeeImportExcelInfo.floors = listFloorData.apiFloorDataVoList;
                        listFloorData.apiFloorDataVoList.forEach(item => {
                            $that.exportFeeImportExcelInfo.floorIds.push(item.floorId);
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
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.get('feeConfigManage', 'list', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.exportFeeImportExcelInfo.configs = _feeConfigManageInfo.feeConfigs;

                        _feeConfigManageInfo.feeConfigs.forEach(item => {
                            $that.exportFeeImportExcelInfo.configIds.push(item.configId);
                        });

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },

            changeAllConfig: function() {
                $that.exportFeeImportExcelInfo.configIds = [];
                if (!$that.exportFeeImportExcelInfo.isConfigAll) {
                    return;
                }

                $that.exportFeeImportExcelInfo.configs.forEach(item => {
                    $that.exportFeeImportExcelInfo.configIds.push(item.configId);
                });
            },
            changeAllFloors: function() {
                $that.exportFeeImportExcelInfo.floorIds = [];
                if (!$that.exportFeeImportExcelInfo.isFloorAll) {
                    return;
                }

                $that.exportFeeImportExcelInfo.floors.forEach(item => {
                    $that.exportFeeImportExcelInfo.floorIds.push(item.floorId);
                });
            },
            _exportExcel: function() {
                let _floorIds = $that.exportFeeImportExcelInfo.floorIds.join(',');
                let _configIds = $that.exportFeeImportExcelInfo.configIds.join(',');
                vc.jumpToPage('/callComponent/importAndExportFee/exportData?floorIds=' + _floorIds + "&configIds=" + _configIds + "&communityId=" + vc.getCurrentCommunity().communityId + "&type=1001");
                $('#exportFeeImportExcelModel').modal('hide');

            }
        }
    });
})(window.vc);