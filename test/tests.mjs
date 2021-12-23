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
  "XQAAAAKCAAAAAAAAAABuAAAqagHaAieiLB1bBS2p4chozVDJYKU5mYczo5pau2ex2gAyO83d37P98GmhmQgq5gTz7SceKzWVX57Vaa6kdHK-0ok2OiKuDXRF3lRsx1cNJF1__2SvbXvAaNfKN9nOXvd3Ws15i66GhMKvRjZa6M57iM1eWPrljwA";

describe("valuesList-algo", function () {
  describe("#compress()", function () {
    it("object should be compressed to the matching base64 string", function (done) {
      compress({
        object: bigObject,
        schema,
        onSuccess: (result) => {
          assert(result, compressed);
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
          assert(JSON.stringify(result), JSON.stringify(bigObject));
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
              assert(JSON.stringify(result), JSON.stringify(object));
              done();
            },
          });
        },
      });
    });
  });
});
