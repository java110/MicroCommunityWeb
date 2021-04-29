(function(vc){
    vc.extends({

        data:{
            searchOwnerInfo:{
                owners:[],
                _currentOwnerName:'',
                _currentOwnerId:''
            }
        },
        _initMethod:function(){

        },
        _initEvent:function(){
            vc.on('searchOwner','openSearchOwnerModel',function(_param){
                $('#searchOwnerModel').modal('show');
                vc.component._refreshSearchOwnerData();
                vc.component._loadAllOwnerInfo(1,10);
            });
        },
        methods:{
            _loadAllOwnerInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name,
                        ownerId:vc.component.searchOwnerInfo._currentOwnerId,
                        ownerTypeCd:'1001'
                    }
                };

                //发送get请求
                vc.http.get('searchOwner',
                    'listOwner',
                    param,
                    function(json){
                        var _ownerInfo = JSON.parse(json);
                        vc.component.searchOwnerInfo.owners = _ownerInfo.owners;
                    },function(){
                        console.log('请求失败处理');
                    }
                );
            },
            chooseOwner:function(_owner){
                vc.emit('visitForOwner','ownerInfo',_owner);
                // vc.emit($props.emitLoadData,'listOwnerData',{
                //     ownerId:_owner.ownerId
                // });
                $('#searchOwnerModel').modal('hide');
            },
            searchOwners:function(){
                vc.component._loadAllOwnerInfo(1,10,vc.component.searchOwnerInfo._currentOwnerName);
            },
            _refreshSearchOwnerData:function(){
                vc.component.searchOwnerInfo._currentOwnerName = "";
            }
        }

    });
})(window.vc);