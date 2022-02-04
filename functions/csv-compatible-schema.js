export function setValueForKeyPath(value, keyPath, input) {
  let current = input;
  const keys = keyPath.split('.');
  for (let i = 0; i < keys.length - 1; i += 1) {
    const thisKey = keys[i];
    const nextKey = keys[i + 1];
    if (nextKey) {
      if (!isNaN(nextKey)) {
        if (Array.isArray(current)) {
          if (!Array.isArray(current[parseInt(thisKey, 10)])) {
            current[parseInt(thisKey, 10)] = [];
          }
        } else if (!Array.isArray(current[thisKey])) {
          current[thisKey] = [];
        }
      } else if (Array.isArray(current)) {
        if (!(current[parseInt(thisKey, 10)] !== null &&
          typeof current[parseInt(thisKey, 10)] === 'object')) {
          current[parseInt(thisKey, 10)] = {};
        }
      } else if (!(current[thisKey] !== null &&
        typeof current[thisKey] === 'object')) {
        current[thisKey] = {};
      }
    }
    if (Array.isArray(current)) {
      current = current[parseInt(thisKey, 10)];
    } else {
      current = current[thisKey];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (Array.isArray(current)) {
    current[parseInt(lastKey, 10)] = value;
  } else if (current !== null && typeof current === 'object') {
    current[lastKey] = value;
  }
}

const parseProperties = (target, options, _stack, parent) => {
  const stack = _stack || [];
  const { type } = target;
  if (type === "object") {
    const { properties } = target;
    if (properties) {
      const keys = Object.keys(properties);
      if (keys.length > 0) {
        for (const el of keys) {
          const val = properties[el];
          parseProperties(val, options, stack, parent ? `${parent}.${el}` : el);
        }
      }
    }
  } else {
    const kp = parent;
    const flat = kp.split(".").map((p, i) => i === 0 ? p : `${p[0].toUpperCase()}${p.slice(1)}`).join("");
    stack.push({ keyPath: kp, flat });
  }
  return stack;
};

const flattenableSchema = (targetVal) => {
  try {
    if (targetVal.lint && targetVal.lint.csv) {
      const pairs = parseProperties(targetVal);
      const objToFlat = {};
      const flatToObj = {};
      for (const p of pairs) {
        setValueForKeyPath(p.flat, p.keyPath, objToFlat);
        flatToObj[p.flat] = p.keyPath;
      }
      console.log(objToFlat);
      console.log(flatToObj);
    } else if (targetVal.properties) {
      for (const k of Object.keys(targetVal.properties)) {
        flattenableSchema(targetVal.properties[k]);
      }
    }
  }
  catch (e) {
    return [e];
  }
}

export default flattenableSchema;