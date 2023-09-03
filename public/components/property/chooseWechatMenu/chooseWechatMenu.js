(function(vc){
    vc.extends({
        propTypes: {
           emitChooseWechatMenu:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseWechatMenuInfo:{
                wechatMenus:[],
                _currentWechatMenuName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseWechatMenu','openChooseWechatMenuModel',function(_param){
                $('#chooseWechatMenuModel').modal('show');
                vc.component._refreshChooseWechatMenuInfo();
                vc.component._loadAllWechatMenuInfo(1,10,'');
            });
        },
        methods:{
            _loadAllWechatMenuInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('wechatMenu.listWechatMenus',
                             param,
                             function(json){
                                var _wechatMenuInfo = JSON.parse(json);
                                vc.component.chooseWechatMenuInfo.wechatMenus = _wechatMenuInfo.wechatMenus;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseWechatMenu:function(_wechatMenu){
                if(_wechatMenu.hasOwnProperty('name')){
                     _wechatMenu.wechatMenuName = _wechatMenu.name;
                }
                vc.emit($props.emitChooseWechatMenu,'chooseWechatMenu',_wechatMenu);
                vc.emit($props.emitLoadData,'listWechatMenuData',{
                    wechatMenuId:_wechatMenu.wechatMenuId
                });
                $('#chooseWechatMenuModel').modal('hide');
            },
            queryWechatMenus:function(){
                vc.component._loadAllWechatMenuInfo(1,10,vc.component.chooseWechatMenuInfo._currentWechatMenuName);
            },
            _refreshChooseWechatMenuInfo:function(){
                vc.component.chooseWechatMenuInfo._currentWechatMenuName = "";
            }
        }

    });
})(window.vc);
