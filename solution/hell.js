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

  return (asyncArray, fn, initialValue, cb) => {
    let res = initialValue;
    let counter = 0;

    asyncArray.length((length) => {
      let rFn = (some) => {
        res = some;
        add(counter, 1, (r) => {
          counter = r;
          equal(counter, length, (r) => {
            if (counter == length) {
              cb(res);
            } else {
              asyncArray.get(counter, (val) => {
                fn(res, val, counter, asyncArray, rFn);
              });
            }
          });
        });
      };
      asyncArray.get(counter, (val) => {
        fn(res, val, counter, asyncArray, rFn);
      });
    });
  };
};
