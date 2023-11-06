/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            assetInventoryInInfo: {
                resourceStores: [],
                shId: '',
                shName: '',
                invTime: '',
                name: '',
                staffName: '',
                storehouses: [],
                remark: '',
                state: '2000',
                communityId: vc.getCurrentCommunity().communityId
            }
        },
        _initMethod: function () {
            /*vc.initDateTime('invTime', function (_value) {
                $that.assetInventoryInInfo.invTime = _value;
            });*/
            vc.component._initAssetInventoryInDateInfo();
            vc.component._listShopHouses();
        },
        _initEvent: function () {
            vc.on('viewResourceStoreInfo2', 'setSelectResourceStores', function (resourceStores) {
                let oldList = vc.component.assetInventoryInInfo.resourceStores;
                // 过滤重复选择的商品
                resourceStores.forEach((newItem, newIndex) => {
                    newItem.rsId = '';
                    oldList.forEach((oldItem) => {
                        if (oldItem.resId == newItem.resId) {
                            delete resourceStores[newIndex];
                        }
                    })
                })
                // 合并已有商品和新添加商品
                resourceStores.push.apply(resourceStores, oldList);
                // 过滤空元素
                resourceStores = resourceStores.filter((s) => {
                    return s.hasOwnProperty('resId');
                });
                vc.component.assetInventoryInInfo.resourceStores = resourceStores;
            });
        },
        methods: {
            _initAssetInventoryInDateInfo: function () {
                $('.invTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.invTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".invTime").val();
                        vc.component.assetInventoryInInfo.invTime = value;
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control invTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            doAssetInventoryValidate() {
                return vc.validate.validate({
                    assetInventoryInInfo: vc.component.assetInventoryInInfo
                }, {
                    'assetInventoryInInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "盘点名称不能为空"
                        }
                    ],
                    'assetInventoryInInfo.staffName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "盘点人不能为空"
                        }
                    ],
                    'assetInventoryInInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择仓库"
                        }
                    ],
                    'assetInventoryInInfo.invTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "盘点日期不能为空"
                        }
                    ],
                    'assetInventoryInInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "盘点说明不能为空"
                        }
                    ],
                });
            },
            _doAssetInventory: function () {
                if (!vc.component.doAssetInventoryValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _resourceStores = vc.component.assetInventoryInInfo.resourceStores;
                if (_resourceStores.length < 1) {
                    vc.toast('请选择商品');
                    return;
                }
                for (var i = 0; i < _resourceStores.length; i++) {
                    if (!_resourceStores[i].timesId) {
                        vc.toast("未选择价格");
                        return;
                    }
                    if (!_resourceStores[i].hasOwnProperty("quantity") || !_resourceStores[i].quantity
                        || parseInt(_resourceStores[i].quantity) <= 0) {
                        vc.toast("请填写数量");
                        return;
                    }
                    // _resourceStores[i].quantity = parseInt(_resourceStores[i].quantity);
                    // if (vc.component.assetInventoryInInfo.resOrderType == "20000") {
                    //     if (_resourceStores[i].quantity > _resourceStores[i].selectedStock) {
                    //         vc.toast(_resourceStores[i].resName + ",库存不足");
                    //         return;
                    //     }
                    // }
                }
                vc.http.apiPost(
                    'assetInventory.saveAssetInventory',
                    JSON.stringify(vc.component.assetInventoryInInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.toast(_json.msg);
                            vc.goBack();
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _openChooseProductModal: function () {
                if (!$that.assetInventoryInInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                // vc.emit('chooseProductAndSpec', 'openChooseProductModel', {
                //     shId: $that.assetInventoryInInfo.shId
                // });
            },
            _goBack: function () {
                vc.goBack();
            },
            _listShopHouses: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        var _shopHouseManageInfo = JSON.parse(json);
                        vc.component.assetInventoryInInfo.storehouses = _shopHouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSelectResourceStoreInfoModel() {
                if (!$that.assetInventoryInInfo.shId) {
                    vc.toast('请先选择仓库');
                    return;
                }
                vc.emit('chooseResourceStore2', 'openChooseResourceStoreModel2', {
                    shId: $that.assetInventoryInInfo.shId,
                    unEditFlag: true
                });
            },
            // 清空物品,确定仓库名称
            selectResourceStores: function () {
                vc.component.assetInventoryInInfo.resourceStores = [];
                let _storehouses = vc.component.assetInventoryInInfo.storehouses;
                _storehouses.forEach((item, index) => {
                    if (item.shId == $that.assetInventoryInInfo.shId) {
                        $that.assetInventoryInInfo.shName = item.shName;
                    }
                })
            },
            // 移除选中item
            _removeSelectResourceStoreItem: function (resId) {
                vc.component.assetInventoryInInfo.resourceStores.forEach((item, index) => {
                    if (item.resId == resId) {
                        vc.component.assetInventoryInInfo.resourceStores.splice(index, 1);
                    }
                })
                // 同时移除子页面复选框选项
                vc.emit('chooseResourceStore2', 'removeSelectResourceStoreItem', resId);
            },
            _changeTimesId: function (e, index) {
                let timeId = e.target.value;
                let times = vc.component.assetInventoryInInfo.resourceStores[index].times;
                times.forEach((item) => {
                    if (item.timesId == timeId) {
                        // 存储价格对应库存，方便校验库存
                        vc.component.assetInventoryInInfo.resourceStores[index].selectedStock = item.stock;
                    }
                })
            },
            _getTimesStock: function (_resourceStore) {
                if (!_resourceStore.timesId) {
                    return "-";
                }
                let _stock = 0;
                _resourceStore.times.forEach(_item => {
                    if (_item.timesId == _resourceStore.timesId) {
                        _stock = _item.stock;
                    }
                });
                if (!_resourceStore.quantity) {
                    _resourceStore.quantity = '';
                }
                return _stock;
            }
        }
    });
})(window.vc);
