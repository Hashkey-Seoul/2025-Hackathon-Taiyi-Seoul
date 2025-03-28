const MAINNET = 1;
const SEPOLIA = 11155111;
const GEORLI = 5;
export const chainId = SEPOLIA;

export const nodeEndpoint = {
  [MAINNET]: 'https://mainnet.infura.io/v3/bdc43eba097740f5938c3af6077921dc',
  [GEORLI]: 'https://goerli.infura.io/v3/bdc43eba097740f5938c3af6077921dc',
  [SEPOLIA]: 'https://sepolia.infura.io/v3/bdc43eba097740f5938c3af6077921dc',
  // [MAINNET]:
  //   'https://ethereum-mainnet-rpc.allthatnode.com/3b928629k8RqJAPuGutF6YkxahmoZpGb',
  // [GEORLI]:
  //   'https://ethereum-goerli-rpc.allthatnode.com/3b928629k8RqJAPuGutF6YkxahmoZpGb',
  // [SEPOLIA]:
  //   'https://ethereum-sepolia-rpc.allthatnode.com/3b928629k8RqJAPuGutF6YkxahmoZpGb',
};

export const nodeEndpointWs = {
  [MAINNET]: 'wss://mainnet.infura.io/ws/v3/bdc43eba097740f5938c3af6077921dc',
  [GEORLI]: 'wss://goerli.infura.io/ws/v3/bdc43eba097740f5938c3af6077921dc',
  // [SEPOLIA]: 'wss://ethereum-sepolia-rpc-ws.allthatnode.com/3b928629k8RqJAPuGutF6YkxahmoZpGb',
  [SEPOLIA]:
    'wss://ethereum-sepolia.g.allthatnode.com/full/evm/f9fdd98d8b4e4282b82e0c542052b06d',
};

const contractInfo = {
  testStorage: {
    [MAINNET]: '',
    [GEORLI]: '0xEdceB38aA5411Bb3fd8776dAb0b21Da9d36D20bC',
  },
  marketplace: {
    [MAINNET]: '0x9deA8781d7f608AC7145cAe41f96Ab97A7A7734b',
    [GEORLI]: '0x2a6b669F25D054bC8bBA16da340B2540633289f7',
    [SEPOLIA]: '0x47de507a4687129bD5D25AbDA0E997C54003384C',
    createdBlockNumber: {
      [MAINNET]: 16023678,
      [GEORLI]: 7986067,
      [SEPOLIA]: 3465000,
    },
  },
  votingPool: {
    [MAINNET]: '0x95a9f799c9978CA1731FE787190216aBe21Edc3a',
    [GEORLI]: '0xE513134d7084e1Bf3f3E3626b043D1bBaEeE2a35',
    [SEPOLIA]: '0x43bcFD8Cd936BB4f0671e7b64A7967DF5897F1F8',
    createdBlockNumber: {
      [MAINNET]: 16024923,
      [GEORLI]: 8102077,
      [SEPOLIA]: 3465000,
    },
  },
  referral: {
    [MAINNET]: '0x2a79c84FE4FB8A8A111B316002d7bbA53eE3B8D8',
    [GEORLI]: '0x8057c50D599d72Bdc610a4392Df36e5615B2E9db',
    [SEPOLIA]: '0x8057c50D599d72Bdc610a4392Df36e5615B2E9db',
  },
  airdrop: {
    [MAINNET]: '0x5CbB692Cc914E4A362b2e4CAAeAEAD385DE21830',
    [GEORLI]: '0x42009dfB2396c74f0ACB76465D32172FBe6694c8',
    [SEPOLIA]: '0x42009dfB2396c74f0ACB76465D32172FBe6694c8',
  },
  contribution: {
    [MAINNET]: '',
    [GEORLI]: '0x851784CB5b002769a8AB7A92352E353D30055c2f',
    [SEPOLIA]: '0x851784CB5b002769a8AB7A92352E353D30055c2f',
  },
  feeManager: {
    [MAINNET]: '0x6884C15E9F66fE225E64e5C7f580e03f5D6B5aD4',
    [GEORLI]: '0x2770630f6e9306e4572cC7bc54A4f3b7743EA720',
    [SEPOLIA]: '0x007fC41217a984590FA49be3F4e81dA7fb6B0b5A',
  },
  factory: {
    [MAINNET]: '0xcE834FaC091Ce0Ce3CA9845dd89108f6ca5bb335',
    [GEORLI]: '',
    [SEPOLIA]: '0x16bC67F990914aae89Be95A468d78eed662f38bf',
  },
  drops: {
    [MAINNET]: '',
    [GEORLI]: '',
    [SEPOLIA]: '0x80Fbc3b1060dC9F201d073cE7D3171AA8A8B3a52',
  },
};

export const contracts = {
  marketplace: {
    address: contractInfo['marketplace'][chainId],
    createdBlockNumber: contractInfo['marketplace'].createdBlockNumber[chainId],
  },
  votingPool: {
    address: contractInfo['votingPool'][chainId],
    createdBlockNumber: contractInfo['votingPool'].createdBlockNumber[chainId],
  },
  referral: {
    address: contractInfo['referral'][chainId],
    createdBlockNumber: 0,
  },
  airdrop: {
    address: contractInfo['airdrop'][chainId],
    createdBlockNumber: 0,
  },
  contribution: {
    address: contractInfo['contribution'][chainId],
    createdBlockNumber: 0,
  },
  factory: {
    address: contractInfo['factory'][chainId],
    createdBlockNumber: 0,
  },
  feeManager: {
    address: contractInfo['feeManager'][chainId],
    createdBlockNumber: 0,
  },
  drops: {
    address: contractInfo['drops'][chainId],
    createdBlockNumber: 0,
  },
};

export const NULL_ADDR = '0x0000000000000000000000000000000000000000';

export const SUBSCRIBE_AGGREGATE_TIMEOUT = 200;
