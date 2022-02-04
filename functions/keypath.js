const getKeyPaths = (obj, options, _stack, parent) => {
  const stack = _stack || [];
  const keys = Object.keys(obj);
  if (keys.length > 0) {
    for (const el of keys) {
      const val = obj[el];
      if (Array.isArray(val)) {
        if (options.diffArrays) {
          if (options.allLevels) {
            stack.push(parent ? `${parent}.${el}` : el);
          }
          for (let i = 0; i < val.length; i += 1) {
            const p = parent ? `${parent}.${el}.${i}` : `${el}.${i}`;
            const s = val[i];
            if (Array.isArray(s) || (s !== null && typeof s === "object")) {
              if (options.allLevels) {
                stack.push(p);
              }
              keyPaths(s, options, stack, p);
            } else {
              stack.push(p);
            }
          }
        } else {
          stack.push(parent ? `${parent}.${el}` : el);
        }
      } else if (val instanceof Date) {
        const key = parent ? `${parent}.${el}` : el;
        stack.push(key);
      } else if (val !== null && typeof val === "object") {
        if (val instanceof Buffer || val instanceof RegExp) {
          stack.push(parent ? `${parent}.${el}` : el);
        } else {
          if (options.allLevels) {
            stack.push(parent ? `${parent}.${el}` : el);
          }
          keyPaths(val, options, stack, parent ? `${parent}.${el}` : el);
        }
      } else {
        stack.push(parent ? `${parent}.${el}` : el);
      }
    }
  } else {
    stack.push(parent ? `${parent}` : "");
  }

  return stack;
};

module.exports = {
  getKeyPaths,
};
