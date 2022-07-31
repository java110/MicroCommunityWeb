(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMenuUser:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMenuUserInfo:{
                menuUsers:[],
                _currentMenuUserName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMenuUser','openChooseMenuUserModel',function(_param){
                $('#chooseMenuUserModel').modal('show');
                vc.component._refreshChooseMenuUserInfo();
                vc.component._loadAllMenuUserInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMenuUserInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('menuUser.listMenuUsers',
                             param,
                             function(json){
                                var _menuUserInfo = JSON.parse(json);
                                vc.component.chooseMenuUserInfo.menuUsers = _menuUserInfo.menuUsers;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMenuUser:function(_menuUser){
                if(_menuUser.hasOwnProperty('name')){
                     _menuUser.menuUserName = _menuUser.name;
                }
                vc.emit($props.emitChooseMenuUser,'chooseMenuUser',_menuUser);
                vc.emit($props.emitLoadData,'listMenuUserData',{
                    menuUserId:_menuUser.menuUserId
                });
                $('#chooseMenuUserModel').modal('hide');
            },
            queryMenuUsers:function(){
                vc.component._loadAllMenuUserInfo(1,10,vc.component.chooseMenuUserInfo._currentMenuUserName);
            },
            _refreshChooseMenuUserInfo:function(){
                vc.component.chooseMenuUserInfo._currentMenuUserName = "";
            }
        }

    });
})(window.vc);
