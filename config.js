module.exports = {
  PLATFORM: 'closer',
  PLATFORM_NAME: 'Closer',
  GA_ANALYTICS: false,
  FB_DOMAIN_VERIFICATION: false,
  PLATFORM_LEGAL_ADDRESS: 'TBD, Portugal',
  DEFAULT_TITLE: 'Closer: the operating system for sovereign communities',
  DEFAULT_DESCRIPTION: '',
  SEMANTIC_URL: 'https://dev.closer.earth',
  TEAM_EMAIL: 'team@closer.earth',
  START_TIME: '2021-04-30T15:00:00.000Z',
  EXPOSE_STORE: true,
  // API_URL: 'http://localhost:4002',
  API_URL: 'https://api.oasa.co',
  CDN_URL: 'https://cdn.oasa.co/photo/',
  NEWSLETTER: false,
  LOG_REQUESTS: false,
  CACHE_DURATION: 6000000, // 1h
  STRIPE_TEST_KEY: 'pk_test_51Gv17cGtt5D0VKR2Gt2RUVIDfrHRGJTfMSwRFpdbF5B4VfZ2zFOxM62ckAj4aQN5q6mDexpjZAqQKLpKdmwcnQfJ00sJwfbVWK',
  STRIPE_PUB_KEY: 'pk_live_YxOUUf7iOvQj104TG4JyWMAE003w80ISH6',
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
  BLOCKCHAIN_CROWDSALE_CONTRACT: {
    address: '0xA3145DBd2E9E4778934D61f7814AF2b6eF3F06E2'
  },
  BLOCKCHAIN_DAO_STAKING_CONTRACT: {
    address: '0x5573373eca49a668cb89488C77F308cFd3732Ebe'
  },
  BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT: {
    address: '0x9844449AEbd92a8170feF41A05ECC95E5B2bD21B'
  },
  LOGO_HEADER: '/images/logo.png',
  LOGO_WIDTH: undefined,
  REGISTRATION_MODE: 'open', // curated, paid, open
  // LOGO_FOOTER: "",
  FACEBOOK_URL: 'https://instagram.com/closerearth',
  INSTAGRAM_URL: 'https://instagram.com/closerearth',
  DISCORD_URL: 'https://discord.gg/A5WFMwPRaK',
  TWITTER_URL: 'https://twitter.com/closerearth',
  TELEGRAM_URL: 'https://t.me/closerdao',
  FEATURES: {
    events: true,
    booking: false,
    bookingVolunteers: false
  },
  SIGNUP_FIELDS: [
    {
      name: 'community',
      label: 'Tell us about your community',
      placeholder: 'A DAO for regenerative coffee farmers'
    }
  ],
}
