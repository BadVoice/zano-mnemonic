# Electron-mnemonic

# @badvoice/zano-mnemonic

A lightweight library for working with Zano mnemonic seed phrases. This library provides tools to convert mnemonic phrases into binary seeds, which can be used for wallet generation and other cryptographic operations.

## Features

- Convert mnemonic phrases into binary seeds.
- Simple and easy-to-use API.
- Built with TypeScript for type safety.

## Limitations

- **No support for password-protected seed phrases**: Currently, the library does not handle mnemonic phrases that are encrypted with a password.
- **No audit flag support**: The library does not yet support the audit flag feature.

## Installation

Install the library via npm:

```bash
npm install @badoice/zano-mnemonic
```

```typescript 
import type { MnemonicToSeedResult } from '@badoice/zano-mnemonic';
import { mnemonicToSeed } from '@badoice/zano-mnemonic';

(async () => {
  try {
    // Convert a mnemonic phrase into a private key in hex format
    const seed: MnemonicToSeedResult = await mnemonicToSeed('seedPhraseWithoutPassword');
    
    // Log the result
    console.log(seed);
  } catch (error) {
    console.error('Error while processing seed:', error.message);
  }
})();

```