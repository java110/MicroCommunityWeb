(function (vc) {

    vc.extends({
        data: {
            selectStaffInfo: {
                flowId: '',
                flowName: '',
                describle: '',
                steps: []
            }
        },
        _initMethod: function () {
            $that._initSelectStaffInfo();
        },
        _initEvent: function () {

        },
        methods: {
            _initSelectStaffInfo: function () {
                $('.dropdown li a').click(function(){
                    console.log(this);	
                    title = $(this).attr("data-title");
                    id = $(this).attr("data-index");
                    $("#select-title").text(title);
                    $("#category_id").val(id);
                });
            },
            
        }
    });

})(window.vc);