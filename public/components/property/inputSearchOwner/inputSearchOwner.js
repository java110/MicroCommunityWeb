(function(vc, vm) {

    vc.extends({
        data: {
            inputSearchOwnerInfo: {
                owners: [],
                callComponent: ''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('inputSearchOwnerInfo', 'searchOwner', function(_param) {
                if (!_param.ownerName) {
                    return;
                }
                $that._loadOwnerInfo(_param.ownerName, _param.ownerTypeCd);
                $that.inputSearchOwnerInfo.callComponent = _param.callComponent;
            });
        },
        methods: {
            _loadOwnerInfo: function(_ownerName, _ownerTypeCd) {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        ownerTypeCd: _ownerTypeCd,
                        name: _ownerName,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function(json, res) {
                        let listOwnerData = JSON.parse(json);
                        $that.inputSearchOwnerInfo.owners = listOwnerData.owners;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _inputSearchOwnerChooseOwner: function(_owner) {
                vc.emit($that.inputSearchOwnerInfo.callComponent, "notifyOwner", _owner);
                $that.inputSearchOwnerInfo.owners = [];
            }

        }
    });

})(window.vc, window.vc.component);