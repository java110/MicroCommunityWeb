(function(vc){
    vc.extends({
        propTypes: {
           emitChooseCommunitySpace:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseCommunitySpaceInfo:{
                communitySpaces:[],
                _currentCommunitySpaceName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseCommunitySpace','openChooseCommunitySpaceModel',function(_param){
                $('#chooseCommunitySpaceModel').modal('show');
                vc.component._refreshChooseCommunitySpaceInfo();
                vc.component._loadAllCommunitySpaceInfo(1,10,'');
            });
        },
        methods:{
            _loadAllCommunitySpaceInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('communitySpace.listCommunitySpaces',
                             param,
                             function(json){
                                var _communitySpaceInfo = JSON.parse(json);
                                vc.component.chooseCommunitySpaceInfo.communitySpaces = _communitySpaceInfo.communitySpaces;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseCommunitySpace:function(_communitySpace){
                if(_communitySpace.hasOwnProperty('name')){
                     _communitySpace.communitySpaceName = _communitySpace.name;
                }
                vc.emit($props.emitChooseCommunitySpace,'chooseCommunitySpace',_communitySpace);
                vc.emit($props.emitLoadData,'listCommunitySpaceData',{
                    communitySpaceId:_communitySpace.communitySpaceId
                });
                $('#chooseCommunitySpaceModel').modal('hide');
            },
            queryCommunitySpaces:function(){
                vc.component._loadAllCommunitySpaceInfo(1,10,vc.component.chooseCommunitySpaceInfo._currentCommunitySpaceName);
            },
            _refreshChooseCommunitySpaceInfo:function(){
                vc.component.chooseCommunitySpaceInfo._currentCommunitySpaceName = "";
            }
        }

    });
})(window.vc);
