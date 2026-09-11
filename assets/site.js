/* Shared nav + footer behavior used across all LTLM pages. */
(function () {
  "use strict";

  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-nav-mobile]');
  var desktopContact = document.querySelector('.nav-contact');
  var desktopCta = document.querySelector('.nav-cta');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  // Mobile nav has no room for the Contact link or the "Take the Quiz"
  // pill next to the hamburger, so mirror both into the dropdown panel.
  if (panel && desktopContact) {
    var mobileContact = desktopContact.cloneNode(true);
    mobileContact.classList.add('nav-mobile-contact');
    panel.appendChild(mobileContact);
  }

  if (panel && desktopCta) {
    var mobileCta = desktopCta.cloneNode(true);
    mobileCta.classList.remove('nav-cta');
    mobileCta.classList.add('nav-mobile-cta');
    panel.appendChild(mobileCta);
  }

  var yearEl = document.getElementById('ltlm-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Newsletter forms (hero + footer, wherever present) — v1 placeholder,
  // no backend yet. Swap this handler for a real submit to your email
  // list provider (Mailchimp/ConvertKit/Beehiiv/etc.) when one is set up.
  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.parentElement.querySelector('[data-newsletter-success]');
      form.style.display = 'none';
      if (success) success.classList.add('show');
    });
  });
})();
