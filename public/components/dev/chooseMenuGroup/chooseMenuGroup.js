(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        propTypes: {
           emitChooseMenuGroup:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMenuGroupInfo:{
                menuGroups:[],
                _currentMenuGroupName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMenuGroup','openChooseMenuGroupModel',function(_param){
                $('#chooseMenuGroupModel').modal('show');
                vc.component._refreshChooseMenuGroupInfo();
                vc.component._loadAllMenuGroupInfo(DEFAULT_PAGE, DEFAULT_ROWS,'');
            });

            vc.on('chooseMenuGroup', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadAllMenuGroupInfo(_currentPage, DEFAULT_ROWS);
            });
        },
        methods:{
            _loadAllMenuGroupInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.get('chooseMenuGroup',
                            'list',
                             param,
                             function(json){
                                var _menuGroupInfo = JSON.parse(json);
                                 vc.component.chooseMenuGroupInfo.menuGroups = _menuGroupInfo.menuGroups;
                                 vc.emit('chooseMenuGroup', 'paginationPlus', 'init', {
                                     total: _menuGroupInfo.records,
                                     currentPage: _page
                                 });
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMenuGroup:function(_menuGroup){
                if(_menuGroup.hasOwnProperty('name')){
                     _menuGroup.menuGroupName = _menuGroup.name;
                }
                vc.emit($props.emitChooseMenuGroup,'chooseMenuGroup',_menuGroup);
                vc.emit($props.emitLoadData,'listMenuGroupData',{
                    menuGroupId:_menuGroup.menuGroupId
                });
                $('#chooseMenuGroupModel').modal('hide');
            },
            queryMenuGroups:function(){
                vc.component._loadAllMenuGroupInfo(DEFAULT_PAGE, DEFAULT_ROWS,vc.component.chooseMenuGroupInfo._currentMenuGroupName);
            },
            _refreshChooseMenuGroupInfo:function(){
                vc.component.chooseMenuGroupInfo._currentMenuGroupName = "";
            },
            _getChooseStoreTypeName: function (_storeTypeCd) {
                // <option value="800900000001">运营团队</option>
                // <option value="800900000002">代理商</option>
                // <option value="800900000003">物业</option>
                // <option value="800900000004">物流公司</option>
                // <option value="800900000005">商家</option>
                // <option value="800900000000">开发团队</option>

                if (_storeTypeCd == '800900000001') {
                    return "运营团队";
                } else if (_storeTypeCd == '800900000002') {
                    return "代理商";
                } else if (_storeTypeCd == '800900000003') {
                    return "物业";
                } else if (_storeTypeCd == '800900000004') {
                    return "物流公司";
                } else if (_storeTypeCd == '800900000005') {
                    return "商家";
                } else if (_storeTypeCd == '800900000000') {
                    return "开发团队";
                } else {
                    return "未知";
                }
            }
        }

    });
})(window.vc);
