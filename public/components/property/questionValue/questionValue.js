(function(vc){
    vc.extends({
        data:{
            questionValueInfo:{
                values:[],
                titleId:'',
                objType:'',
                objId:''
            }
        },
        _initMethod:function(){

        },
        _initEvent:function(){
            vc.on('questionValue','openQuestionValueModel',function(_param){
                $that.questionValueInfo.titleId = _param.titleId;
                $that.questionValueInfo.objType = _param.objType;
                $that.questionValueInfo.objId = _param.objId;
                $('#questionValueModel').modal('show');
                vc.component._loadAllValueInfo(1,10);
            });
            vc.on('questionValue','paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllValueInfo(_currentPage, 15,vc.component.questionValueInfo._currentRoomNum);
            });
        },
        methods:{
            _loadAllValueInfo:function(_page,_row,_roomNum){

                var param = {
                    params:{
                        page:_page,
                        row:_row,

                    }
                };

                //发送get请求
               vc.http.get('questionValue',
                            'listRoom',
                             param,
                             function(json){
                                var _roomInfo = JSON.parse(json);
                                vc.component.questionValueInfo.values = _roomInfo.rooms;
                                vc.emit('questionValue','paginationPlus', 'init', {
                                    total: _roomInfo.records,
                                    currentPage: _page
                                });
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            questionValues:function(){
                vc.component._loadAllRoomInfo(1,15,vc.component.questionValueInfo._currentRoomNum);
            },
    
        }

    });
})(window.vc);