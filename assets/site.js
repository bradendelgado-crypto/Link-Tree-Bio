/* Shared nav + footer behavior used across all LTLM pages. */
(function () {
  "use strict";

  // Every email form on the site (hero signup, footer signup, blog unlock
  // gate) funnels into the same Google Sheet the Investor Type Quiz uses,
  // via the same Apps Script webhook. See Investing Quiz/index.html for
  // the original implementation this mirrors.
  var LEAD_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbywlaoZkkPTDIIpYXgf0YwxQmGavEN5T4LQNUlMp_NUrsuEFkBEH5YEj8v5oGIv0EDtPQ/exec";

  // "source" is stored in the same column the quiz uses for its archetype
  // result, so the sheet stays single-shaped while still showing where
  // each row came from (e.g. "Newsletter Signup", "Blog Unlock").
  function submitLead(email, source) {
    return fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ email: email, archetype: source })
    });
  }

  window.LTLM = window.LTLM || {};
  window.LTLM.submitLead = submitLead;

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

  // Newsletter forms (hero + footer, wherever present) — submit to the
  // shared lead sheet, same as the quiz and the blog unlock gate.
  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var success = form.parentElement.querySelector('[data-newsletter-success]');
      var email = input.value.trim();

      function reveal() {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      }

      // Apps Script webhooks don't return CORS headers under mode:
      // 'no-cors', so the response is opaque — reveal optimistically
      // once the request has been sent, same as the quiz does.
      submitLead(email, 'Newsletter Signup').then(reveal).catch(reveal);
    });
  });
})();
