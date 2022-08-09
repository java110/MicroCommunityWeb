/**
 权限组
 **/
(function(vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string,
            callBackFunction: vc.propTypes.string,
            showCallBackButton: vc.propTypes.string = 'false'
        },
        data: {
            viewOwnerInfo: {
                flowComponent: 'viewOwnerInfo',
                ownerId: "",
                name: "",
                age: "",
                sex: "-1",
                userName: "",
                remark: "",
                link: ""
            },
            showCallBackButton: 'true'
        },
        _initMethod: function() {
            vc.component._loadOwnerInfo();
        },
        _initEvent: function() {
            vc.on('visitForOwner', 'onIndex', function(_index) {
                // vc.emit('addVisitSpace', 'notify', _index);
                /*if(_index == 2){
                   vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewOwnerInfo);
                }*/
            });
            vc.on('visitForOwner', 'ownerInfo', function(_info) {
                vc.component.viewOwnerInfo = _info;
                vc.emit('addVisitSpace', 'ownerId', vc.component.viewOwnerInfo.ownerId);
            });
            vc.on('visitForOwner', 'clearInfo', function() {
                vc.component._clearViewOwnerInfo();
            });
        },
        methods: {
            _loadOwnerInfo: function() {
                //加载 业主信息
                var _ownerId = vc.getParam('ownerId')
                if (!vc.notNull(_ownerId)) {
                    return;
                }
                var param = {
                        params: {
                            ownerId: _ownerId,
                            page: 1,
                            row: 1,
                            communityId: vc.getCurrentCommunity().communityId,
                            ownerTypeCd: '1001'
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function(json, res) {
                        var listOwnerData = JSON.parse(json);
                        vc.copyObject(listOwnerData.owners[0], vc.component.viewOwnerInfo);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openSearchOwnerModel: function(_ownerId) {
                vc.emit('searchOwner', 'openSearchOwnerModel', {});
            },
            _clearViewOwnerInfo: function() {
                vc.component.viewOwnerInfo.flowComponent = 'viewOwnerInfo';
                vc.component.viewOwnerInfo.ownerId = '';
                vc.component.viewOwnerInfo.name = '';
                vc.component.viewOwnerInfo.age = '';
                vc.component.viewOwnerInfo.sex = '';
                vc.component.viewOwnerInfo.userName = '';
                vc.component.viewOwnerInfo.remark = '';
                vc.component.viewOwnerInfo.link = '';
            }
        }
    });
})(window.vc);