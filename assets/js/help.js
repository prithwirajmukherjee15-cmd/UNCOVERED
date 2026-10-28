/* Uncovered — help page: contact form (demo) and deep-linked FAQ. */
(function () {
  const S = window.SITE, $ = S.$;
  const form = $('#contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.news-form__msg', form);
    const bad = [...form.querySelectorAll('input, textarea')].filter(i => !i.checkValidity());
    if (bad.length) { msg.textContent = 'Please fill in your name, a valid email and a message.'; bad[0].focus(); return; }
    // Demo: hand the message to the visitor's email app. Swap for a form backend before launch.
    const subject = `[${$('#c-topic').value}] ${$('#c-order').value || 'Website enquiry'}`;
    const body = `${$('#c-msg').value}\n\n— ${$('#c-name').value} (${$('#c-email').value})`;
    location.href = `mailto:hello@uncovered.store?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    msg.textContent = 'Thanks! Your email app should open with the message ready to send.';
    S.track('contact_submit', { topic: $('#c-topic').value });
  });
  // Open a FAQ item when linked from elsewhere, e.g. help.html#faq
  if (location.hash === '#faq') { const d = document.querySelector('#faq details'); if (d) d.open = true; }
})();
