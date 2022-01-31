export default {
  user: [
    { name: 'screenname', label: 'Full name', type: 'text', placeholder: 'John Snow', required: true },
    {
      name: 'settings.newsletter_weekly',
      label: 'Weekly summary email',
      type: 'switch'
    }
  ],
  event: [
    { name: 'name', label: 'Event title', type: 'text', placeholder: 'My event', required: true },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: '' },
    { name: 'location', label: 'Location (link)', type: 'text', placeholder: 'https://zoom.com/wakeup' },
    { name: 'price', label: 'Price', type: 'currency', placeholder: '0.00' },
    { name: 'start', label: 'Start date', type: 'date', required: true },
    { name: 'end', label: 'End', type: 'date', required: true },
    {
      name: 'visibility',
      label: 'Visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Private', value: 'private' },
      ]
    }
  ],
  listing: [
    { name: 'name', label: 'Listing name', type: 'text', placeholder: 'Spacious loft', required: true },
    { name: 'description', label: 'Description', type: 'longtext', placeholder: '' },
    { name: 'price', label: 'Price (€)', type: 'number', placeholder: '10.00', required: true },
    { name: 'quantity', label: 'Quantity available', type: 'text', placeholder: '1', required: false },
  ],
};
