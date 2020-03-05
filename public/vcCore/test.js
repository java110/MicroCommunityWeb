aa = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            console.log('测试');
            resolve(345);
        }, 2000);
    });
};

cc = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            console.log('测试cc');
            resolve(123);
        }, 2000);
    });
};

bb = async function  () {
    console.log('exc1 start:', Date.now());

    // let res1 = await aa();

    // let res2 = await cc();

    let [rest1,rest2] = await Promise.all([aa(),cc()]);
    console.log('rest1_ddd',rest2);
    console.log('exc1 end:', Date.now());

    return 123;

};

dd = async function(){
    console.log('dd start:', Date.now());
    let _bb = await bb();
    console.log('dd end',_bb);
}

ee = async function(i){
    if(i > 5){
        return i;
    }

    console.log('ee',i);

    hh();
}

hh = async function(){
    return ee()+1;
}

ff = async function(){
    for(let index = 0; index < 10;index ++){
        let b = ee(index);
        console.log('b',b);
    }
}

ff();


