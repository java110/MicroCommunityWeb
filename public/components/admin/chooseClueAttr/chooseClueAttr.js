(function(vc){
    vc.extends({
        propTypes: {
           emitChooseClueAttr:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseClueAttrInfo:{
                clueAttrs:[],
                _currentClueAttrName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseClueAttr','openChooseClueAttrModel',function(_param){
                $('#chooseClueAttrModel').modal('show');
                vc.component._refreshChooseClueAttrInfo();
                vc.component._loadAllClueAttrInfo(1,10,'');
            });
        },
        methods:{
            _loadAllClueAttrInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('/clueAttr/listClueAttrs',
                             param,
                             function(json){
                                var _clueAttrInfo = JSON.parse(json);
                                vc.component.chooseClueAttrInfo.clueAttrs = _clueAttrInfo.clueAttrs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseClueAttr:function(_clueAttr){
                if(_clueAttr.hasOwnProperty('name')){
                     _clueAttr.clueAttrName = _clueAttr.name;
                }
                vc.emit($props.emitChooseClueAttr,'chooseClueAttr',_clueAttr);
                vc.emit($props.emitLoadData,'listClueAttrData',{
                    clueAttrId:_clueAttr.clueAttrId
                });
                $('#chooseClueAttrModel').modal('hide');
            },
            queryClueAttrs:function(){
                vc.component._loadAllClueAttrInfo(1,10,vc.component.chooseClueAttrInfo._currentClueAttrName);
            },
            _refreshChooseClueAttrInfo:function(){
                vc.component.chooseClueAttrInfo._currentClueAttrName = "";
            }
        }

    });
})(window.vc);
