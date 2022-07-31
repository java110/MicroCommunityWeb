(function(vc){
    vc.extends({
        propTypes: {
           emitChooseAttrValue:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseAttrValueInfo:{
                attrValues:[],
                _currentAttrValueName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseAttrValue','openChooseAttrValueModel',function(_param){
                $('#chooseAttrValueModel').modal('show');
                vc.component._refreshChooseAttrValueInfo();
                vc.component._loadAllAttrValueInfo(1,10,'');
            });
        },
        methods:{
            _loadAllAttrValueInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('attrValue.listAttrValues',
                             param,
                             function(json){
                                var _attrValueInfo = JSON.parse(json);
                                vc.component.chooseAttrValueInfo.attrValues = _attrValueInfo.attrValues;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseAttrValue:function(_attrValue){
                if(_attrValue.hasOwnProperty('name')){
                     _attrValue.attrValueName = _attrValue.name;
                }
                vc.emit($props.emitChooseAttrValue,'chooseAttrValue',_attrValue);
                vc.emit($props.emitLoadData,'listAttrValueData',{
                    attrValueId:_attrValue.attrValueId
                });
                $('#chooseAttrValueModel').modal('hide');
            },
            queryAttrValues:function(){
                vc.component._loadAllAttrValueInfo(1,10,vc.component.chooseAttrValueInfo._currentAttrValueName);
            },
            _refreshChooseAttrValueInfo:function(){
                vc.component.chooseAttrValueInfo._currentAttrValueName = "";
            }
        }

    });
})(window.vc);
