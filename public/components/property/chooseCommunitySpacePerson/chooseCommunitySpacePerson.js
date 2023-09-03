(function(vc){
    vc.extends({
        propTypes: {
           emitChooseCommunitySpacePerson:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseCommunitySpacePersonInfo:{
                communitySpacePersons:[],
                _currentCommunitySpacePersonName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseCommunitySpacePerson','openChooseCommunitySpacePersonModel',function(_param){
                $('#chooseCommunitySpacePersonModel').modal('show');
                vc.component._refreshChooseCommunitySpacePersonInfo();
                vc.component._loadAllCommunitySpacePersonInfo(1,10,'');
            });
        },
        methods:{
            _loadAllCommunitySpacePersonInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('communitySpacePerson.listCommunitySpacePersons',
                             param,
                             function(json){
                                var _communitySpacePersonInfo = JSON.parse(json);
                                vc.component.chooseCommunitySpacePersonInfo.communitySpacePersons = _communitySpacePersonInfo.communitySpacePersons;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseCommunitySpacePerson:function(_communitySpacePerson){
                if(_communitySpacePerson.hasOwnProperty('name')){
                     _communitySpacePerson.communitySpacePersonName = _communitySpacePerson.name;
                }
                vc.emit($props.emitChooseCommunitySpacePerson,'chooseCommunitySpacePerson',_communitySpacePerson);
                vc.emit($props.emitLoadData,'listCommunitySpacePersonData',{
                    communitySpacePersonId:_communitySpacePerson.communitySpacePersonId
                });
                $('#chooseCommunitySpacePersonModel').modal('hide');
            },
            queryCommunitySpacePersons:function(){
                vc.component._loadAllCommunitySpacePersonInfo(1,10,vc.component.chooseCommunitySpacePersonInfo._currentCommunitySpacePersonName);
            },
            _refreshChooseCommunitySpacePersonInfo:function(){
                vc.component.chooseCommunitySpacePersonInfo._currentCommunitySpacePersonName = "";
            }
        }

    });
})(window.vc);
