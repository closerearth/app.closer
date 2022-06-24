module.exports = {
  BLOCKCHAIN_NETWORK_ID: 44787,
  BLOCKCHAIN_NATIVE_TOKEN: 'TEST CELO',
  BLOCKCHAIN_DAO_TOKEN: {
    address: '0x17Bf6E84C3EC4b964C22F44F00511852d69a1C87',
    name: 'TesTDF',
    symbol: 'TDF',
    decimals: 18,
  },
  BLOCKCHAIN_STABLE_COIN: {
    address: '0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f',
    name: 'Test cEUR',
    symbol: 'cEUR',
  },
  BLOCKCHAIN_CROWDSALE_CONTRACT_ADDRESS: '0xA3145DBd2E9E4778934D61f7814AF2b6eF3F06E2',
  BLOCKCHAIN_DAO_STAKING_CONTRACT_ADDRESS: '0x5573373eca49a668cb89488C77F308cFd3732Ebe',
  BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT_ADDRESS: '0xBb47F3e2ad0Fe056f10d56655ee2acf862E1Fe78',
  BLOCKCHAIN_DIAMOND_ABI: [
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_contractOwner',
          'type': 'address'
        },
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'facetAddress',
              'type': 'address'
            },
            {
              'internalType': 'enum IDiamondCut.FacetCutAction',
              'name': 'action',
              'type': 'uint8'
            },
            {
              'internalType': 'bytes4[]',
              'name': 'functionSelectors',
              'type': 'bytes4[]'
            }
          ],
          'internalType': 'struct IDiamondCut.FacetCut[]',
          'name': '_diamondCut',
          'type': 'tuple[]'
        },
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'initContract',
              'type': 'address'
            },
            {
              'internalType': 'bytes',
              'name': 'initData',
              'type': 'bytes'
            }
          ],
          'internalType': 'struct Diamond.Initialization[]',
          'name': '_initializations',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'payable',
      'type': 'constructor'
    },
    {
      'stateMutability': 'payable',
      'type': 'fallback'
    },
    {
      'stateMutability': 'payable',
      'type': 'receive'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint16[2][]',
          'name': 'bookings',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'CanceledBookings',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint16[2][]',
          'name': 'bookings',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'NewBookings',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'YearAdded',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'YearRemoved',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'YearUpdated',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'addYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16[2][]',
          'name': 'dates',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'book',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16[2][]',
          'name': 'dates',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'cancel',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'enable',
          'type': 'bool'
        }
      ],
      'name': 'enableYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint16',
          'name': 'yearNum',
          'type': 'uint16'
        },
        {
          'internalType': 'uint16',
          'name': 'dayOfYear',
          'type': 'uint16'
        }
      ],
      'name': 'getBooking',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        },
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'year',
              'type': 'uint16'
            },
            {
              'internalType': 'uint16',
              'name': 'dayOfYear',
              'type': 'uint16'
            },
            {
              'internalType': 'uint256',
              'name': 'price',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct BookingMapLib.Booking',
          'name': '',
          'type': 'tuple'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint16',
          'name': '_year',
          'type': 'uint16'
        }
      ],
      'name': 'getBookings',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'year',
              'type': 'uint16'
            },
            {
              'internalType': 'uint16',
              'name': 'dayOfYear',
              'type': 'uint16'
            },
            {
              'internalType': 'uint256',
              'name': 'price',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct BookingMapLib.Booking[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'getYear',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        },
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'number',
              'type': 'uint16'
            },
            {
              'internalType': 'bool',
              'name': 'leapYear',
              'type': 'bool'
            },
            {
              'internalType': 'uint256',
              'name': 'start',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'end',
              'type': 'uint256'
            },
            {
              'internalType': 'bool',
              'name': 'enabled',
              'type': 'bool'
            }
          ],
          'internalType': 'struct BookingMapLib.Year',
          'name': '',
          'type': 'tuple'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'getYears',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'number',
              'type': 'uint16'
            },
            {
              'internalType': 'bool',
              'name': 'leapYear',
              'type': 'bool'
            },
            {
              'internalType': 'uint256',
              'name': 'start',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'end',
              'type': 'uint256'
            },
            {
              'internalType': 'bool',
              'name': 'enabled',
              'type': 'bool'
            }
          ],
          'internalType': 'struct BookingMapLib.Year[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'removeYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'updateYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'DepositedTokens',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'WithdrawnTokens',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'balanceOf',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'deposit',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'depositsFor',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct Deposit[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'lockedAmount',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'requestedAmount',
          'type': 'uint256'
        }
      ],
      'name': 'restake',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'restakeMax',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'initLockingTm',
          'type': 'uint256'
        }
      ],
      'name': 'restakeOrDepositAtFor',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'unlockedAmount',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'requested',
          'type': 'uint256'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'withdrawMax',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'token',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'daysLocked',
          'type': 'uint256'
        }
      ],
      'name': 'init',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Paused',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Unpaused',
      'type': 'event'
    },
    {
      'inputs': [],
      'name': 'pause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'paused',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'unpause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'facetAddress',
              'type': 'address'
            },
            {
              'internalType': 'enum IDiamondCut.FacetCutAction',
              'name': 'action',
              'type': 'uint8'
            },
            {
              'internalType': 'bytes4[]',
              'name': 'functionSelectors',
              'type': 'bytes4[]'
            }
          ],
          'indexed': false,
          'internalType': 'struct IDiamondCut.FacetCut[]',
          'name': '_diamondCut',
          'type': 'tuple[]'
        },
        {
          'indexed': false,
          'internalType': 'address',
          'name': '_init',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'bytes',
          'name': '_calldata',
          'type': 'bytes'
        }
      ],
      'name': 'DiamondCut',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'facetAddress',
              'type': 'address'
            },
            {
              'internalType': 'enum IDiamondCut.FacetCutAction',
              'name': 'action',
              'type': 'uint8'
            },
            {
              'internalType': 'bytes4[]',
              'name': 'functionSelectors',
              'type': 'bytes4[]'
            }
          ],
          'internalType': 'struct IDiamondCut.FacetCut[]',
          'name': '_diamondCut',
          'type': 'tuple[]'
        },
        {
          'internalType': 'address',
          'name': '_init',
          'type': 'address'
        },
        {
          'internalType': 'bytes',
          'name': '_calldata',
          'type': 'bytes'
        }
      ],
      'name': 'diamondCut',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'previousOwner',
          'type': 'address'
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'OwnershipTransferred',
      'type': 'event'
    },
    {
      'inputs': [],
      'name': 'owner',
      'outputs': [
        {
          'internalType': 'address',
          'name': 'owner_',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_newOwner',
          'type': 'address'
        }
      ],
      'name': 'transferOwnership',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'bytes4',
          'name': '_functionSelector',
          'type': 'bytes4'
        }
      ],
      'name': 'facetAddress',
      'outputs': [
        {
          'internalType': 'address',
          'name': 'facetAddress_',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'facetAddresses',
      'outputs': [
        {
          'internalType': 'address[]',
          'name': 'facetAddresses_',
          'type': 'address[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_facet',
          'type': 'address'
        }
      ],
      'name': 'facetFunctionSelectors',
      'outputs': [
        {
          'internalType': 'bytes4[]',
          'name': 'facetFunctionSelectors_',
          'type': 'bytes4[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'facets',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'address',
              'name': 'facetAddress',
              'type': 'address'
            },
            {
              'internalType': 'bytes4[]',
              'name': 'functionSelectors',
              'type': 'bytes4[]'
            }
          ],
          'internalType': 'struct IDiamondLoupe.Facet[]',
          'name': 'facets_',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    }
  ],
  BLOCKCHAIN_CROWDSALE_CONTRACT_ABI: [
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'weiAmount',
          'type': 'uint256'
        }
      ],
      'name': 'buy',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'beneficiary',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'weiAmount',
          'type': 'uint256'
        }
      ],
      'name': 'buyFor',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'pause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'renounceOwnership',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': '_price',
          'type': 'uint256'
        }
      ],
      'name': 'setPrice',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_token',
          'type': 'address'
        },
        {
          'internalType': 'address',
          'name': '_quote',
          'type': 'address'
        },
        {
          'internalType': 'address payable',
          'name': '_wallet',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': '_price',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': '_minTokenBuyAmount',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'previousOwner',
          'type': 'address'
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'OwnershipTransferred',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Paused',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'prevPrice',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'newPrice',
          'type': 'uint256'
        }
      ],
      'name': 'PriceChanged',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'purchaser',
          'type': 'address'
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'beneficiary',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'TokensPurchased',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'transferOwnership',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'unpause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Unpaused',
      'type': 'event'
    },
    {
      'inputs': [],
      'name': 'minTokenBuyAmount',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'owner',
      'outputs': [
        {
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'paused',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'price',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'quote',
      'outputs': [
        {
          'internalType': 'contract IERC20',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'remainingTokens',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'token',
      'outputs': [
        {
          'internalType': 'contract IERC20',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'wallet',
      'outputs': [
        {
          'internalType': 'address payable',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'weiRaised',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    }
  ],
  BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI: [
    {
      'inputs': [
        {
          'internalType': 'contract IERC20',
          'name': '_token',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'secondsLocked',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'DepositedTokens',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'WithdrawnTokens',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'balanceOf',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'deposit',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'depositsFor',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct TokenLock.Deposit[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'lockedAmount',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'lockingPeriod',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'requestedAmount',
          'type': 'uint256'
        }
      ],
      'name': 'restake',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'restakeMax',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'initLockingTm',
          'type': 'uint256'
        }
      ],
      'name': 'restakeOrDepositAtFor',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'token',
      'outputs': [
        {
          'internalType': 'contract IERC20',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'unlockedAmount',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'requested',
          'type': 'uint256'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'withdrawMax',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    }
  ],
  BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_ABI: [
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'addYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16[2][]',
          'name': 'dates',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'book',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16[2][]',
          'name': 'dates',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'cancel',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'enable',
          'type': 'bool'
        }
      ],
      'name': 'enableYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'pause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'removeYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': '_tokenLock',
          'type': 'address'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint16[2][]',
          'name': 'bookings',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'CanceledBookings',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'indexed': false,
          'internalType': 'uint16[2][]',
          'name': 'bookings',
          'type': 'uint16[2][]'
        }
      ],
      'name': 'NewBookings',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'previousOwner',
          'type': 'address'
        },
        {
          'indexed': true,
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'OwnershipTransferred',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Paused',
      'type': 'event'
    },
    {
      'inputs': [],
      'name': 'renounceOwnership',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'transferOwnership',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'unpause',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'Unpaused',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'updateYear',
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'YearAdded',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'YearRemoved',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'leapYear',
          'type': 'bool'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'start',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'uint256',
          'name': 'end',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'internalType': 'bool',
          'name': 'enabled',
          'type': 'bool'
        }
      ],
      'name': 'YearUpdated',
      'type': 'event'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint16',
          'name': 'yearNum',
          'type': 'uint16'
        },
        {
          'internalType': 'uint16',
          'name': 'dayOfYear',
          'type': 'uint16'
        }
      ],
      'name': 'getBooking',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        },
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'year',
              'type': 'uint16'
            },
            {
              'internalType': 'uint16',
              'name': 'dayOfYear',
              'type': 'uint16'
            },
            {
              'internalType': 'uint256',
              'name': 'price',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct BookingMapLib.Booking',
          'name': '',
          'type': 'tuple'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        },
        {
          'internalType': 'uint16',
          'name': '_year',
          'type': 'uint16'
        }
      ],
      'name': 'getBookings',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'year',
              'type': 'uint16'
            },
            {
              'internalType': 'uint16',
              'name': 'dayOfYear',
              'type': 'uint16'
            },
            {
              'internalType': 'uint256',
              'name': 'price',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'timestamp',
              'type': 'uint256'
            }
          ],
          'internalType': 'struct BookingMapLib.Booking[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'number',
          'type': 'uint16'
        }
      ],
      'name': 'getYear',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        },
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'number',
              'type': 'uint16'
            },
            {
              'internalType': 'bool',
              'name': 'leapYear',
              'type': 'bool'
            },
            {
              'internalType': 'uint256',
              'name': 'start',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'end',
              'type': 'uint256'
            },
            {
              'internalType': 'bool',
              'name': 'enabled',
              'type': 'bool'
            }
          ],
          'internalType': 'struct BookingMapLib.Year',
          'name': '',
          'type': 'tuple'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'getYears',
      'outputs': [
        {
          'components': [
            {
              'internalType': 'uint16',
              'name': 'number',
              'type': 'uint16'
            },
            {
              'internalType': 'bool',
              'name': 'leapYear',
              'type': 'bool'
            },
            {
              'internalType': 'uint256',
              'name': 'start',
              'type': 'uint256'
            },
            {
              'internalType': 'uint256',
              'name': 'end',
              'type': 'uint256'
            },
            {
              'internalType': 'bool',
              'name': 'enabled',
              'type': 'bool'
            }
          ],
          'internalType': 'struct BookingMapLib.Year[]',
          'name': '',
          'type': 'tuple[]'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'owner',
      'outputs': [
        {
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'paused',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'tokenLock',
      'outputs': [
        {
          'internalType': 'contract ITokenLock',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    }
  ],
}