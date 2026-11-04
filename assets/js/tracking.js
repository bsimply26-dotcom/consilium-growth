/* Consilium Growth. Analytics and ad tracking.
   Paste each ID between the quotes when the account is set up. Leave blank to switch that tag off.
   Nothing loads until the visitor accepts cookies. */
var CG_TRACKING = {
  GA4_ID: "",              // Google Analytics 4, looks like G-XXXXXXXXXX
  GOOGLE_ADS_ID: "",       // Google Ads, looks like AW-XXXXXXXXXX
  GOOGLE_ADS_LEAD_LABEL: "", // Google Ads conversion label for a contact form lead
  LINKEDIN_PARTNER_ID: "", // LinkedIn Insight Tag partner ID, numbers only
  META_PIXEL_ID: ""        // Meta (Instagram and Facebook) Pixel ID, numbers only
};

(function () {
  var KEY = 'cg_consent';
  var isLeadPage = document.body.hasAttribute('data-lead-page');

  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function addScript(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }

  function loadTags() {
    var c = CG_TRACKING;
    // Google Analytics and Google Ads
    if (c.GA4_ID || c.GOOGLE_ADS_ID) {
      addScript('https://www.googletagmanager.com/gtag/js?id=' + (c.GA4_ID || c.GOOGLE_ADS_ID));
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      if (c.GA4_ID) gtag('config', c.GA4_ID);
      if (c.GOOGLE_ADS_ID) gtag('config', c.GOOGLE_ADS_ID);
      if (isLeadPage) {
        gtag('event', 'generate_lead');
        if (c.GOOGLE_ADS_ID && c.GOOGLE_ADS_LEAD_LABEL) gtag('event', 'conversion', { send_to: c.GOOGLE_ADS_ID + '/' + c.GOOGLE_ADS_LEAD_LABEL });
      }
    }
    // LinkedIn Insight Tag. Set the lead conversion in Campaign Manager as a page load of /thank-you.html
    if (c.LINKEDIN_PARTNER_ID) {
      window._linkedin_partner_id = c.LINKEDIN_PARTNER_ID;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(c.LINKEDIN_PARTNER_ID);
      window.lintrk = window.lintrk || function (a, b) { (window.lintrk.q = window.lintrk.q || []).push([a, b]); };
      addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }
    // Meta Pixel
    if (c.META_PIXEL_ID) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', c.META_PIXEL_ID);
      fbq('track', 'PageView');
      if (isLeadPage) fbq('track', 'Lead');
    }
  }

  var anyTag = CG_TRACKING.GA4_ID || CG_TRACKING.GOOGLE_ADS_ID || CG_TRACKING.LINKEDIN_PARTNER_ID || CG_TRACKING.META_PIXEL_ID;
  var choice = read();
  if (choice === 'yes') { loadTags(); return; }
  if (choice === 'no' || !anyTag) return;

  var bar = document.getElementById('consent');
  if (!bar) return;
  bar.classList.add('show');
  bar.querySelector('[data-accept]').addEventListener('click', function () { store('yes'); bar.classList.remove('show'); loadTags(); });
  bar.querySelector('[data-decline]').addEventListener('click', function () { store('no'); bar.classList.remove('show'); });
})();
