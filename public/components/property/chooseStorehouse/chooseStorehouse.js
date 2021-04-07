(function(vc){
    vc.extends({
        propTypes: {
           emitChooseStorehouse:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseStorehouseInfo:{
                storehouses:[],
                _currentStorehouseName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseStorehouse','openChooseStorehouseModel',function(_param){
                $('#chooseStorehouseModel').modal('show');
                vc.component._refreshChooseStorehouseInfo();
                vc.component._loadAllStorehouseInfo(1,10,'');
            });
        },
        methods:{
            _loadAllStorehouseInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('storehouse.listStorehouses',
                             param,
                             function(json){
                                var _storehouseInfo = JSON.parse(json);
                                vc.component.chooseStorehouseInfo.storehouses = _storehouseInfo.storehouses;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseStorehouse:function(_storehouse){
                if(_storehouse.hasOwnProperty('name')){
                     _storehouse.storehouseName = _storehouse.name;
                }
                vc.emit($props.emitChooseStorehouse,'chooseStorehouse',_storehouse);
                vc.emit($props.emitLoadData,'listStorehouseData',{
                    storehouseId:_storehouse.storehouseId
                });
                $('#chooseStorehouseModel').modal('hide');
            },
            queryStorehouses:function(){
                vc.component._loadAllStorehouseInfo(1,10,vc.component.chooseStorehouseInfo._currentStorehouseName);
            },
            _refreshChooseStorehouseInfo:function(){
                vc.component.chooseStorehouseInfo._currentStorehouseName = "";
            }
        }

    });
})(window.vc);
