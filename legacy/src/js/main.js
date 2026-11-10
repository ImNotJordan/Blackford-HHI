/* Hyacinth Legal Support · Boot */
'use strict';
/* =========================================================
   Boot
   ========================================================= */
seed();
hydrate();
renderSiteContent();
if ('ResizeObserver' in window) {
  const tb = $('#toasts');
  new ResizeObserver(() => { document.documentElement.style.setProperty('--toast-h', (tb.children.length ? tb.offsetHeight + 16 : 0) + 'px'); }).observe(tb);
}
renderContactForm();
initSpy();
updateChrome();
updateAdminChrome();
route();
