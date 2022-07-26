(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roleInfo: {
                curRole:{},
                tabName:'privilege'
            },
        },
       
        _initMethod: function() {
           
        },
        _initEvent: function() {
            vc.on('role','switchRole',function(_param){
                $that.roleInfo.curRole = _param;
                $that._changeRoleTab('privilege')
            })
        },
        methods: {
            _changeRoleTab:function(_tabName){
                $that.roleInfo.tabName = _tabName;
                if(_tabName == 'privilege'){
                    vc.emit('privilegeTree','loadPrivilege',$that.roleInfo.curRole.pgId);
                }
            }
        },
    });
})(window.vc);