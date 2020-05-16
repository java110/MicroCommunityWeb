(function(vc){
    vc.extends({
        propTypes: {
           emitChooseSmallWeChat:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseSmallWeChatInfo:{
                smallWeChats:[],
                _currentSmallWeChatName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseSmallWeChat','openChooseSmallWeChatModel',function(_param){
                $('#chooseSmallWeChatModel').modal('show');
                vc.component._refreshChooseSmallWeChatInfo();
                vc.component._loadAllSmallWeChatInfo(1,10,'');
            });
        },
        methods:{
            _loadAllSmallWeChatInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('smallWeChat.listSmallWeChats',
                             param,
                             function(json){
                                var _smallWeChatInfo = JSON.parse(json);
                                vc.component.chooseSmallWeChatInfo.smallWeChats = _smallWeChatInfo.smallWeChats;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseSmallWeChat:function(_smallWeChat){
                if(_smallWeChat.hasOwnProperty('name')){
                     _smallWeChat.smallWeChatName = _smallWeChat.name;
                }
                vc.emit($props.emitChooseSmallWeChat,'chooseSmallWeChat',_smallWeChat);
                vc.emit($props.emitLoadData,'listSmallWeChatData',{
                    smallWeChatId:_smallWeChat.smallWeChatId
                });
                $('#chooseSmallWeChatModel').modal('hide');
            },
            querySmallWeChats:function(){
                vc.component._loadAllSmallWeChatInfo(1,10,vc.component.chooseSmallWeChatInfo._currentSmallWeChatName);
            },
            _refreshChooseSmallWeChatInfo:function(){
                vc.component.chooseSmallWeChatInfo._currentSmallWeChatName = "";
            }
        }

    });
})(window.vc);
