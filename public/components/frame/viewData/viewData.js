(function(vc) {

    vc.extends({
        data: {
            viewDataInfo: {
                title: '',
                data: {}
            },
            flagOrgName: false
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('viewData', 'openViewDataModal', function(_param) {
                $that.viewDataInfo.title = _param.title;
                $that.viewDataInfo.data = _param.data;
                $('#viewDataModel').modal('show');
            });
        },
        methods: {
            textOrgName: function() {
                var _tmpOrgLevel = vc.component.viewDataInfo.orgLevel;
                var param = {
                    params: {
                        page: 1,
                        row: 30,
                        orgLevel: _tmpOrgLevel,
                        parentOrgId: vc.component.viewDataInfo.parentOrgId,
                        orgName: vc.component.viewDataInfo.orgName
                    }
                };
                //发送get请求
                vc.http.apiGet('/org.listOrgs',
                    param,
                    function(json, res) {
                        var arr = JSON.parse(json).orgs;
                        if (_tmpOrgLevel == 2) {
                            if (arr.length > 0) {
                                vc.toast("公司名重复");
                                vc.component.flagOrgName = true
                            } else {
                                vc.component.flagOrgName = false
                            }
                        } else if (_tmpOrgLevel == 3) {
                            if (arr.length > 0) {
                                vc.toast("组织名称重复");
                                vc.component.flagOrgName = true
                            } else {
                                vc.component.flagOrgName = false
                            }
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);