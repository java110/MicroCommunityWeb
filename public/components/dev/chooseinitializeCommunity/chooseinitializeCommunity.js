(function(vc){
    vc.extends({
        propTypes: {
           emitChooseinitializeCommunity:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseinitializeCommunityInfo:{
                communityName: '',
                communityId: '',
                _devPassword:''
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseinitializeCommunity','openChooseinitializeCommunityModel',function(_param){
                console.log(_param);
                vc.component.chooseinitializeCommunityInfo.communityName = _param._initializeCommunity.name;
                vc.component.chooseinitializeCommunityInfo.communityId = _param._initializeCommunity.communityId;
                $('#chooseinitializeCommunityModel').modal('show');
                vc.component._refreshChooseinitializeCommunityInfo();
            });
        },
        methods:{
            chooseinitializeCommunity:function(){
                vc.emit($props.emitChooseinitializeCommunity,'chooseinitializeCommunity', vc.component.chooseinitializeCommunityInfo);
                $('#chooseinitializeCommunityModel').modal('hide');
            },
            authenticationDevPassword:function(){
                vc.component.chooseinitializeCommunity();
            },
            _refreshChooseinitializeCommunityInfo:function(){
                vc.component.chooseinitializeCommunityInfo._devPassword = "";
            },
            closeInitializeCommunityModel:function(){
                $('#chooseinitializeCommunityModel').modal('hide');
            }
        }

    });
})(window.vc);