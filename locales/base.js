import Polyglot from 'node-polyglot';

var polyglot = new Polyglot();


// Strings with variables inside
polyglot.extend({
  'prompts_header': 'Looking good %{name} ♥️',
  'search_slug_articles': 'Found %{articles} article%{articles !== 1 && s} about',
  'tickets_slug_support_message': 'Make sure to check your email address. If you didn&apos;t receive the ticket in your email, add no-reply@mg.oasa.co to your contacts and send us an email to %{team_email} for support.'
});

export default polyglot;

