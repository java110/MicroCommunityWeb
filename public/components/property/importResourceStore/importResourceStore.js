(function(vc) {
    vc.extends({
        data: {
            importResourceStoreInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                storehouses: [],
                shId: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('importResourceStore', 'openimportResourceStoreModal', function(_param) {
                $('#importResourceStoreModel').modal('show');
                $that._listImportResourceStorehouses();
            });
        },
        methods: {
            _listImportResourceStorehouses: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        shType: '',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        vc.component.importResourceStoreInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            importResourceStoreValidate() {
                return vc.validate.validate({
                    importResourceStoreInfo: vc.component.importResourceStoreInfo
                }, {
                    'importResourceStoreInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'importResourceStoreInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _importData: function() {
                if (!vc.component.importResourceStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.importResourceStoreInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.importResourceStoreInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importResourceStoreInfo.excelTemplate);
                param.append('communityId', vc.component.importResourceStoreInfo.communityId);
                param.append('shId', vc.component.importResourceStoreInfo.shId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'importResourceStore',
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
                            $that.clearAddFeeConfigInfo();
                            $('#importResourceStoreModel').modal('hide');
                            // vc.jumpToPage('/#/pages/property/listOwner')
                            vc.emit('resourceStoreManage', 'listResourceStore', {});
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
                let _storehouses = vc.component.importResourceStoreInfo.storehouses;
                vc.component.importResourceStoreInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    storehouses: _storehouses,
                    shId: ''
                        // feeTypeCd: '',
                        // feeTypeCds: [],
                        // objType: '3333'
                };
                // vc.component.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function(_feeTypeCd) {},
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importResourceStoreInfo.excelTemplate = e.target.files[0];
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