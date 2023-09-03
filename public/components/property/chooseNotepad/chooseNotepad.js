(function(vc){
    vc.extends({
        propTypes: {
           emitChooseNotepad:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseNotepadInfo:{
                notepads:[],
                _currentNotepadName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseNotepad','openChooseNotepadModel',function(_param){
                $('#chooseNotepadModel').modal('show');
                vc.component._refreshChooseNotepadInfo();
                vc.component._loadAllNotepadInfo(1,10,'');
            });
        },
        methods:{
            _loadAllNotepadInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('notepad.listNotepads',
                             param,
                             function(json){
                                var _notepadInfo = JSON.parse(json);
                                vc.component.chooseNotepadInfo.notepads = _notepadInfo.notepads;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseNotepad:function(_notepad){
                if(_notepad.hasOwnProperty('name')){
                     _notepad.notepadName = _notepad.name;
                }
                vc.emit($props.emitChooseNotepad,'chooseNotepad',_notepad);
                vc.emit($props.emitLoadData,'listNotepadData',{
                    notepadId:_notepad.notepadId
                });
                $('#chooseNotepadModel').modal('hide');
            },
            queryNotepads:function(){
                vc.component._loadAllNotepadInfo(1,10,vc.component.chooseNotepadInfo._currentNotepadName);
            },
            _refreshChooseNotepadInfo:function(){
                vc.component.chooseNotepadInfo._currentNotepadName = "";
            }
        }

    });
})(window.vc);
