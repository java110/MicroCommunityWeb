/**
    店铺审核 组件
**/
(function (vc) {

    vc.extends({
        data: {
            viewShopAuditInfo: {
                index: 0,
                flowComponent: 'viewShopAuditInfo',
                auditId: '',
                shopId: '',
                shopLogo: '',
                storeId: '',
                shopName: '',
                shopDesc: '',
                mapX: '',
                mapY: '',
                sendAddress: '',
                returnAddress: '',
                shopTypeName: '',
                areaName: '',
                returnPerson: '',
                returnLink: '',
                state: '',
                shopType: '',
                openType: '',
                areaCode: '',
                auditOpinion: '',
                applyOpinion: '',
                statusCd: '',
            },
            preShopInfo: {
                shopId: '',
                shopName: '',
                shopLogo: '',
                shopType: '',
                openType: '',
                shopDesc: '',
                changeLogo: '',
                sendAddress: '',
                storeId: '',
                returnPerson: '',
                returnLink: '',
                returnAddress: '',
                applyOpinion: '',
                mapX: '',
                mapY: '',
                state: '',
                areaCode: ''
            },
            auditInfo: {
                state: '',
                auditOpinion: ''
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._loadShopAuditInfoData();
        },
        _initEvent: function () {
            vc.on('viewShopAuditInfo', 'chooseShopAudit', function (_app) {
                vc.copyObject(_app, vc.component.viewShopAuditInfo);
                vc.component._needShopInfo(vc.component.viewShopAuditInfo.shopId);
            });
            vc.on('viewShopAuditInfo', 'onIndex', function (_index) {
                vc.component.viewShopAuditInfo.index = _index;
            });

        },
        methods: {
            _needShopInfo: function (_shopId) {
                var param = {
                    params: {
                        page : 1,
                        row : 1,
                        shopId:_shopId
                    }
                };
                //发送get请求
                vc.http.apiGet('/shop/queryShopsByAdmin',
                    param,
                    function (json, res) {
                        var _shopInfo = JSON.parse(json);
                        vc.component.preShopInfo = _shopInfo.data[0];
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            auditValidate() {
                return vc.validate.validate({
                    auditInfo: vc.component.auditInfo
                }, {
                    'auditInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审核状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "审核状态错误"
                        },
                    ],
                    'auditInfo.auditOpinion': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "原因内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "原因内容不能超过200"
                        },
                    ]
                });
            },
            _auditSubmit: function () {
                if (!vc.component.auditValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                    let _auditInfo = {
                        state: vc.component.auditInfo.state,
                        auditOpinion: vc.component.auditInfo.auditOpinion
                    };
                    if (_auditInfo.state == '1200') {
                        _auditInfo.auditOpinion = '拒绝:' + _auditInfo.auditOpinion;
                    }
                    _auditInfo.shopId = $that.viewShopAuditInfo.shopId;
                    _auditInfo.storeId = $that.viewShopAuditInfo.storeId;
                    _auditInfo.auditId = $that.viewShopAuditInfo.auditId;
                    _auditInfo.remark = _auditInfo.auditOpinion;
                    vc.http.apiPost('/shopAudit/auditShop',
                        JSON.stringify(_auditInfo),
                        {
                            emulateJSON: true
                        },
                        function (json, res) {
                            let _json = JSON.parse(json)
                            if (_json.code != 0) {
                                vc.toast(_json.msg);
                                return;
                            }
                            vc.toast("处理成功");
                            vc.emit('shopAuditManage', 'listShopAudit', {});
                        }, function (errInfo, error) {
                            console.log('请求失败处理');
                            vc.toast("处理失败：" + errInfo);
                        }
                    );
                    return;
            },
            _openTypeName: function (_state) {
                if(_state == "1"){
                    return "商家"
                }
                if(_state == "2"){
                    return "服务"
                }
                if(_state == "3"){
                    return "商家和服务"
                }
            },
            _refreshShopAuditManageInfo:function(){
                 vc.emit('shopAuditManage', 'listShopAudit', {});
            },
            _openSelectShopAuditInfoModel() {
                vc.emit('chooseShopAudit', 'openChooseShopAuditModel', {});
            },
            _openAddShopAuditInfoModel() {
                vc.emit('addShopAudit', 'openAddShopAuditModal', {});
            },
            _loadShopAuditInfoData: function () {

            }
        }
    });

})(window.vc);
