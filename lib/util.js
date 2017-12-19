/**
 * helper functions
 */

/**
 * check object is boolean
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
let isBoolean = obj => {
    return toString.call(obj) === '[object Boolean]';
};
/**
 * check object is number
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
let isNumber = obj => {
    return toString.call(obj) === '[object Number]';
};

/**
 * check object is object
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
let isObject = obj => {
    if (isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
};
/**
 * check object is string
 * @param  {Mixed}  obj []
 * @return {Boolean}     []
 */
let isString = obj => {
    return toString.call(obj) === '[object String]';
};


module.exports = {
    isBoolean,
    isNumber,
    isString,
    isObject,
};