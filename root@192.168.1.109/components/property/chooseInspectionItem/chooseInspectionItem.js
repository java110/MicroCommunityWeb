(function(vc){
    vc.extends({
        propTypes: {
           emitChooseInspectionItem:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseInspectionItemInfo:{
                inspectionItems:[],
                _currentInspectionItemName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseInspectionItem','openChooseInspectionItemModel',function(_param){
                $('#chooseInspectionItemModel').modal('show');
                vc.component._refreshChooseInspectionItemInfo();
                vc.component._loadAllInspectionItemInfo(1,10,'');
            });
        },
        methods:{
            _loadAllInspectionItemInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('inspectionItem.listInspectionItems',
                             param,
                             function(json){
                                var _inspectionItemInfo = JSON.parse(json);
                                vc.component.chooseInspectionItemInfo.inspectionItems = _inspectionItemInfo.inspectionItems;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseInspectionItem:function(_inspectionItem){
                if(_inspectionItem.hasOwnProperty('name')){
                     _inspectionItem.inspectionItemName = _inspectionItem.name;
                }
                vc.emit($props.emitChooseInspectionItem,'chooseInspectionItem',_inspectionItem);
                vc.emit($props.emitLoadData,'listInspectionItemData',{
                    inspectionItemId:_inspectionItem.inspectionItemId
                });
                $('#chooseInspectionItemModel').modal('hide');
            },
            queryInspectionItems:function(){
                vc.component._loadAllInspectionItemInfo(1,10,vc.component.chooseInspectionItemInfo._currentInspectionItemName);
            },
            _refreshChooseInspectionItemInfo:function(){
                vc.component.chooseInspectionItemInfo._currentInspectionItemName = "";
            }
        }

    });
})(window.vc);
