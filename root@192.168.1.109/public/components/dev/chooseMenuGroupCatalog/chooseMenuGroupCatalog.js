(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMenuGroupCatalog:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMenuGroupCatalogInfo:{
                menuGroupCatalogs:[],
                _currentMenuGroupCatalogName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMenuGroupCatalog','openChooseMenuGroupCatalogModel',function(_param){
                $('#chooseMenuGroupCatalogModel').modal('show');
                vc.component._refreshChooseMenuGroupCatalogInfo();
                vc.component._loadAllMenuGroupCatalogInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMenuGroupCatalogInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('menuGroupCatalog.listMenuGroupCatalogs',
                             param,
                             function(json){
                                var _menuGroupCatalogInfo = JSON.parse(json);
                                vc.component.chooseMenuGroupCatalogInfo.menuGroupCatalogs = _menuGroupCatalogInfo.menuGroupCatalogs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMenuGroupCatalog:function(_menuGroupCatalog){
                if(_menuGroupCatalog.hasOwnProperty('name')){
                     _menuGroupCatalog.menuGroupCatalogName = _menuGroupCatalog.name;
                }
                vc.emit($props.emitChooseMenuGroupCatalog,'chooseMenuGroupCatalog',_menuGroupCatalog);
                vc.emit($props.emitLoadData,'listMenuGroupCatalogData',{
                    menuGroupCatalogId:_menuGroupCatalog.menuGroupCatalogId
                });
                $('#chooseMenuGroupCatalogModel').modal('hide');
            },
            queryMenuGroupCatalogs:function(){
                vc.component._loadAllMenuGroupCatalogInfo(1,10,vc.component.chooseMenuGroupCatalogInfo._currentMenuGroupCatalogName);
            },
            _refreshChooseMenuGroupCatalogInfo:function(){
                vc.component.chooseMenuGroupCatalogInfo._currentMenuGroupCatalogName = "";
            }
        }

    });
})(window.vc);
