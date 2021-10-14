((global) => {
  const _wrap = (fn, cb) => {
    setTimeout(() => {
      cb(fn());
    }, Math.random() * 20);
  };

  const AsyncArray = function (initial) {
    if (initial && !(initial instanceof Array)) {
      throw new Error("initial value is not an array");
    }

    const a = initial ? Array.from(initial) : [];

    this.set = (index, value, cb) =>
      _wrap(() => {
        a[index] = value;
      }, cb);
    this.push = (value, cb) =>
      _wrap(() => {
        a.push(value);
      }, cb);

    this.get = (index, cb) => _wrap(() => a[index], cb);
    this.pop = (cb) => _wrap(() => a.pop(), cb);
    this.length = (cb) => _wrap(() => a.length, cb);

    this.print = () => {
      console.log(a.toString());
    };
  };

  const add = (a, b, cb) => _wrap(() => a + b, cb);
  const subtract = (a, b, cb) => _wrap(() => a - b, cb);
  const multiply = (a, b, cb) => _wrap(() => a * b, cb);
  const divide = (a, b, cb) => _wrap(() => a / b, cb);

  const less = (a, b, cb) => _wrap(() => a < b, cb);
  const equal = (a, b, cb) => _wrap(() => a == b, cb);
  const lessOrEqual = (a, b, cb) => _wrap(() => a <= b, cb);

  global.Homework = {
    AsyncArray,
    add,
    subtract,
    multiply,
    divide,
    less,
    equal,
    lessOrEqual,
  };

  Object.freeze(global.Homework);
})(typeof window === "undefined" ? global : window);

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

const a = new AsyncArray([1, 2, 3]);

const asyncArray = new Homework.AsyncArray([1, 2, 3, 4]);
const reducerSum = (acc, curr, i, src, cb) => Homework.add(acc, curr, cb);

reduce(asyncArray, reducerSum, 0, (res) => {
  console.log(res); // 10
});

function reduce(asyncArray, fn, initialValue, cb) {
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

  let main = async () => {
    try {
      let length = 0;
      length = await newLength();
      // console.log("length=" + length);
      for (let i = 0; await newLess(i, length); i = await newAdd(i, 1)) {
        // console.log(i);

        res = await newFn(res, await newGet(i), i, asyncArray);
      }
    } catch (e) {
      // console.log("error=" + e);
    }
    return res;
  };
  main().then(cb);
}
