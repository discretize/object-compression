const lib = require("json-url")("lzma");

const compress = ({ object, schema, onSuccess }) => {
  const transform = (source, _schema) => {
    // In case the schema is undefined execute this part
    if (!_schema || typeof _schema !== "object") {
      // Different type of leafs:
      // 1. Array, return the array in an array due to spreading in the function call of transform
      // 2. objects, we are only interested in the values, keys are discarded. Every value counts as one leaf
      // 3. rest, return it as wrapped array.
      if (Array.isArray(source)) {
        return [source];
      } else if (typeof source === "object") {
        return Object.values(source);
      } else return [source];
    }

    // collect the result, which is an array of all leafs in this part of the tree
    let result = [];
    Object.entries(source).forEach(([key, value]) => {
      if (
        _schema[key] &&
        typeof _schema[key] === "object" &&
        _schema[key].hasOwnProperty("dict")
      ) {
        const { type, dict } = _schema[key];
        result = [
          ...result,
          // only apply transformation function if it exists, else keep source value
          type === "array"
            ? Object.values(source[key]).map((val) => dict.indexOf(val))
            : dict.indexOf(source[key]),
        ];
      } else {
        // in case there is no transformation function, dig deeper
        result = [...result, ...transform(source[key], _schema[key])];
      }
    });
    return result;
  };
  const transformed = transform(object, schema);
  lib.compress(transformed).then((result) => onSuccess(result));
};

const decompress = ({ string, schema, onSuccess }) => {
  lib.decompress(string).then((valueList) => {
    let i = 0;
    const transform = (skeleton, values) => {
      if (skeleton && skeleton.hasOwnProperty("dict")) {
        // reached a leaf, determine possible dict reversal
        if (skeleton.type === "array") {
          return values[i++].map((val) => skeleton.dict[val]);
        } else if (skeleton.type === "value") {
          return skeleton.dict[values[i++]];
        }

        return skeleton;
      }
      // assemble object for this subtree
      const result = {};
      Object.entries(skeleton).forEach(([key, value]) => {
        if (!skeleton[key]) {
          result[key] = values[i++];
        } else {
          result[key] = transform(skeleton[key], values);
        }
      });
      return result;
    };

    const originalObj = transform(schema, valueList);
    return onSuccess(originalObj);
  });
};

export { compress, decompress };
