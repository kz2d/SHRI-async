module.exports = function (Homework) {
    let promisify =
        (fn) =>
        (...args) =>
            new Promise((resolve, reject) => {
                fn(...args, (r) => {
                    resolve(r);
                });
            });

    const {
        AsyncArray,
        add,
        subtract,
        multiply,
        divide,
        less,
        equal,
        lessOrEqual,
    } = Homework;

    return (asyncArray, fn, initialValue, cb) => {
        let main = async () => {
            let res = initialValue;
            let newFn = promisify(fn);
            let newGet = promisify(asyncArray.get);
            let newLength = promisify(asyncArray.length);
            let newLess = promisify(less);
            try {
                let length = 0;
                length = await newLength();
                console.log('length=' + length);
                for (let i = 0; await newLess(i, length); i++) {
                    console.log(res);

                    res = await newFn(res, await newGet(i), i, asyncArray);
                }
            } catch (e) {
                console.log('error=' + e);
            }
            return res;
        };
        main().then(cb);
    };
};
