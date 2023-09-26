(function(vc) {
    vc.extends({
        data: {
            importRoomFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                feeTypeCd: '',
                feeTypeCds: [],
                objType: '3333'
            }
        },
        _initMethod: function() {
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                $that.importRoomFeeInfo.feeTypeCds = _data;
            });

        },
        _initEvent: function() {
            vc.on('importRoomFee', 'openImportRoomFeeModal',
                function(_room) {
                    $('#importRoomFeeModel').modal('show');
                });
        },
        methods: {
            importRoomFeeValidate() {
                return vc.validate.validate({
                    importRoomFeeInfo: $that.importRoomFeeInfo
                }, {
                    'importRoomFeeInfo.communityId': [{
                        limit: "required",
                        param: "",
                        errInfo: "数据异常还没有入驻小区"
                    }],
                    'importRoomFeeInfo.feeTypeCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "费用类型不能为空"
                    }],
                    'importRoomFeeInfo.excelTemplate': [{
                        limit: "required",
                        param: "",
                        errInfo: "文件不能为空"
                    }]
                });
            },
            _importData: function() {
                if (!$that.importRoomFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!$that.checkFileType($that.importRoomFeeInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!$that.checkFileSize($that.importRoomFeeInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }

                let param = new FormData();
                param.append("uploadFile", $that.importRoomFeeInfo.excelTemplate);
                param.append('communityId', $that.importRoomFeeInfo.communityId);
                param.append('feeTypeCd', $that.importRoomFeeInfo.feeTypeCd);
                param.append('objType', $that.importRoomFeeInfo.objType);
                param.append('importAdapt', "importRoomFee");

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
                            $('#importRoomFeeModel').modal('hide');
                            vc.jumpToPage('/#/pages/property/assetImportLogDetail?logId=' + _json.data.logId + '&logType=importRoomFee');
                            return;
                        }
                        vc.toast(_json.msg, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            _exportRoomFeeTemplate: function() {
                vc.jumpToPage('/callComponent/importRoomFee/exportData?communityId=' + vc.getCurrentCommunity().communityId + "&objType=" + $that.importRoomFeeInfo.objType);
            },
            clearAddFeeConfigInfo: function() {
                var _feeTypeCds = $that.importRoomFeeInfo.feeTypeCds;
                $that.importRoomFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    feeTypeCd: '',
                    feeTypeCds: [],
                    objType: '3333'
                };
                $that.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function(_feeTypeCd) {},
            getExcelTemplate: function(e) {
                //console.log("getExcelTemplate 开始调用")
                $that.importRoomFeeInfo.excelTemplate = e.target.files[0];
            },
            checkFileType: function(fileType) {
                const acceptTypes = ['xlsx'];
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