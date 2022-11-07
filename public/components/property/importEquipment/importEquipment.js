(function(vc) {
    vc.extends({
        data: {
            importEquipmentInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                typeId:''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('importEquipment', 'openImportEquipmentModal', function(_param) {
                vc.component.importEquipmentInfo.typeId = _param.typeId;
                console.log('传参typeId',_param.typeId);
                $('#importEquipmentModel').modal('show');
            });
        },
        methods: {
            importEquipmentValidate() {
                return vc.validate.validate({
                    importEquipmentInfo: vc.component.importEquipmentInfo
                }, {
                    'importEquipmentInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻园区"
                    }],
                    'importEquipmentInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _importData: function() {
                if (!vc.component.importEquipmentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.importEquipmentInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.importEquipmentInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importEquipmentInfo.excelTemplate);
                param.append('communityId', vc.component.importEquipmentInfo.communityId);
                param.append('typeId', vc.component.importEquipmentInfo.typeId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'importExportEquipment',
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
                            vc.toast("导入成功！");
                            $('#importEquipmentModel').modal('hide');
                            // vc.jumpToPage('/#/pages/property/listOwner')
                            vc.emit('equipmentAccount', 'listEquipmentAccounts', {});
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
                vc.component.importEquipmentInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: ''
                        // feeTypeCd: '',
                        // feeTypeCds: [],
                        // objType: '3333'
                };
                // vc.component.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function(_feeTypeCd) {},
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importEquipmentInfo.excelTemplate = e.target.files[0];
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
            _exportExcelTemplate: function() {//导出数据模板
                if (!vc.component.importEquipmentInfo.typeId) {
                    vc.toast('请先选择设备分类');
                    return;
                }
                let typeId = vc.component.importEquipmentInfo.typeId;
                vc.jumpToPage('/callComponent/importExportEquipment/exportImportDataTemp?typeId=' + typeId + "&communityId=" + vc.getCurrentCommunity().communityId);
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