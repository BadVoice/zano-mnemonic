"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestampFromWord = exports.seedToMnemonic = exports.wordsArray = void 0;
const mnemonic_to_seed_1 = require("./mnemonic-to-seed");
const phrases_1 = require("../consts/phrases");
const crypto_1 = require("../lib/crypto");
exports.wordsArray = phrases_1.phrases.map(p => p.phrase);
const WALLET_BRAIN_DATE_OFFSET = 1543622400;
const WALLET_BRAIN_DATE_QUANTUM = 604800;
const WALLET_BRAIN_DATE_MAX_WEEKS_COUNT = 800;
const CHECKSUM_MAX = mnemonic_to_seed_1.NUMWORDS >> 1;
function seedToMnemonic(keysSeedHex) {
    if (!keysSeedHex) {
        throw new Error('Invalid seed hex');
    }
    const keysSeedBinary = Buffer.from(keysSeedHex, 'hex');
    const mnemonic = binaryToText(keysSeedBinary);
    const timestamp = WALLET_BRAIN_DATE_OFFSET;
    const creationTimestampWord = getWordFromTimestamp(timestamp, false);
    const hashWithTimestamp = Buffer.from((0, crypto_1.fastHash)(keysSeedBinary));
    hashWithTimestamp.writeBigUInt64LE(BigInt(timestamp), 0);
    const checksumHash = (0, crypto_1.fastHash)(hashWithTimestamp);
    const checksumValue = Number(checksumHash.readBigUInt64LE(0) % BigInt(CHECKSUM_MAX + 1)) || 0;
    const auditableFlag = 0;
    const checksumWord = wordByNum((checksumValue << 1) | (auditableFlag & 1));
    return `${mnemonic} ${creationTimestampWord} ${checksumWord}`;
}
exports.seedToMnemonic = seedToMnemonic;
function wordByNum(index) {
    return phrases_1.phrases[index]?.phrase ?? '';
}
function numByWord(word) {
    const entry = phrases_1.phrases.find(p => p.phrase === word);
    if (!entry) {
        throw new Error(`Unable to find word "${word}" in mnemonic dictionary`);
    }
    return entry.value;
}
function binaryToText(binary) {
    if (binary.length % 4 !== 0) {
        throw new Error('Invalid binary data size for mnemonic encoding');
    }
    const words = [];
    for (let i = 0; i < binary.length; i += 4) {
        const val = binary.readUInt32LE(i);
        const w1 = val % mnemonic_to_seed_1.NUMWORDS;
        const w2 = (Math.floor(val / mnemonic_to_seed_1.NUMWORDS) + w1) % mnemonic_to_seed_1.NUMWORDS;
        const w3 = (Math.floor(val / (mnemonic_to_seed_1.NUMWORDS * mnemonic_to_seed_1.NUMWORDS)) + w2) % mnemonic_to_seed_1.NUMWORDS;
        words.push(exports.wordsArray[w1], exports.wordsArray[w2], exports.wordsArray[w3]);
    }
    return words.join(' ');
}
function getWordFromTimestamp(timestamp, usePassword) {
    const dateOffset = Math.max(timestamp - WALLET_BRAIN_DATE_OFFSET, 0);
    let weeksCount = Math.trunc(dateOffset / WALLET_BRAIN_DATE_QUANTUM);
    if (weeksCount >= WALLET_BRAIN_DATE_MAX_WEEKS_COUNT) {
        throw new Error('SEED PHRASE needs to be extended or refactored');
    }
    if (usePassword) {
        weeksCount += WALLET_BRAIN_DATE_MAX_WEEKS_COUNT;
    }
    if (weeksCount > 0xffffffff) {
        throw new Error(`Value too large for uint32: ${weeksCount}`);
    }
    return wordByNum(weeksCount);
}
function getTimestampFromWord(word, passwordUsed) {
    let weeks = numByWord(word);
    if (weeks >= WALLET_BRAIN_DATE_MAX_WEEKS_COUNT) {
        weeks -= WALLET_BRAIN_DATE_MAX_WEEKS_COUNT;
        passwordUsed.value = true;
    }
    else {
        passwordUsed.value = false;
    }
    return weeks * WALLET_BRAIN_DATE_QUANTUM + WALLET_BRAIN_DATE_OFFSET;
}
exports.getTimestampFromWord = getTimestampFromWord;
//# sourceMappingURL=seed-to-mnemonic.js.map