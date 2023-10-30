(function(vc) {
    vc.extends({
        data: {
            propertyIndexInfo: {
                storeTypeCd: '', 
            }
        },
        _initMethod: function() {
            setTimeout(function(){
                $that._computeStoreTypeCd();
                
            },1000)
        },
        _initEvent: function() {
            
        },
        methods: {
            _computeStoreTypeCd:function(){
                let _getUserInfo = vc.getData('/nav/getUserInfo')
                if(_getUserInfo){
                    $that.propertyIndexInfo.storeTypeCd = _getUserInfo.storeTypeCd
                }

                if($that.propertyIndexInfo.storeTypeCd == '800900000003'){
                    vc.emit('indexCommunityView','initData',{});
                    vc.emit('indexNotice','initData',{});
                    vc.emit('indexRepairComplaint','initData',{});
                    vc.emit('indexOwnerRoom','initData',{});
                }

                if($that.propertyIndexInfo.storeTypeCd == '800900000001'){
                    vc.emit('adminIndex', 'initData',{})
                }
            }
        }
    })
})(window.vc);