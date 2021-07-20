(function(vc){
    vc.extends({
        propTypes: {
           emitChooseSingleResource:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseSingleResourceInfo:{
                maintenanceType: '',
                resourceStoreTypes: [],
                rstId: '',
                resId: '',
                selectedGoodsInfo: {},
                resourceStores: [],
                isCustom: false,
                customGoodsName: '',
                price: '',
                outLowPrice: '',
                outHighPrice: '',
                useNumber: 1
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseSingleResource', 'openChooseSingleResourceModel', function (_param) {
                // 清空数据
                vc.component._refreshChooseSingleResourceInfo();
                console.log(_param);
                vc.component.chooseSingleResourceInfo.maintenanceType = _param.maintenanceType;
                $('#chooseSingleResourceModel').modal('show');
                // 加载初始化数据
                vc.component._listResourceStoreType();
            });
        },
        methods:{
            //查询物品类型
            _listResourceStoreType: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        giveType: 1
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreType = JSON.parse(json);
                        vc.component.chooseSingleResourceInfo.resourceStoreTypes = _resourceStoreType.data;
                        // 前端添加自定义类
                        vc.component._appendCustomResourceStoreType();
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 追加自定义类
            _appendCustomResourceStoreType: function () {
                let customeType = {
                    rstId: 'custom',
                    name: '自定义'
                };
                vc.component.chooseSingleResourceInfo.resourceStoreTypes.push(customeType);
            },
            //选择商品类型
            _choseGoods: function () {
                vc.component.chooseSingleResourceInfo.resId = '';
                var select = document.getElementById("goods");
                vc.component.chooseSingleResourceInfo.rstId = select.value;
                // 处理自定义商品
                vc.component.chooseSingleResourceInfo.isCustom = false;
                if (select.value == 'custom'){
                    vc.component.chooseSingleResourceInfo.isCustom = true;
                    return;
                }
                if (vc.component.chooseSingleResourceInfo.rstId == null || vc.component.chooseSingleResourceInfo.rstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: vc.component.chooseSingleResourceInfo.rstId,
                        resId: vc.component.chooseSingleResourceInfo.resId,
                        communityId: vc.getCurrentCommunity().communityId,
                        chooseType: "repair",
                        giveType: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listUserStorehouses',
                    param,
                    function (json, res) {
                        var _goods = JSON.parse(json);
                        if(_goods.total <= 0){
                            vc.toast('暂无有效商品');
                        }
                        vc.component.chooseSingleResourceInfo.resourceStores = _goods.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //选择商品
            _chosePrice: function () {
                var select = document.getElementById("goodsPrice");
                vc.component.chooseSingleResourceInfo.resId = select.value;
                // 保存选中的商品信息
                vc.component.chooseSingleResourceInfo.resourceStores.forEach((item) => {
                    if (item.resId == select.value) {
                        vc.component.chooseSingleResourceInfo.selectedGoodsInfo = item;
                    }
                })

                if (vc.component.chooseSingleResourceInfo.selectedGoodsInfo.outLowPrice == vc.component.chooseSingleResourceInfo.selectedGoodsInfo.outHighPrice) {
                    vc.component.chooseSingleResourceInfo.price = vc.component.chooseSingleResourceInfo.selectedGoodsInfo.outLowPrice;
                } else {
                    vc.component.chooseSingleResourceInfo.price = '';
                }
                vc.component.chooseSingleResourceInfo.outLowPrice = vc.component.chooseSingleResourceInfo.selectedGoodsInfo.outLowPrice;
                vc.component.chooseSingleResourceInfo.outHighPrice = vc.component.chooseSingleResourceInfo.selectedGoodsInfo.outHighPrice;
            },
            // 商品数量减少
            _useNumDec: function () {
                if (vc.component.chooseSingleResourceInfo.useNumber <= 1) {
                    vc.toast("不能再减少了");
                    return;
                }
                vc.component.chooseSingleResourceInfo.useNumber -= 1;
            },
            // 商品数量增加
            _useNumInc: function () {
                vc.component.chooseSingleResourceInfo.useNumber += 1;
            },
            chooseResourceValidate() {
                return vc.validate.validate({
                    chooseSingleResourceInfo: vc.component.chooseSingleResourceInfo
                }, {
                    'chooseSingleResourceInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品类型不能为空"
                        }
                    ],
                    'chooseSingleResourceInfo.resId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品不能为空"
                        }
                    ],
                    'chooseSingleResourceInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "商品价格格式错误"
                        },
                    ],
                    'chooseSingleResourceInfo.useNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品数量不能为零"
                        }
                    ]
                });
            },
            yongLiaoValidate() {
                return vc.validate.validate({
                    chooseSingleResourceInfo: vc.component.chooseSingleResourceInfo
                }, {
                    'chooseSingleResourceInfo.rstId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品类型不能为空"
                        }
                    ],
                    'chooseSingleResourceInfo.resId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品不能为空"
                        }
                    ],
                    'chooseSingleResourceInfo.useNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商品数量不能为零"
                        }
                    ]
                });
            },
            // 提交保存
            _chooseSingleResource:function(){
                // 自定义商品
                if (vc.component.chooseSingleResourceInfo.isCustom){

                } else {
                    // 有偿
                    if (vc.component.chooseSingleResourceInfo.maintenanceType == '1001' && !vc.component.chooseResourceValidate()) {
                        vc.toast(vc.validate.errInfo);
                        return;
                    }
                    // 用料
                    if (vc.component.chooseSingleResourceInfo.maintenanceType == '1003' && !vc.component.yongLiaoValidate()) {
                        vc.toast(vc.validate.errInfo);
                        return;
                    }
                }
                // 回传参数
                let chooseResource = vc.component.chooseSingleResourceInfo.selectedGoodsInfo;
                chooseResource.price = vc.component.chooseSingleResourceInfo.price;
                chooseResource.useNumber = vc.component.chooseSingleResourceInfo.useNumber;
                chooseResource.isCustom = vc.component.chooseSingleResourceInfo.isCustom;
                chooseResource.customGoodsName = vc.component.chooseSingleResourceInfo.customGoodsName;
                if(vc.component.chooseSingleResourceInfo.isCustom){
                    chooseResource.rstName = '自定义';
                }
                vc.emit($props.emitChooseSingleResource, 'chooseSingleResource', chooseResource);
                $('#chooseSingleResourceModel').modal('hide');
            },
            // 取消
            _closeModel: function () {
                $('#chooseSingleResourceModel').modal('hide');
            },
            // 清空页面数据
            _refreshChooseSingleResourceInfo:function(){
                vc.component.chooseSingleResourceInfo = {
                    maintenanceType: '',
                    resourceStoreTypes: [],
                    rstId: '',
                    resId: '',
                    selectedGoodsInfo: {},
                    resourceStores: [],
                    isCustom: false,
                    customGoodsName: '',
                    price: '',
                    outLowPrice: '',
                    outHighPrice: '',
                    useNumber: 1
                }
            }
        }

    });
})(window.vc);
