(function(vc){
    vc.extends({
        propTypes: {
           emitChooseJunkRequirement:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseJunkRequirementInfo:{
                junkRequirements:[],
                _currentJunkRequirementName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseJunkRequirement','openChooseJunkRequirementModel',function(_param){
                $('#chooseJunkRequirementModel').modal('show');
                vc.component._refreshChooseJunkRequirementInfo();
                vc.component._loadAllJunkRequirementInfo(1,10,'');
            });
        },
        methods:{
            _loadAllJunkRequirementInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('junkRequirement.listJunkRequirements',
                             param,
                             function(json){
                                var _junkRequirementInfo = JSON.parse(json);
                                vc.component.chooseJunkRequirementInfo.junkRequirements = _junkRequirementInfo.junkRequirements;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseJunkRequirement:function(_junkRequirement){
                if(_junkRequirement.hasOwnProperty('name')){
                     _junkRequirement.junkRequirementName = _junkRequirement.name;
                }
                vc.emit($props.emitChooseJunkRequirement,'chooseJunkRequirement',_junkRequirement);
                vc.emit($props.emitLoadData,'listJunkRequirementData',{
                    junkRequirementId:_junkRequirement.junkRequirementId
                });
                $('#chooseJunkRequirementModel').modal('hide');
            },
            queryJunkRequirements:function(){
                vc.component._loadAllJunkRequirementInfo(1,10,vc.component.chooseJunkRequirementInfo._currentJunkRequirementName);
            },
            _refreshChooseJunkRequirementInfo:function(){
                vc.component.chooseJunkRequirementInfo._currentJunkRequirementName = "";
            }
        }

    });
})(window.vc);
