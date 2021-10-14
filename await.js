const { promisify } = require('util');
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
  let main = async () => {
    let res = initialValue;
    let newFn = promisify(fn);
    let newGet = promisify(asyncArray.get);
    let newLength = promisify(asyncArray.length);
    let newLess = promisify(less);
    try {
      let length = 0;
      length = await newLength();
      console.log("length=" + length);
      for (let i = 0; await newLess(i, length); i++) {
        console.log(res);

        res = await newFn(res, await newGet(i), i, asyncArray);
      }
    } catch (e) {
      console.log("error=" + e);
    }
    return res;
  };
  main().then(cb);
}
