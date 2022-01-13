(function (vc) {
    vc.extends({
        data: {
            importOwnerCarInfo: {
                communityId: vc.getCurrentCommunity().communityId,
                excelTemplate: ''
                // feeTypeCd: '',
                // feeTypeCds: [],
                // objType: '3333'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('importOwnerCar', 'openImportOwnerCarModal', function (_param) {
                $('#importOwnerCarModel').modal('show');
            });
        },
        methods: {
            importOwnerCarValidate() {
                return vc.validate.validate({
                        importOwnerCarInfo: vc.component.importOwnerCarInfo
                    },
                    {
                        'importOwnerCarInfo.communityId': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "数据异常还没有入驻小区"
                            }
                        ],
                        /*'importRoomFeeInfo.feeTypeCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "费用类型不能为空"
                        }
                        ],*/
                        'importOwnerCarInfo.excelTemplate': [
                            {
                                limit: "required",
                                param: "",
                                errInfo: "文件不能为空"
                            }
                        ]
                    });
            },
            _importData: function () {
                if (!vc.component.importOwnerCarValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                // 导入数据
                if (!vc.component.checkOwnerFileType(vc.component.importOwnerCarInfo.excelTemplate.name.split('.')[1])) {
                    vc.toast('不是有效的Excel格式');
                    return;
                }
                if (!vc.component.checkOwnerFileSize(vc.component.importOwnerCarInfo.excelTemplate.size)) {
                    vc.toast('Excel文件大小不能超过2M');
                    return;
                }
                var param = new FormData();
                param.append("uploadFile", vc.component.importOwnerCarInfo.excelTemplate);
                param.append('communityId', vc.component.importOwnerCarInfo.communityId);
                // param.append('feeTypeCd', vc.component.importRoomFeeInfo.feeTypeCd);
                // param.append('objType', $that.importRoomFeeInfo.objType);
                vc.http.upload(
                    'importOwnerCar',
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
                            $('#importOwnerCarModel').modal('hide');
                            // vc.jumpToPage('/admin.html#/pages/property/listOwner')
                            vc.emit('listOwnerCar', 'listOwnerCarData', {});
                            return;
                        }
                        vc.toast(json, 10000);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo, 10000);
                    });
            },
            _exportRoomFeeTemplate: function () {
                vc.jumpToPage('/callComponent/importOwnerCar/exportData?communityId=' + vc.getCurrentCommunity().communityId);
            },
            clearAddFeeConfigInfo: function () {
                // var _feeTypeCds = vc.component.importRoomFeeInfo.feeTypeCds;
                vc.component.importOwnerCarInfo = {
                    communityId: vc.getCurrentCommunity().communityId,
                    excelTemplate: ''
                    // feeTypeCd: '',
                    // feeTypeCds: [],
                    // objType: '3333'
                };
                // vc.component.importRoomFeeInfo.feeTypeCds = _feeTypeCds;
            },
            _changeFeeTypeCd: function (_feeTypeCd) {
            },
            getExcelTemplate: function (e) {
                //console.log("getExcelTemplate 开始调用")
                vc.component.importOwnerCarInfo.excelTemplate = e.target.files[0];
            },
            checkOwnerFileType: function (fileType) {
                const acceptTypes = ['xlsx','xls'];
                for (var i = 0; i < acceptTypes.length; i++) {
                    if (fileType === acceptTypes[i]) {
                        return true;
                    }
                }
                return false;
            },
            checkOwnerFileSize: function (fileSize) {
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