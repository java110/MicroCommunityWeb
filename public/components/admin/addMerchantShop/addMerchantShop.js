(function (vc) {

    vc.extends({
        data: {
            addMerchantShopInfo: {
                name: "",
                shopName: '',
                areaAddress: '',
                address: "",
                tel: "",
                storeTypeCd: "800900000005",
                nearbyLandmarks: "无",
                areaCode: '',
                shopType: '',
                shopTypes: [],
                areas: [],
                provs: [],
                citys: [],
                selectProv: '',
                selectCity: '',
                selectArea: '',
                
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addMerchantShop', 'openAddMerchantShopModal', function () {
                $that._initArea('101', '0');
                $that._listShopTypes();
                $('#addMerchantShopModel').modal('show');
            });
        },
        methods: {
            addMerchantShopValidate() {
                return vc.validate.validate({
                    addMerchantShopInfo: vc.component.addMerchantShopInfo
                }, {
                    'addMerchantShopInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公司名不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "公司名长度必须在100位之内"
                        },
                    ],
                    'addMerchantShopInfo.areaAddress': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择地址"
                        }
                    ],
                    'addMerchantShopInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地址长度必须在200位之内"
                        },
                    ],
                    'addMerchantShopInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "不是有效的手机号"
                        }
                    ],
                    'addMerchantShopInfo.storeTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商户类型不能为空"
                        }
                    ],
                    'addMerchantShopInfo.nearbyLandmarks': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "附近建筑不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地址长度必须在200位之内"
                        }
                    ]
				});
            },
            saveMerchantShopInfo: function () {
                if (!vc.component.addMerchantShopValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/shop.adminAddStoreAndShop',
                    JSON.stringify(vc.component.addMerchantShopInfo), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMerchantShopModel').modal('hide');
                            vc.component.clearAddMerchantShopInfo();
                            vc.emit('merchantManage', 'listMerchant', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);

                    });
            },
            clearAddMerchantShopInfo: function () {
                vc.component.addMerchantShopInfo = {
                    name: "",
                    shopName: '',
                    areaAddress: '',
                    address: "",
                    tel: "",
                    storeTypeCd: "800900000005",
                    nearbyLandmarks: "无",
                    areaCode: '',
                    shopType: '',
                    shopTypes: [],
                    areas: [],
                    provs: [],
                    citys: [],
                    selectProv: '',
                    selectCity: '',
                    selectArea: '',
                };
            },
            getProv: function (_prov) {
                vc.component._initArea('202', _prov);
            },
            getCity: function (_city) {
                vc.component._initArea('303', _city);
            },
            getArea: function (_area) {
                vc.component.addMerchantShopInfo.areaCode = _area;
                vc.component.addMerchantShopInfo.areaAddress = '';
                if ($that.addMerchantShopInfo.provs == null || $that.addMerchantShopInfo.provs == undefined) {
                    return;
                }
                vc.component.addMerchantShopInfo.provs.forEach(function (_param) {
                    if (_param.areaCode == $that.addMerchantShopInfo.selectProv) {
                        vc.component.addMerchantShopInfo.areaAddress = _param.areaName;
                    }
                });
                vc.component.addMerchantShopInfo.citys.forEach(function (_param) {
                    if (_param.areaCode == $that.addMerchantShopInfo.selectCity) {
                        vc.component.addMerchantShopInfo.areaAddress += _param.areaName;
                    }
                });
                vc.component.addMerchantShopInfo.areas.forEach(function (_param) {
                    if (_param.areaCode == $that.addMerchantShopInfo.selectArea) {
                        vc.component.addMerchantShopInfo.areaAddress += _param.areaName;
                    }
                });
            },
            _initArea: function (_areaLevel, _parentAreaCode) { //加载区域
                let _param = {
                    params: {
                        areaLevel: _areaLevel,
                        parentAreaCode: _parentAreaCode
                    }
                };
                vc.http.apiGet('/area.listAreas',
                    _param,
                    function (json, res) {
                        if (res.status == 200) {
                            let _tmpAreas = JSON.parse(json).areas;
                            if (_areaLevel == '101') {
                                $that.addMerchantShopInfo.provs = _tmpAreas;
                            } else if (_areaLevel == '202') {
                                $that.addMerchantShopInfo.citys = _tmpAreas;
                            } else {
                                $that.addMerchantShopInfo.areas = _tmpAreas;
                            }
                            return;
                        }
                        //vc.component.$emit('errorInfoEvent',json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理', errInfo, error);
                        vc.toast("查询地区失败");
                    });
            },
            _listShopTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                    }
                };
                //发送get请求
                vc.http.apiGet('/shopType/queryShopType',
                    param,
                    function (json, res) {
                        let _shopTypeManageInfo = JSON.parse(json);
                        $that.addMerchantShopInfo.shopTypes = _shopTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);