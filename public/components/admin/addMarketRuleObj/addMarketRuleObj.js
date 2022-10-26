(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMarketRuleObjInfo: {
                ruleId: '',
                objType: '',
                remark: '',
                objTypes:[],
            }
        },
        _initMethod: function () {

            vc.getDict('market_rule_obj','obj_type',function(_data){
                $that.addMarketRuleObjInfo.objTypes = _data;
            })

        },
        _initEvent: function () {
            vc.on('addMarketRuleObj', 'openAddMarketRuleObjModal', function (_param) {
                $that.addMarketRuleObjInfo.ruleId = _param.ruleId;
                $('#addMarketRuleObjModel').modal('show');
               
              
            });
        },
        methods: {
            addMarketRuleObjValidate() {
                return vc.validate.validate({
                    addMarketRuleObjInfo: vc.component.addMarketRuleObjInfo
                }, {
                    'addMarketRuleObjInfo.ruleId': [
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
                    'addMarketRuleObjInfo.objType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "授权对象不能为空"
                        },
                    ],
                    'addMarketRuleObjInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveMarketRuleObjInfo: function () {
                if (!vc.component.addMarketRuleObjValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/marketRule.saveMarketRuleObj',
                    JSON.stringify(vc.component.addMarketRuleObjInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMarketRuleObjModel').modal('hide');
                            vc.component.clearAddMarketRuleObjInfo();
                            vc.emit('marketRuleObjInfo', 'listMarketRuleObj', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMarketRuleObjInfo: function () {
                let _data  =   $that.addMarketRuleObjInfo.objTypes;
                vc.component.addMarketRuleObjInfo = {
                    ruleId: '',
                    objType: '',
                    remark: '',
                    objTypes:_data,
                };
            },
        }
    });

})(window.vc);
