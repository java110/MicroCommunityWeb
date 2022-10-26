(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketRuleWayInfo: {
                wayId: '',
                ruleId: '',
                wayType: '',
                wayObjId: '',
                remark: '',
                marketTexts:[],
                marketPics:[],
                marketGoodss:[]
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMarketRuleWay', 'openAddMarketRuleWayModal', function (_param) {
                $that.addMarketRuleWayInfo.ruleId = _param.ruleId;
                $('#addMarketRuleWayModel').modal('show');
                $that._listMarketTexts();
                $that._listMarketPics();
                $that._listMarketGoodss();
            });
        },
        methods: {
            addMarketRuleWayValidate() {
                return vc.validate.validate({
                    addMarketRuleWayInfo: vc.component.addMarketRuleWayInfo
                }, {
                    'addMarketRuleWayInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "营销规则ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "营销规则ID不能超过30"
                        },
                    ],
                    'addMarketRuleWayInfo.wayType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "营销类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "营销方式类型不能超过12"
                        },
                    ],
                    'addMarketRuleWayInfo.wayObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "营销方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "营销方式不能超过30"
                        },
                    ],
                    'addMarketRuleWayInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveMarketRuleWayInfo: function () {
                if (!vc.component.addMarketRuleWayValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketRule.saveMarketRuleWay',
                    JSON.stringify(vc.component.addMarketRuleWayInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketRuleWayModel').modal('hide');
                            vc.component.clearAddMarketRuleWayInfo();
                            vc.emit('marketRuleWayInfo', 'listMarketRuleWay', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMarketRuleWayInfo: function () {
                vc.component.addMarketRuleWayInfo = {
                    ruleId: '',
                    wayType: '',
                    wayObjId: '',
                    remark: '',
                    marketTexts:[],
                    marketPics:[],
                    marketGoodss:[]
                };
            },
            _listMarketTexts: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/marketText.listMarketText',
                    param,
                    function (json, res) {
                        let _marketWayTextInfo = JSON.parse(json);
                        $that.addMarketRuleWayInfo.marketTexts = _marketWayTextInfo.data;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMarketPics: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };

                //发送get请求
                vc.http.apiGet('/marketPic.listMarketPic',
                    param,
                    function (json, res) {
                        let _marketWayPicInfo = JSON.parse(json);
                        
                        $that.addMarketRuleWayInfo.marketPics = _marketWayPicInfo.data;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listMarketGoodss: function (_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };

                //发送get请求
                vc.http.apiGet('/marketGoods.listMarketGoods',
                    param,
                    function (json, res) {
                        let _marketWayGoodsInfo = JSON.parse(json);
                        $that.addMarketRuleWayInfo.marketGoodss = _marketWayGoodsInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
