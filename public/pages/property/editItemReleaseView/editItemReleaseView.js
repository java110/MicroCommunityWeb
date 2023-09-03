(function (vc) {

    vc.extends({
        data: {
            editItemReleaseViewInfo: {
                irId: '',
                typeId: '',
                applyCompany: '',
                applyPerson: '',
                idCard: '',
                applyTel: '',
                passTime: '',
                resNames: [],
                state: '',
                carNum: '',
                remark: '',
                itemReleaseTypes:[],
            }
        },
        _initMethod: function () {
            $that.editItemReleaseViewInfo.irId = vc.getParam('irId');
            $that._listItemReleaseTypes();
            $that._listItemReleases();
            $that._loadItemReleaseRes();
            vc.initDateTime('editPassTime',function(_value){
                $that.editItemReleaseViewInfo.passTime = _value;
            });

        },
        _initEvent: function () {

        },
        methods: {
            editItemReleaseViewValidate() {
                return vc.validate.validate({
                    editItemReleaseViewInfo: vc.component.editItemReleaseViewInfo
                }, {
                    'editItemReleaseViewInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "放行类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "放行类型不能超过30"
                        },
                    ],
                    'editItemReleaseViewInfo.applyCompany': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请单位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请单位不能超过64"
                        },
                    ],
                    'editItemReleaseViewInfo.applyPerson': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请人不能超过64"
                        },
                    ],
                    'editItemReleaseViewInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "18",
                            errInfo: "身份证不能超过18"
                        },
                    ],
                    'editItemReleaseViewInfo.applyTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号不能超过11"
                        },
                    ],
                    'editItemReleaseViewInfo.passTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通行时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "通行时间格式错误"
                        },
                    ],
                    'editItemReleaseViewInfo.carNum': [
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车牌号不能超过12"
                        },
                    ],
                    'editItemReleaseViewInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            _updateItemReleaseInfo: function () {
                if (!vc.component.editItemReleaseViewValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editItemReleaseViewInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/itemRelease.updateItemRelease',
                    JSON.stringify(vc.component.editItemReleaseViewInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                          vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _listItemReleaseTypes: function () {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseType',
                    param,
                    function (json, res) {
                        let _itemReleaseTypeManageInfo = JSON.parse(json);
                        vc.component.editItemReleaseViewInfo.itemReleaseTypes = _itemReleaseTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addResName:function(){
                $that.editItemReleaseViewInfo.resNames.push({
                    resName:'',
                    amount:''
                })
            },
            // 移除选中item
            _removeResName: function (resName) {
                $that.editItemReleaseViewInfo.resNames.forEach((item, index) => {
                    if (item.resName == resName) {
                        $that.editItemReleaseViewInfo.resNames.splice(index, 1);
                    }
                })
            },
            _listItemReleases: function () {
                let param = {
                    params: {
                        page:1,
                        row:1,
                        communityId: vc.getCurrentCommunity().communityId,
                        irId:$that.editItemReleaseViewInfo.irId
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemRelease',
                    param,
                    function (json, res) {
                        let _itemReleaseManageInfo = JSON.parse(json);
                        vc.copyObject(_itemReleaseManageInfo.data[0],$that.editItemReleaseViewInfo);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadItemReleaseRes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        irId: vc.component.editItemReleaseViewInfo.irId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/itemRelease.listItemReleaseRes',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        vc.component.editItemReleaseViewInfo.resNames = _unitInfo.data;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
