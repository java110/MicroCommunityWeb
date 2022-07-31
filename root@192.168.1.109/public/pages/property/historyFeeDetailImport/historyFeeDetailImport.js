/**
 权限组
 **/
(function(vc) {

    vc.extends({
        data: {
            historyFeeDetailImportInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                objType: ''
            }
        },

        _initMethod: function() {

        },
        _initEvent: function() {

        },
        methods: {
            historyFeeDetailImportValidate: function() {
                return vc.validate.validate({
                    historyFeeDetailImportInfo: vc.component.historyFeeDetailImportInfo
                }, {

                    'historyFeeDetailImportInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }],
                    'historyFeeDetailImportInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "还未入驻小区，请先入驻小区"
                    }]
                });
            },
            _openDownloadHcExcelTemplate: function() {
                //下载 模板
                vc.jumpToPage('/import/importFeeDetail.xlsx')
            },
            _openDownloadHcCarExcelTemplate: function() {
                //下载 模板
                vc.jumpToPage('/import/importCarFeeDetail.xlsx')
            },
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.historyFeeDetailImportInfo.excelTemplate = e.target.files[0];
            },
            _importData: function() {

                if (!vc.component.historyFeeDetailImportValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkFileType(vc.component.historyFeeDetailImportInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkFileSize(vc.component.historyFeeDetailImportInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.historyFeeDetailImportInfo.excelTemplate);
                param.append('communityId', vc.component.historyFeeDetailImportInfo.communityId);
                param.append('objType', vc.component.historyFeeDetailImportInfo.objType);

                vc.http.upload(
                    'importFeeDetail',
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
                            vc.jumpToPage('/#/pages/property/assetImportLog')
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            checkFileType: function(fileType) {
                const acceptTypes = ['xls', 'xlsx'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkFileSize: function(fileSize) {
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