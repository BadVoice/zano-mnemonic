import { MnemonicToSeedResult } from './types';
export declare const NUMWORDS = 1626;
export declare function mnemonicToSeed(seedPhraseRaw: string): Promise<MnemonicToSeedResult>;
