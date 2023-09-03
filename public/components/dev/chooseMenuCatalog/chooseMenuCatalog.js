(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMenuCatalog:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMenuCatalogInfo:{
                menuCatalogs:[],
                _currentMenuCatalogName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMenuCatalog','openChooseMenuCatalogModel',function(_param){
                $('#chooseMenuCatalogModel').modal('show');
                vc.component._refreshChooseMenuCatalogInfo();
                vc.component._loadAllMenuCatalogInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMenuCatalogInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('menuCatalog.listMenuCatalogs',
                             param,
                             function(json){
                                var _menuCatalogInfo = JSON.parse(json);
                                vc.component.chooseMenuCatalogInfo.menuCatalogs = _menuCatalogInfo.menuCatalogs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMenuCatalog:function(_menuCatalog){
                if(_menuCatalog.hasOwnProperty('name')){
                     _menuCatalog.menuCatalogName = _menuCatalog.name;
                }
                vc.emit($props.emitChooseMenuCatalog,'chooseMenuCatalog',_menuCatalog);
                vc.emit($props.emitLoadData,'listMenuCatalogData',{
                    menuCatalogId:_menuCatalog.menuCatalogId
                });
                $('#chooseMenuCatalogModel').modal('hide');
            },
            queryMenuCatalogs:function(){
                vc.component._loadAllMenuCatalogInfo(1,10,vc.component.chooseMenuCatalogInfo._currentMenuCatalogName);
            },
            _refreshChooseMenuCatalogInfo:function(){
                vc.component.chooseMenuCatalogInfo._currentMenuCatalogName = "";
            }
        }

    });
})(window.vc);
