import assert from "assert";
import {
  enhancementDict,
  gearDict,
  nourishmentDict,
  professionDict,
  runesDict,
  sigilDict,
  specializationDict,
  weaponTypeDict,
} from "./dicts.mjs";
import { compress, decompress } from "../lib/index.js";

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
    attributes: {
      Power: null,
      Precision: null,
      Toughness: null,
      Vitality: null,
      Ferocity: null,
      "Condition Damage": null,
      Expertise: null,
      Concentration: null,
      "Healing Power": null,
      "Agony Resistance": null,
      "Condition Duration": null,
      "Boon Duration": null,
      "Critical Chance": null,
      "Critical Damage": null,
    },
    gear: { type: "array", dict: gearDict },
    settings: {
      profession: { type: "value", dict: professionDict },
      specialization: { type: "value", dict: specializationDict },
      weaponType: { type: "value", dict: weaponTypeDict },
      cachedFormState: {
        extras: {
          Runes: { type: "value", dict: runesDict },
          Sigil1: { type: "value", dict: sigilDict },
          Sigil2: { type: "value", dict: sigilDict },
          Enhancement: { type: "value", dict: enhancementDict },
          Nourishment: { type: "value", dict: nourishmentDict },
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

const compressed =
  "XQAAAAKCAAAAAAAAAABuAAAntmhi13COU1mBLI8OVbL9XgBlUJoxEi1NsGtYapeu3yNvlOY5biF8GGP7-BT5xwf_Sf9mRpKyOkoTkuRRj7EW4pH4bIxYYW5MaRbJ4ww3SqUWCY64JXyG2KgSHt-2ac0b5AdEeKh-gwSi1Krj2Ehhm08W8__fmcAA";

describe("valuesList-algo", function () {
  describe("#compress()", function () {
    it("object should be compressed to the matching base64 string", function (done) {
      compress({
        object: bigObject,
        schema,
        onSuccess: (result) => {
          assert.strictEqual(result, compressed);
          done();
        },
      });
    });
  });

  describe("#decompress()", function () {
    it("base64 string should be decompressed to the original object", function (done) {
      decompress({
        string: compressed,
        schema,
        onSuccess: (result) => {
          assert.deepEqual(result, bigObject);
          done();
        },
      });
    });
  });

  describe("compress and decompress joint", function () {
    const object = bigObject;

    it("compress an object and decompress the base64 string again", function (done) {
      compress({
        object,
        schema,
        onSuccess: (result) => {
          decompress({
            string: result,
            schema,
            onSuccess: (result) => {
              assert.deepEqual(result, object);
              done();
            },
          });
        },
      });
    });
  });

  describe("compress+decompress with ignore", function () {
    it("object should be compressed to the matching base64 string", function (done) {
      const toCompress = { ...bigObject, z: { lalala: 23.5, abc: 1 } };
      const newSchema = { ...schema, z: { type: "ignore" } };
      const expectedCompressed =
        "XQAAAAKaAAAAAAAAAABuAABIGFeW-Lvn6CuNjJfAB1AOzC2_qwyi2dm0o4wNs7-f6bdEGaDfa8vRmXMsUGsK2eYpRTp7bdwqTnUbYCXvsW06isJJzcezPjViO_Jgqr0_vMQ4DGd84ZzwkRAsq_LwL3oz6_OljC7LQOyOPiRznMyiFWRY2LJ7FxHAjcaDD26kcFxRQ_cjNwWfduCI_9taUAA";

      compress({
        object: toCompress,
        schema: newSchema,
        onSuccess: (result) => {
          assert.strictEqual(result, expectedCompressed);
          decompress({
            string: result,
            schema: newSchema,
            onSuccess: (result) => {
              assert.deepEqual(result, toCompress);
              done();
            },
          });
        },
      });
    });
  });
});
