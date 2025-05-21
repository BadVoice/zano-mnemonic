import type { SeedToMnemonicResult } from './types';
export declare const wordsArray: string[];
export declare function seedToMnemonic(keysSeedHex: string): SeedToMnemonicResult;
export declare function getTimestampFromWord(word: string, passwordUsed: {
    value: boolean;
}): number;
