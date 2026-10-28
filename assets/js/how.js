/* Uncovered — "How it works": sleeve-code unlock form.
   Demo: codes are matched against the catalogue. In production, verify codes server-side. */
(function () {
  const S = window.SITE, D = S.D, $ = S.$;
  const form = $('#unlock-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#code').value.trim().toUpperCase().replace(/\s+/g, '');
    const msg = $('.unlock__msg', form);
    const album = D.albums.find(a => a.code === code);
    if (!code) { msg.textContent = 'Enter the code printed on your inner sleeve.'; return; }
    if (!album) { msg.textContent = 'We don\'t recognise that code. Check for O/0 and I/1 mix-ups, or contact us.'; S.track('sleeve_code_failed'); return; }
    msg.textContent = `Found it: ${album.title}. Opening the hub…`;
    setTimeout(() => { location.href = `album.html?id=${album.id}&k=code`; }, 500);
  });
})();
