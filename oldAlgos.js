import JsonUrl from "json-url";
import {
  gearDict,
  professionDict,
  specializationDict,
  weaponTypeDict,
  runesDict,
  sigilDict,
  enhancementDict,
  nourishmentDict,
} from "./dicts.js";
import { compress } from "./valueList.js";
const lib = JsonUrl("lzma");

const bigObject = {
  character: {
    attributes: {
      Power: 3741,
      Precision: 2365,
      Toughness: 1243,
      Vitality: 1000,
      Ferocity: 1556,
      "Condition Damage": 750,
      Expertise: 0,
      Concentration: 243,
      "Healing Power": 0,
      "Agony Resistance": 162,
      "Condition Duration": 0,
      "Boon Duration": 0.162,
      "Critical Chance": 1,
      "Critical Damage": 2.5373333333333337,
    },
    gear: [
      "Berserker",
      "Assassin",
      "Berserker",
      "Assassin",
      "Berserker",
      "Berserker",
      "Berserker",
      "Berserker",
      "Berserker",
      "Berserker",
      "Berserker",
      "Berserker",
      "Assassin",
      "Berserker",
    ],
    settings: {
      profession: "Guardian",
      specialization: "Dragonhunter",
      weaponType: "Dual wield",
      cachedFormState: {
        extras: {
          Runes: "scholar",
          Sigil1: "force",
          Sigil2: "impact/night/slaying-both",
          Enhancement: "slaying-potion",
          Nourishment: "sweet-and-spicy-butternut-squash-soup",
        },
      },
    },
  },
  weapons: {
    mainhand1: 30692,
    offhand1: 30696,
    mainhand2: 30689,
    offhand2: "",
  },
  skills: {
    healId: 9158,
    utility1Id: 9251,
    utility2Id: 9084,
    utility3Id: 9151,
    eliteId: 30273,
  },
  traits: {
    lines: [16, 42, 27],
    selected: [
      [574, 565, 579],
      [634, 653, 2017],
      [1898, 1835, 1955],
    ],
  },
};

const schema = {
  character: {
    attributes: null,
    gear: (gear) => gear.map((g) => gearDict.indexOf(g)),
    settings: {
      profession: (profession) => professionDict.indexOf(profession),
      specialization: (specialization) =>
        specializationDict.indexOf(specialization),
      weaponType: (weaponType) => weaponTypeDict.indexOf(weaponType),
      cachedFormState: {
        extras: {
          Runes: (rune) => runesDict.indexOf(rune),
          Sigil1: (sigil) => sigilDict.indexOf(sigil),
          Sigil2: (sigil) => sigilDict.indexOf(sigil),
          Enhancement: (enhancement) => enhancementDict.indexOf(enhancement),
          Nourishment: (nourishment) => nourishmentDict.indexOf(nourishment),
        },
      },
    },
  },
  weapons: {
    mainhand1: null,
    offhand1: null,
    mainhand2: null,
    offhand2: null,
  },
  skills: {
    healId: null,
    utility1Id: null,
    utility2Id: null,
    utility3Id: null,
    eliteId: null,
  },
  traits: {
    lines: null,
    selected: null,
  },
};

const keyDict = {
  character: 99999, // cant be zero
  attributes: 1,
  Power: 2,
  Precision: 3,
  Toughness: 4,
  Vitality: 5,
  Ferocity: 6,
  "Condition Damage": 7,
  Expertise: 8,
  Concentration: 9,
  "Healing Power": 10,
  "Agony Resistance": 11,
  "Condition Duration": 12,
  "Boon Duration": 13,
  "Critical Chance": 14,
  "Critical Damage": 15,
  gear: 16,
  settings: 17,
  profession: 18,
  specialization: 19,
  weaponType: 20,
  cachedFormState: 21,
  extras: 22,
  Runes: 23,
  Sigil1: 24,
  Enhancement: 25,
  Nourishment: 26,
  weapons: 27,
  mainhand1: 28,
  offhand1: 29,
  mainhand2: 30,
  offhand2: 31,
  skills: 32,
  healId: 33,
  utility1Id: 34,
  utility2Id: 35,
  utility3Id: 36,
  eliteId: 37,
  traits: 38,
  lines: 39,
  selected: 40,
};

const DATA = bigObject;

function compressLZMA(obj, callback) {
  console.time("Compressed data with LZMA in");
  lib.compress(obj).then((result) => callback(result));
  console.timeEnd("Compressed data with LZMA in");
}

/**
 * Compress an object using a mapping for all string values provided by the schema variable.
 *
 * @param {Object} obj object that shall be compressed
 * @param {Function} callback called with result after the calculations are done
 */
function compressLZMAValueReplacements(obj, callback) {
  console.time("Compressed data with Value-Dict + LZMA in");

  const transform = (source, schema) => {
    if (typeof schema !== "object" && typeof schema !== "function")
      return source;
    const result = {};
    Object.entries(source).forEach(([key, value]) => {
      if (typeof schema[key] === "function") {
        result[key] = key in schema ? schema[key](source[key]) : source[key];
      } else {
        result[key] = transform(source[key], schema[key]);
      }
    });
    return result;
  };
  const newObj2 = transform(obj, schema);

  lib.compress(newObj2).then((result) => callback(result));
  console.timeEnd("Compressed data with Value-Dict + LZMA in");
}

/**
 * Compress an object using a mapping for all string values provided by the schema variable.
 *
 * Also encodes all keys with a numeric value.
 * @param {Object} obj object that shall be compressed
 * @param {Function} callback called with result after the calculations are done
 */
function compressLZMAKeyValueReplacements(obj, callback) {
  console.time("Compressed data with Value-Dict + LZMA in");

  const transform = (source, schema) => {
    if (typeof schema !== "object" && typeof schema !== "function") {
      // reached a leaf
      //console.log(source);
      const result = {};
      Object.entries(source).forEach(([key]) => {
        result[keyDict[key] || key] = source[key];
      });
      return result;
    }
    const result = {};
    Object.entries(source).forEach(([key, value]) => {
      //console.log("curr key: " + key);
      if (typeof schema[key] === "function") {
        result[keyDict[key] || key] =
          key in schema ? schema[key](source[key]) : source[key];
      } else {
        result[keyDict[key] || key] = transform(source[key], schema[key]);
      }
    });
    return result;
  };
  const newObj2 = transform(obj, schema);
  lib.compress(newObj2).then((result) => callback(result));
  //const result = my_lzma.compress(JSON.stringify(newObj2), 9);
  //callback(result);
  console.timeEnd("Compressed data with Value-Dict + LZMA in");
}

const callbackCompress = (algoName) => (result) => {
  const encodedLength = new TextEncoder().encode(result).length;
  const baseLength = new TextEncoder().encode(JSON.stringify(DATA)).length;
  console.log(result);
  console.log(`Base (uncompressed) byte count: ${baseLength}`);
  console.log(
    `${algoName} byte count: ${encodedLength} (${Math.round(
      (encodedLength / baseLength) * 100
    )} % of base)`
  );
};

const callbackDecompress = (algoName) => (result) => {
  //console.log(result);
};

//compressLZMA(DATA, callback("json-url"));
//compressLZMAValueReplacements(DATA, callback("Value dict + LZMA"));
//compressLZMAKeyValueReplacements(DATA, callback("Key-Value dict + LZMA"));
compress(DATA, schema, callbackCompress("Values-list"));
/*
decompressLZMAValuesList(
  "XQAAAAKCAAAAAAAAAABuAAAqagHaAieiLB1bBS2p4chozVDJYKU5mYczo5pau2ex2gAyO83d37P98GmhmQgq5gTz7SceK1a5RxRsdj1ZrM2Zmta36GMyhrJhy2EzadULxLNltPzTHmWZ5mNmcUmZBT0OuqI6rq9cqf7lybOyRxD-9ucAAA",
  callbackDecompress("Values-list")
);
*/
