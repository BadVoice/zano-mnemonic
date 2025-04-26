"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mnemonicToSeed = exports.NUMWORDS = void 0;
const phrases_1 = require("../consts/phrases");
const crypto_1 = require("../lib/crypto");
exports.NUMWORDS = 1626;
const wordsMap = new Map(phrases_1.phrases.map(item => [item.phrase, item.value]));
const SEED_PHRASE_V1_WORDS_COUNT = 25;
const SEED_PHRASE_V2_WORDS_COUNT = 26;
const BINARY_SIZE_SEED = 32;
async function mnemonicToSeed(seedPhraseRaw) {
    const seedPhrase = seedPhraseRaw.trim();
    const words = seedPhrase.split(/\s+/);
    let keysSeedText;
    let timestampWord;
    if (words.length === SEED_PHRASE_V1_WORDS_COUNT) {
        timestampWord = words.pop();
        keysSeedText = words.join(' ');
    }
    else if (words.length === SEED_PHRASE_V2_WORDS_COUNT) {
        words.pop();
        timestampWord = words.pop();
        keysSeedText = words.join(' ');
    }
    else {
        console.error('Invalid seed phrase word count:', words.length);
        return false;
    }
    let keysSeedBinary;
    try {
        keysSeedBinary = text2binary(keysSeedText);
    }
    catch (error) {
        console.error('Failed to convert seed text to binary:', error);
        return false;
    }
    if (!keysSeedBinary.length) {
        console.error('Empty binary seed after conversion');
        return false;
    }
    const { secretSpendKey } = (0, crypto_1.keysFromDefault)(keysSeedBinary, BINARY_SIZE_SEED);
    return secretSpendKey;
}
exports.mnemonicToSeed = mnemonicToSeed;
function text2binary(text) {
    const tokens = text.trim().split(/\s+/);
    if (tokens.length % 3 !== 0) {
        throw new Error("Invalid word count in mnemonic text");
    }
    const res = Buffer.alloc((tokens.length / 3) * 4);
    for (let i = 0; i < tokens.length / 3; i++) {
        const w1 = wordsMap.get(tokens[i * 3]);
        const w2 = wordsMap.get(tokens[i * 3 + 1]);
        const w3 = wordsMap.get(tokens[i * 3 + 2]);
        if (w1 === undefined || w2 === undefined || w3 === undefined) {
            throw new Error("Invalid word in mnemonic text");
        }
        const val = w1 + exports.NUMWORDS * (((exports.NUMWORDS - w1) + w2) % exports.NUMWORDS) + exports.NUMWORDS * exports.NUMWORDS * (((exports.NUMWORDS - w2) + w3) % exports.NUMWORDS);
        const byteIndex = i * 4;
        res[byteIndex] = val & 0xFF;
        res[byteIndex + 1] = (val >> 8) & 0xFF;
        res[byteIndex + 2] = (val >> 16) & 0xFF;
        res[byteIndex + 3] = (val >> 24) & 0xFF;
    }
    return res;
}
//# sourceMappingURL=mnemonic-to-seed.js.map