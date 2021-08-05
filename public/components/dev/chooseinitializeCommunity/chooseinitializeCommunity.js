(function(vc){
    vc.extends({
        propTypes: {
           emitChooseinitializeCommunity:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseinitializeCommunityInfo:{
                initializeCommunitys: [],
                _devPassword:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseinitializeCommunity','openChooseinitializeCommunityModel',function(_param){
                $('#chooseinitializeCommunityModel').modal('show');
                vc.component._refreshChooseinitializeCommunityInfo();
            });
        },
        methods:{
            chooseinitializeCommunity:function(devPassword){
                vc.emit($props.emitChooseinitializeCommunity,'chooseinitializeCommunity',devPassword);
                $('#chooseinitializeCommunityModel').modal('hide');
            },
            queryServices:function(){
                vc.component.chooseinitializeCommunity(vc.component.ChooseinitializeCommunityInfo._devPassword);
            },
            _refreshChooseinitializeCommunityInfo:function(){
                vc.component.ChooseinitializeCommunityInfo._devPassword = "";
            }
        }

    });
})(window.vc);