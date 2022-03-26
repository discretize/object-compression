Traditional compression algorithms and methods work already rather well on objects, but can only do so much when the length of the compressed result matters. An example use case would be sharing state via a query parameter: With methods like messagepack and lzma it is possible to reduce the amount of required bytes for the encoded string significantly (~60% of the original stringified object). This library takes the compression even further (<20%) but comes with a few caveats.

## Installation

```
yarn add @discretize/object-compression
```

For example usage please check the file `test/tests.js`.

## How does it work?

The library assumes that the encoding and decoding ends both have certain kinds of information available.

### Schema

Most importantly, the schema of the encoded object. The schema consists out of the exact structure of the object except for any values.

```js
const schema = {
  intValue: null,
  stringValue: { type: "value", dict: stringDict },
  arrayValue: { type: "array", dict: otherValuesDict },
  ignoredValue: { type: "ignore" },
};
```

There are a number of types available for declaration for the schema values:

- null: dont apply any transformation to this key. May only be a primitive type, not an object
- Object with type "value": string value, the dict must contain all possible strings.
- Object with type "array": array value, the dict must contain all possible values for the elements of the array.
- Object with type "ignore": the entire object is ignored. It is stringified. On decompress an ignored object will get parsed again.

### Dicts

The dicts are essentially just a list of all values a key might assume.

```js
const stringDict = ["a", "b", "c"];
```

With the help of this scheme the library is able to remove all structural parts of an object and only store the values. The values are further transformed into something more efficient than strings.

### Putting components together...

When an object is compressed following steps take place:

1. Transform values with dicts: the index of the matching value in the dict is taken as codeword
2. Recursively collect all "leafs" (values that don't have a child) and add them to a list.
3. Apply json-url with lzma on the list, which will remove whatever redundancy is left. To make the result url-safe base64 is applied.

## Caveats

- **This only works when decoder end encoder both have the same schema and the same dicts with the same indices!**
- **Big caveat:** a list of large objects will not be efficiently compressed. Help by submitting a pull request.
- Objects must be more like lists than sets! Keys must occure in the same order; differently ordered objects will yield a different compressed value.

## Performance

The transformation and list collection do not impact performance and may be executed synchronously. The lzma compression runs on another thread and therefore requires a callback.
The example data in the unit test was able to compress the original object to 18% of the size of the stringified version!

## Outlook

A more specific version with a customized bit-encoding may be implemented for an additional saving of about 20% (on paper). This, however, comes with even more caveats. This approach must have dicts for all values since we will reduce the amount of encodeable symbols (alphabet) to 14 values, which will make it impossible to leave some values untransformed.

The idea is to only encode following values: 0-9 , . [ ]
This allows us to encode these 14 letters with 4 bit. In comparison: UTF-8 requires between 1-2 bytes depending on the character. While in theory this sounds really good, it is only a small improvement, probably due to lzma being fairly efficient at removing redundancy and messagepack storing values efficiently.
