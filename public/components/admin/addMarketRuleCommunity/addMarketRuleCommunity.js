(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketRuleCommunityInfo: {
                ruleId: '',
                communityId: '',
                remark: '',
                communitys:[],
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addMarketRuleCommunity', 'openAddMarketRuleCommunityModal', function (_param) {
                $that.addMarketRuleCommunityInfo.ruleId = _param.ruleId;
                $('#addMarketRuleCommunityModel').modal('show');
                $that._listRuleCommunitys();
              
            });
        },
        methods: {
            addMarketRuleCommunityValidate() {
                return vc.validate.validate({
                    addMarketRuleCommunityInfo: vc.component.addMarketRuleCommunityInfo
                }, {
                    'addMarketRuleCommunityInfo.ruleId': [
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
                    'addMarketRuleCommunityInfo.communityId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小区不能为空"
                        },
                    ],
                    'addMarketRuleCommunityInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveMarketRuleCommunityInfo: function () {
                if (!vc.component.addMarketRuleCommunityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketRule.saveMarketRuleCommunity',
                    JSON.stringify(vc.component.addMarketRuleCommunityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketRuleCommunityModel').modal('hide');
                            vc.component.clearAddMarketRuleCommunityInfo();
                            vc.emit('marketRuleCommunityInfo', 'listMarketRuleCommunity', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMarketRuleCommunityInfo: function () {
                vc.component.addMarketRuleCommunityInfo = {
                    ruleId: '',
                    communityId: '',
                    remark: '',
                    communitys:[],
                };
            },
            _listRuleCommunitys: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 500
                    }
                };
                //发送get请求
                vc.http.apiGet('/community.listCommunitys',
                    param,
                    function (json, res) {
                        let _marketWayTextInfo = JSON.parse(json);
                        $that.addMarketRuleCommunityInfo.communitys = _marketWayTextInfo.communitys;

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);
