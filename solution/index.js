module.exports = function (Homework) {
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

  let promisify =
    (fn) =>
    (...args) =>
      new Promise((resolve, reject) => {
        fn(...args, (r) => {
          resolve(r);
        });
      });

  let res = initialValue;
  const newFn = promisify(fn);
  const newGet = promisify(asyncArray.get);
  const newLength = promisify(asyncArray.length);
  const newLess = promisify(less);
  const newAdd = promisify(add);

  return (asyncArray, fn, initialValue, cb) => {
    let main = async () => {
      let length = 0;
      length = await newLength();
      for (let i = 0; await newLess(i, length); i = await newAdd(i, 1)) {
        res = await newFn(res, await newGet(i), i, asyncArray);
      }
      return res;
    };
    main().then(cb);
  };
};
