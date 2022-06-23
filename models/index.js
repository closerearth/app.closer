export default {
  channel: [
    { name: 'name', label: 'Channel Name', type: 'text', placeholder: 'Mauritius co-housing', required: true },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: 'A place to co-conspire' },
    {
      name: 'visibility',
      label: 'Visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ]
    },
  ],
  user: [
    { name: 'screenname', label: 'Full name', type: 'text', placeholder: 'John Snow', required: true },
    {
      name: 'settings.newsletter_weekly',
      label: 'Weekly summary email',
      type: 'switch'
    }
  ],
  session: [
    { name: 'name', label: 'Session Name', type: 'text', placeholder: 'Tokenomics', required: true },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: 'TDF tokens & Smart Contracts', required: true },
    // { name: 'speakers', label: 'Speakers', type: 'text', placeholder: 'Bea Fonseca', required: true },
    { name: 'event', label: 'Event', type: 'text', placeholder: 'A gathering around...', required: true },
    {
      name: 'virtual',
      label: 'Is this a virtual session?',
      type: 'switch',
      defaultValue: false,
    },
    {
      name: 'category',
      label: 'Session URL',
      defaultValue: '',
      type: 'text',
      placeholder: 'https://zoom.com/tokens',
      showIf: [
        {
          field: 'virtual',
          value: true
        }
      ]
    },
    {
      name: 'category',
      label: 'Session location',
      defaultValue: '',
      type: 'text',
      placeholder: '23 Maple St, 10100 San Francisco',
      showIf: [
        {
          field: 'virtual',
          value: false
        }
      ]
    },
    { name: 'start', label: 'When does the session start?', type: 'datetime', required: true },
    { name: 'end', label: 'When does the session end?', type: 'datetime', required: true }
  ],
  event: [
    { name: 'name', className: 'text-4xl font-bold', label: 'Event title', type: 'text', placeholder: 'My event', required: true, tab: 'general' },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: 'A gathering around...', tab: 'general' },
    { name: 'start', label: 'When does the event start?', type: 'datetime', required: true, tab: 'general' },
    { name: 'end', label: 'When does the event end?', type: 'datetime', required: true, tab: 'general' },
    {
      name: 'virtual',
      label: 'Is this a virtual event?',
      type: 'switch',
      defaultValue: false,
      tab: 'general'
    },
    {
      name: 'location',
      label: 'Event URL',
      defaultValue: '',
      type: 'text',
      placeholder: 'https://zoom.com/wakeup',
      tab: 'general',
      showIf: [
        {
          field: 'virtual',
          value: true
        }
      ]
    },
    {
      name: 'address',
      label: 'Event location',
      defaultValue: '',
      type: 'text',
      placeholder: '23 Maple St, 10100 San Francisco',
      tab: 'general',
      showIf: [
        {
          field: 'virtual',
          value: false
        }
      ]
    },
    {
      name: 'recording',
      label: 'Youtube recording URL',
      defaultValue: '',
      type: 'text',
      tab: 'general',
      placeholder: 'https://www.youtube.com/watch?v=r2-Ux4RRMKE'
    },
    {
      name: 'visibility',
      label: 'Visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ],
      tab: 'general'
    },
    {
      name: 'paid',
      label: 'Is this a paid event?',
      type: 'switch',
      tab: 'tickets',
      defaultValue: false
    },
    {
      name: 'ticketOptions',
      label: 'Ticket options',
      type: 'ticketOptions',
      tab: 'tickets',
      showIf: [
        {
          field: 'paid',
          value: true
        },
        {
          field: 'ticket',
          value: ''
        }
      ]
    },
    {
      name: 'discounts',
      label: 'Discount codes',
      type: 'discounts',
      tab: 'tickets',
      showIf: [
        {
          field: 'paid',
          value: true
        }
      ]
    },
    {
      name: 'stripePub',
      label: 'Custom Stripe Public Key',
      type: 'text',
      tab: 'tickets'
    },
    {
      name: 'stripeKey',
      label: 'Custom Stripe Private Key',
      type: 'text',
      tab: 'tickets'
    },
    {
      name: 'fields',
      label: 'Custom questions',
      type: 'fields',
      tab: 'advanced'
    },
    {
      name: 'ticket',
      label: 'Use External Ticketing URL',
      defaultValue: '',
      type: 'text',
      toggleFeature: true,
      placeholder: 'eventbrite.com/my-ticket',
      tab: 'advanced'
    },
    {
      name: 'password',
      label: 'Event password',
      tab: 'advanced',
      type: 'text',
      placeholder: '(If set, user will need the password to see)'
    },
    {
      name: 'participationGuideUrl',
      label: 'Participation guide',
      tab: 'advanced',
      type: 'text',
      placeholder: 'https://event.com/participation'
    },
  ],
  task: [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Plant tomatoes in the garden', required: true },
    { name: 'description', label: 'Summary of work', type: 'longtext', placeholder: `- Establish farming beds
- Make soil
- Plant seeds` },
    { name: 'due', label: 'Due date', type: 'date', required: false, default: null },
    { name: 'tags', label: 'Skills required', type: 'tags', placeholder: 'Add skill' },
    {
      name: 'visibility',
      label: 'Visibility',
      type: 'select',
      options: [
        { label: 'Public (visible to anyone)', value: 'public' },
        { label: 'Private (only members can apply)', value: 'private' },
      ]
    },
    { name: 'rewards', label: 'Reward', type: 'currency' }
  ],
  listing: [
    { name: 'name', label: 'Listing name', type: 'text', placeholder: 'Spacious loft', required: true, tab: 'general' },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: 'A beautiful treehouse loft with hot tub.', tab: 'general' },
    { name: 'photos', label: 'Photos', type: 'photos', tab: 'photos' },
    {
      name: 'private',
      label: 'Is this a private space?',
      type: 'switch',
      defaultValue: false,
      tab: 'general'
    },
    {
      name: 'kitchen',
      label: 'Does the space have a private kitchen?',
      type: 'switch',
      defaultValue: false
    },
    {
      name: 'bathroom',
      label: 'Does the space have a private bathroom?',
      type: 'switch',
      defaultValue: false
    },
    { name: 'rooms', label: 'Number of rooms', type: 'number', min: 1, required: false },
    { name: 'beds', label: 'Number of beds', type: 'number', min: 1, required: false },
    { name: 'monthlyRate', label: 'Monthly rate', type: 'currency', placeholder: '10.00', required: true, tab: 'prices' },
    { name: 'weeklyRate', label: 'Weekly rate', type: 'currency', placeholder: '10.00', required: true, tab: 'prices' },
    { name: 'dailyRate', label: 'Daily rate', type: 'currency', placeholder: '10.00', required: true, tab: 'prices' },
    { name: 'quantity', label: 'Quantity available', type: 'number', min: 1, required: false },
  ],
  booking: [
    { name: 'start', label: 'Start date', type: 'date' },
    { name: 'end', label: 'End', type: 'date' },
  ],
  application: [
    {
      name: 'inspiration',
      label: 'What is the most inspiring thing you\'ve seen recently? Any events/community/book/project etc.',
      type: 'longtext',
      placeholder: 'Project Heart in Tulum'
    },
    {
      name: 'home',
      label: 'What does home mean to you?',
      type: 'longtext',
      placeholder: ''
    },
    {
      name: 'gift',
      label: 'What will you bring to the community?',
      type: 'longtext',
      placeholder: 'Any special skills? Workshops you can give? Can you help with construction? Or gardening?'
    },
    { name: 'name', label: 'What\'s your name?', type: 'text', placeholder: 'John Snow', required: true },
    { name: 'phone', label: 'What\'s your phone number? (include country code)', type: 'phone', placeholder: '+35108892645' },
    { name: 'email', label: 'What\'s your email?', type: 'text', placeholder: 'you@awesomeproject.org', required: true },
    {
      name: 'dream',
      label: 'What do you dream of?',
      type: 'longtext',
      placeholder: ''
    },
  ]
};
