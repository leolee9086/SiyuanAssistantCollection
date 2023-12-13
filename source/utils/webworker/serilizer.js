export function stringifyWithFunctions(obj) {
    const replacer = (key, value) => {
      if (typeof value === 'function') {
        return '$function'+ value.toString();
      } 
      return value;
    };
    return JSON.stringify(obj, replacer);
  }
export  function parseWithFunctions(str) {
    const reviver = (key, value) => {
      if (typeof value === 'string' && value.startsWith('$function')) {
        return new Function('return ' + value.replace("$function",''))();
      } 
      return value;
    };
    return JSON.parse(str, reviver);
}