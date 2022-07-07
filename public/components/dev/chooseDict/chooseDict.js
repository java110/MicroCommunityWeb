(function(vc){
    vc.extends({
        propTypes: {
           emitChooseDict:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseDictInfo:{
                dicts:[],
                _currentDictName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseDict','openChooseDictModel',function(_param){
                $('#chooseDictModel').modal('show');
                vc.component._refreshChooseDictInfo();
                vc.component._loadAllDictInfo(1,10,'');
            });
        },
        methods:{
            _loadAllDictInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('dict.listDicts',
                             param,
                             function(json){
                                var _dictInfo = JSON.parse(json);
                                vc.component.chooseDictInfo.dicts = _dictInfo.dicts;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseDict:function(_dict){
                if(_dict.hasOwnProperty('name')){
                     _dict.dictName = _dict.name;
                }
                vc.emit($props.emitChooseDict,'chooseDict',_dict);
                vc.emit($props.emitLoadData,'listDictData',{
                    dictId:_dict.dictId
                });
                $('#chooseDictModel').modal('hide');
            },
            queryDicts:function(){
                vc.component._loadAllDictInfo(1,10,vc.component.chooseDictInfo._currentDictName);
            },
            _refreshChooseDictInfo:function(){
                vc.component.chooseDictInfo._currentDictName = "";
            }
        }

    });
})(window.vc);
