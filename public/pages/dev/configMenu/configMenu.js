/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            configMenuInfo: {
                $step: {},
                index: 0,
                infos: []
            }
        },
        _initMethod: function() {
            $that._initStep();
        },
        _initEvent: function() {
            vc.on("configMenu", "notify", function(_info) {
                $that.configMenuInfo.infos[$that.configMenuInfo.index] = _info;
            });
        },
        methods: {
            _initStep: function() {
                $that.configMenuInfo.$step = $("#step");
                $that.configMenuInfo.$step.step({
                    index: 0,
                    time: 500,
                    title: ["选择菜单组", "菜单信息", "权限信息"]
                });
                $that.configMenuInfo.index = $that.configMenuInfo.$step.getIndex();
            },
            _prevStep: function() {
                $that.configMenuInfo.$step.prevStep();
                $that.configMenuInfo.index = $that.configMenuInfo.$step.getIndex();
                vc.emit('viewMenuGroupInfo', 'onIndex', $that.configMenuInfo.index);
                vc.emit('addMenuView', 'onIndex', $that.configMenuInfo.index);
                vc.emit('addPrivilegeView', 'onIndex', $that.configMenuInfo.index);
            },
            _nextStep: function() {
                var _currentData = $that.configMenuInfo.infos[$that.configMenuInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                $that.configMenuInfo.$step.nextStep();
                $that.configMenuInfo.index = $that.configMenuInfo.$step.getIndex();
                vc.emit('viewMenuGroupInfo', 'onIndex', $that.configMenuInfo.index);
                vc.emit('addMenuView', 'onIndex', $that.configMenuInfo.index);
                vc.emit('addPrivilegeView', 'onIndex', $that.configMenuInfo.index);
            },
            _finishStep: function() {
                var _currentData = $that.configMenuInfo.infos[$that.configMenuInfo.index];
                if (_currentData == null || _currentData == undefined) {
                    vc.toast("请选择或填写必选信息");
                    return;
                }
                var param = {
                    data: $that.configMenuInfo.infos
                }
                vc.http.post(
                    'configMenuBinding',
                    'binding',
                    JSON.stringify(param), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.toast('处理成功');
                            //关闭model
                            //vc.jumpToPage("/#/pages/dev/menuManage?" + vc.objToGetParam(JSON.parse(json)));
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            }
        }
    });
})(window.vc);