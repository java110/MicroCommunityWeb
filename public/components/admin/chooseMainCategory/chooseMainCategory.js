(function(vc){
    vc.extends({
        propTypes: {
           emitChooseMainCategory:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseMainCategoryInfo:{
                mainCategorys:[],
                _currentMainCategoryName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseMainCategory','openChooseMainCategoryModel',function(_param){
                $('#chooseMainCategoryModel').modal('show');
                vc.component._refreshChooseMainCategoryInfo();
                vc.component._loadAllMainCategoryInfo(1,10,'');
            });
        },
        methods:{
            _loadAllMainCategoryInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('mainCategory.listMainCategorys',
                             param,
                             function(json){
                                var _mainCategoryInfo = JSON.parse(json);
                                vc.component.chooseMainCategoryInfo.mainCategorys = _mainCategoryInfo.mainCategorys;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseMainCategory:function(_mainCategory){
                if(_mainCategory.hasOwnProperty('name')){
                     _mainCategory.mainCategoryName = _mainCategory.name;
                }
                vc.emit($props.emitChooseMainCategory,'chooseMainCategory',_mainCategory);
                vc.emit($props.emitLoadData,'listMainCategoryData',{
                    mainCategoryId:_mainCategory.mainCategoryId
                });
                $('#chooseMainCategoryModel').modal('hide');
            },
            queryMainCategorys:function(){
                vc.component._loadAllMainCategoryInfo(1,10,vc.component.chooseMainCategoryInfo._currentMainCategoryName);
            },
            _refreshChooseMainCategoryInfo:function(){
                vc.component.chooseMainCategoryInfo._currentMainCategoryName = "";
            }
        }

    });
})(window.vc);
