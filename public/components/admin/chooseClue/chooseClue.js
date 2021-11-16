(function(vc){
    vc.extends({
        propTypes: {
           emitChooseClue:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseClueInfo:{
                clues:[],
                _currentClueName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseClue','openChooseClueModel',function(_param){
                $('#chooseClueModel').modal('show');
                vc.component._refreshChooseClueInfo();
                vc.component._loadAllClueInfo(1,10,'');
            });
        },
        methods:{
            _loadAllClueInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('/clue/queryClue',
                             param,
                             function(json){
                                var _clueInfo = JSON.parse(json);
                                vc.component.chooseClueInfo.clues = _clueInfo.clues;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseClue:function(_clue){
                if(_clue.hasOwnProperty('name')){
                     _clue.clueName = _clue.name;
                }
                vc.emit($props.emitChooseClue,'chooseClue',_clue);
                vc.emit($props.emitLoadData,'listClueData',{
                    clueId:_clue.clueId
                });
                $('#chooseClueModel').modal('hide');
            },
            queryClues:function(){
                vc.component._loadAllClueInfo(1,10,vc.component.chooseClueInfo._currentClueName);
            },
            _refreshChooseClueInfo:function(){
                vc.component.chooseClueInfo._currentClueName = "";
            }
        }

    });
})(window.vc);
