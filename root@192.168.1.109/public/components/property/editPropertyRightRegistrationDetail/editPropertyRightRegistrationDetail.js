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
                vc.component.refreshEditPropertyRightRegistrationDetailInfo();
                $('#editPropertyRightRegistrationDetailModel').modal('show');
                vc.copyObject(_params, vc.component.editPropertyRightRegistrationDetailInfo);
                vc.component.editPropertyRightRegistrationDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.component.freshPhotos(vc.component.editPropertyRightRegistrationDetailInfo);
            });
            //身份证照片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadIdCardImage", function (_param) {
                vc.component.editPropertyRightRegistrationDetailInfo.idCardPhotos = _param;
            });
            //购房合同图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadHousePurchaseImage", function (_param) {
                vc.component.editPropertyRightRegistrationDetailInfo.housePurchasePhotos = _param;
            });
            //维修基金图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadRepairImage", function (_param) {
                vc.component.editPropertyRightRegistrationDetailInfo.repairPhotos = _param;
            });
            //契税证明图片上传
            vc.on("editPropertyRightRegistrationDetail", "notifyUploadDeedTaxImage", function (_param) {
                vc.component.editPropertyRightRegistrationDetailInfo.deedTaxPhotos = _param;
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
                if (_info.securities == '001' && _info.idCardUrl != null && _info.idCardUrl && _info.idCardUrl != "undefined" && _info.idCardUrl.split(",").length > 0) {
                    //身份证展示
                    vc.emit('editPropertyRightRegistrationDetail1', 'uploadImage', 'notifyPhotos', _info.idCardUrl.split(','));
                }
                if (_info.securities == '002' && _info.housePurchaseUrl != null && _info.housePurchaseUrl && _info.housePurchaseUrl != "undefined" && _info.housePurchaseUrl.split(",").length > 0) {
                    //购房合同展示
                    vc.emit('editPropertyRightRegistrationDetail2', 'uploadImage', 'notifyPhotos', _info.housePurchaseUrl.split(','));
                }
                if (_info.securities == '003' && _info.repairUrl != null && _info.repairUrl && _info.repairUrl != "undefined" && _info.repairUrl.split(",").length > 0) {
                    //维修基金展示
                    vc.emit('editPropertyRightRegistrationDetail3', 'uploadImage', 'notifyPhotos', _info.repairUrl.split(','));
                }
                if (_info.securities == '004' && _info.deedTaxUrl != null && _info.deedTaxUrl && _info.deedTaxUrl != "undefined" && _info.deedTaxUrl.split(",").length > 0) {
                    //契税展示
                    vc.emit('editPropertyRightRegistrationDetail4', 'uploadImage', 'notifyPhotos', _info.deedTaxUrl.split(','));
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
