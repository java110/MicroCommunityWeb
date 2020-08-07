(function (vc) {

    vc.extends({
        data: {
            importRoomFeeInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: '',
                feeTypeCd: '',
                feeConfigs: []
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                vc.component.importRoomFeeInfo.feeTypeCds = _data;
            });

        },
        _initEvent: function () {
            vc.on('importRoomFee', 'openImportRoomFeeModal',
                function (_room) {
                    $('#importRoomFeeModel').modal('show');

                });
        },
        methods: {

            importRoomFeeValidate() {
                return vc.validate.validate({
                    importRoomFeeInfo: vc.component.importRoomFeeInfo
                },
                    {
                        'importRoomFeeInfo.communityId': [{
                            limit: "required",
                            param: "",
                            errInfo: "数据异常还没有入驻小区"
                        }
                        ],
                        'importRoomFeeInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }
                        ],
                        'importRoomFeeInfo.excelTemplate': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "文件不能为空"
                            }
                        ]
                    });
            },
            _importData: function () {

                if (!vc.component.importRoomFeeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkFileType(vc.component.importRoomFeeInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkFileSize(vc.component.importRoomFeeInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importRoomFeeInfo.excelTemplate);
                param.append('communityId', vc.component.importRoomFeeInfo.communityId);
                param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);


                vc.http.upload(
                    'importRoomFee',
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
                            $('#importRoomFeeModel').modal('hide');
                            //vc.jumpToPage('/admin.html#/pages/property/listOwner')
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            _exportRoomFeeTemplate:function(){
                vc.jumpToPage('/callComponent/importRoomFee/exportData?communityId='+vc.getCurrentCommunity().communityId);
            },
            clearAddFeeConfigInfo: function () {
                var _feeTypeCds = vc.component.importRoomFeeInfo.feeTypeCds;
                vc.component.importRoomFeeInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: '',
                    feeTypeCd: '',
                    feeConfigs: []
                };

                vc.component.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function (_feeTypeCd) {
            },
            getExcelTemplate: function (e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importRoomFeeInfo.excelTemplate = e.target.files[0];
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
            }
        }
    });

})(window.vc);