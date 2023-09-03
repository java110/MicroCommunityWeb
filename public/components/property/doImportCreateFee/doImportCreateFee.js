(function(vc) {
    vc.extends({
        data: {
            doImportCreateFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('doImportCreateFee', 'openDoImportCreateFeeModal', function(_param) {
                $('#doImportCreateFeeModel').modal('show');
            });
        },
        methods: {
            doImportCreateFeeValidate() {
                return vc.validate.validate({
                    doImportCreateFeeInfo: vc.component.doImportCreateFeeInfo
                }, {
                    'doImportCreateFeeInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'doImportCreateFeeInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _doImportCreateFeeData: function() {
                if (!vc.component.doImportCreateFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.doImportCreateFeeInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.doImportCreateFeeInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.doImportCreateFeeInfo.excelTemplate);
                param.append('communityId', vc.component.doImportCreateFeeInfo.communityId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'importAndExportFee',
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
                        if (res.status == 200) {
                            //关闭model
                            vc.toast("处理成功");
                            $('#doImportCreateFeeModel').modal('hide');
                            // vc.jumpToPage('/#/pages/property/listOwner')
                            vc.emit('listOwnerCar', 'listOwnerCarData', {});
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            clearAddFeeConfigInfo: function() {
                // var _feeTypeCds = vc.component.importRoomFeeInfo.feeTypeCds;
                vc.component.doImportCreateFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: ''
                };
            },
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.doImportCreateFeeInfo.excelTemplate = e.target.files[0];
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