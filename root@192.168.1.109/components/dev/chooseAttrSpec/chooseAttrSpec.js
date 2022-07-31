(function(vc){
    vc.extends({
        propTypes: {
           emitChooseAttrSpec:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseAttrSpecInfo:{
                attrSpecs:[],
                _currentAttrSpecName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseAttrSpec','openChooseAttrSpecModel',function(_param){
                $('#chooseAttrSpecModel').modal('show');
                vc.component._refreshChooseAttrSpecInfo();
                vc.component._loadAllAttrSpecInfo(1,10,'');
            });
        },
        methods:{
            _loadAllAttrSpecInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('attrSpec.listAttrSpecs',
                             param,
                             function(json){
                                var _attrSpecInfo = JSON.parse(json);
                                vc.component.chooseAttrSpecInfo.attrSpecs = _attrSpecInfo.attrSpecs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseAttrSpec:function(_attrSpec){
                if(_attrSpec.hasOwnProperty('name')){
                     _attrSpec.attrSpecName = _attrSpec.name;
                }
                vc.emit($props.emitChooseAttrSpec,'chooseAttrSpec',_attrSpec);
                vc.emit($props.emitLoadData,'listAttrSpecData',{
                    attrSpecId:_attrSpec.attrSpecId
                });
                $('#chooseAttrSpecModel').modal('hide');
            },
            queryAttrSpecs:function(){
                vc.component._loadAllAttrSpecInfo(1,10,vc.component.chooseAttrSpecInfo._currentAttrSpecName);
            },
            _refreshChooseAttrSpecInfo:function(){
                vc.component.chooseAttrSpecInfo._currentAttrSpecName = "";
            }
        }

    });
})(window.vc);
