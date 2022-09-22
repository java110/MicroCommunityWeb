/**
 系统配置 组件
 **/
(function (vc) {
    vc.extends({
        data: {
            systemInfoManageInfo: {
                index: 0,
                flowComponent: 'systemInfoManageInfo',
                systemId: '',
                systemTitle: '',
                subSystemTitle: '',
                companyName: '',
                logoUrl: '',
                imgUrl: '',
                defaultCommunityId: '',
                ownerTitle: '',
                propertyTitle: '',
                qqMapKey: '',
                mallUrl: '',
                systemSimpleTitle: ''
            }
        },
        _initMethod: function () {
            //根据请求参数查询 查询 业主信息
            vc.component._listSystemInfos();
        },
        _initEvent: function () {
            vc.on('viewSystemInfo', 'load', function () {
                vc.component._listSystemInfos();
            });
        },
        methods: {
            _openEditSystemInfoInfoModel() {
                vc.emit('editSystemInfo', 'openEditSystemInfoModal', $that.systemInfoManageInfo);
            },
            _listSystemInfos: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1
                    }
                };
                //发送get请求
                vc.http.apiGet('/system.listSystemInfo',
                    param,
                    function (json, res) {
                        let _systemInfoManageInfo = JSON.parse(json);
                        vc.copyObject(_systemInfoManageInfo.data[0], $that.systemInfoManageInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);