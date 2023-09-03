(function (vc, vm) {
    vc.extends({
        data: {
            editPropertyRightRegistrationDetailInfo: {
                prrdId: '',
                prrId: '',
                securities: '',
                securitiesName: '',
                idCardUrl: '',
                housePurchaseUrl: '',
                repairUrl: '',
                deedTaxUrl: '',
                isTrue: '',
                idCardPhotos: [],
                housePurchasePhotos: [],
                repairPhotos: [],
                deedTaxPhotos: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editPropertyRightRegistrationDetail', 'openEditPropertyRightRegistrationDetailModal', function (_params) {
                console.log(_params);
                vc.component.refreshEditPropertyRightRegistrationDetailInfo();
                $('#editPropertyRightRegistrationDetailModel').modal('show');
                vc.copyObject(_params, vc.component.editPropertyRightRegistrationDetailInfo);
                vc.component.editPropertyRightRegistrationDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.component.freshPhotos(vc.component.editPropertyRightRegistrationDetailInfo);
            });
            //身份证照片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadIdCardImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editPropertyRightRegistrationDetailInfo.idCardPhotos = [];
                    _param.forEach((item) => {
                        vc.component.editPropertyRightRegistrationDetailInfo.idCardPhotos.push(item.fileId);
                    })
                }else{
                    vc.component.editPropertyRightRegistrationDetailInfo.idCardPhotos = [];
                }
            });
            //购房合同图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadHousePurchaseImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editPropertyRightRegistrationDetailInfo.housePurchasePhotos = [];
                    _param.forEach((item) => {
                        vc.component.editPropertyRightRegistrationDetailInfo.housePurchasePhotos.push(item.fileId);
                    })
                }else{
                    vc.component.editPropertyRightRegistrationDetailInfo.housePurchasePhotos = [];
                }
            });
            //维修基金图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadRepairImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editPropertyRightRegistrationDetailInfo.repairPhotos = [];
                    _param.forEach((item) => {
                        vc.component.editPropertyRightRegistrationDetailInfo.repairPhotos.push(item.fileId);
                    })
                }else{
                    vc.component.editPropertyRightRegistrationDetailInfo.repairPhotos = [];
                }
            });
            //契税证明图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadDeedTaxImage", function (_param) {
                if (_param.length > 0) {
                    vc.component.editPropertyRightRegistrationDetailInfo.deedTaxPhotos = [];
                    _param.forEach((item) => {
                        vc.component.editPropertyRightRegistrationDetailInfo.deedTaxPhotos.push(item.fileId);
                    })
                }else{
                    vc.component.editPropertyRightRegistrationDetailInfo.deedTaxPhotos = [];
                }
            });
        },
        methods: {
            editPropertyRightRegistrationDetailValidate: function () {
                return vc.validate.validate({
                    editPropertyRightRegistrationDetailInfo: vc.component.editPropertyRightRegistrationDetailInfo
                }, {
                    'editPropertyRightRegistrationDetailInfo.securities': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "材料不能为空"
                        }
                    ]
                });
            },
            editPropertyRightRegistrationDetail: function () {
                if (!vc.component.editPropertyRightRegistrationDetailValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'propertyRightRegistrationDetail.updatePropertyRightRegistrationDetail',
                    JSON.stringify(vc.component.editPropertyRightRegistrationDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPropertyRightRegistrationDetailModel').modal('hide');
                            vc.emit('listPropertyRightRegistrationDetail', 'listPropertyRightRegistrationDetails', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            freshPhotos: function (_info) {
                if (_info.securities == '001' && _info.idCardUrl && _info.idCardUrl.length > 0) {
                    //身份证展示
                    vc.emit('editPropertyRightRegistrationDetail1', 'uploadImageUrl', 'notifyPhotos', _info.idCardUrl);
                }
                if (_info.securities == '002' && _info.housePurchaseUrl && _info.housePurchaseUrl.length > 0) {
                    //购房合同展示
                    vc.emit('editPropertyRightRegistrationDetail2', 'uploadImageUrl', 'notifyPhotos', _info.housePurchaseUrl);
                }
                if (_info.securities == '003' && _info.repairUrl && _info.repairUrl.length > 0) {
                    //维修基金展示
                    vc.emit('editPropertyRightRegistrationDetail3', 'uploadImageUrl', 'notifyPhotos', _info.repairUrl);
                }
                if (_info.securities == '004' && _info.deedTaxUrl && _info.deedTaxUrl.length > 0) {
                    //契税展示
                    vc.emit('editPropertyRightRegistrationDetail4', 'uploadImageUrl', 'notifyPhotos', _info.deedTaxUrl);
                }
            },
            refreshEditPropertyRightRegistrationDetailInfo: function () {
                vc.component.editPropertyRightRegistrationDetailInfo = {
                    prrdId: '',
                    prrId: '',
                    securities: '',
                    securitiesName: '',
                    idCardUrl: '',
                    housePurchaseUrl: '',
                    repairUrl: '',
                    deedTaxUrl: '',
                    isTrue: '',
                    idCardPhotos: [],
                    housePurchasePhotos: [],
                    repairPhotos: [],
                    deedTaxPhotos: []
                }
            }
        }
    });
})(window.vc, window.vc.component);
