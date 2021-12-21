import JsonUrl from "json-url";

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

  const schema = {
    character: {
      gear: (gear) =>
        gear.map((gearAffix) => {
          if (gearAffix === "Berserker") return 0;
          if (gearAffix === "Assassin") return 1;
        }),
      settings: {
        profession: (profession) => {
          if (profession === "Guardian") return 0;
        },
        specialization: (specialization) => {
          if (specialization === "Dragonhunter") return 0;
        },
        weaponType: (weaponType) => {
          if (weaponType === "Dual wield") return 0;
        },
        cachedFormState: {
          extras: {
            Runes: (rune) => {
              if (rune === "scholar") return 0;
            },
            Sigil1: (sigil) => {
              if (sigil === "force") return 0;
              if (sigil === "impact/night/slaying-both") return 1;
            },
            Sigil2: (sigil) => {
              if (sigil === "force") return 0;
              if (sigil === "impact/night/slaying-both") return 1;
            },
            Enhancement: (enhancement) => {
              if (enhancement === "slaying-potion") return 0;
            },
            Nourishment: (nourishment) => {
              if (nourishment === "sweet-and-spicy-butternut-squash-soup")
                return 0;
            },
          },
        },
      },
    },
  };

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

  const schema = {
    character: {
      gear: (gear) =>
        gear.map((gearAffix) => {
          if (gearAffix === "Berserker") return 0;
          if (gearAffix === "Assassin") return 1;
        }),
      settings: {
        profession: (profession) => {
          if (profession === "Guardian") return 0;
        },
        specialization: (specialization) => {
          if (specialization === "Dragonhunter") return 0;
        },
        weaponType: (weaponType) => {
          if (weaponType === "Dual wield") return 0;
        },
        cachedFormState: {
          extras: {
            Runes: (rune) => {
              if (rune === "scholar") return 0;
            },
            Sigil1: (sigil) => {
              if (sigil === "force") return 0;
              if (sigil === "impact/night/slaying-both") return 1;
            },
            Sigil2: (sigil) => {
              if (sigil === "force") return 0;
              if (sigil === "impact/night/slaying-both") return 1;
            },
            Enhancement: (enhancement) => {
              if (enhancement === "slaying-potion") return 0;
            },
            Nourishment: (nourishment) => {
              if (nourishment === "sweet-and-spicy-butternut-squash-soup")
                return 0;
            },
          },
        },
      },
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
  console.timeEnd("Compressed data with Value-Dict + LZMA in");
}

const callback = (algoName) => (result) => {
  const lzmaLength = new TextEncoder().encode(result).length;
  const baseLength = new TextEncoder().encode(JSON.stringify(DATA)).length;
  console.log(result);
  console.log(`Base (uncompressed) byte count: ${baseLength}`);
  console.log(
    `${algoName} byte count: ${lzmaLength} (${Math.round(
      (lzmaLength / baseLength) * 100
    )} % of base)`
  );
};

//compressLZMA(DATA, callback("json-url"));
//compressLZMAValueReplacements(DATA, callback("Value dict + LZMA"));
compressLZMAKeyValueReplacements(DATA, callback("Key-Value dict + LZMA"));
