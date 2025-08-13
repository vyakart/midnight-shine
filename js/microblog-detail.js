/* Microblog detail page renderer */
(function () {
  'use strict';

  function qs(sel) { return document.querySelector(sel); }
  function getParam(name) {
    var m = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : '';
  }

  var posts = (window.microblogPosts && Array.isArray(window.microblogPosts)) ? window.microblogPosts : [];
  var slug = getParam('slug');
  var post = null;

  if (slug) {
    post = posts.find(function (p) { return (p.slug === slug) || (String(p.id) === slug); }) || null;
  }
  if (!post && posts.length) {
    post = posts[0]; // graceful fallback
  }

  function setHero(p) {
    var hero = qs('#detail-hero');
    if (!hero) return;

    var g = (p && Array.isArray(p.gradients) && p.gradients.length >= 3)
      ? p.gradients
      : ['#6366f1', '#8b5cf6', '#ec4899'];

    hero.setAttribute('aria-label', (p && p.title) ? p.title : 'Post hero');

    function setGradient() {
      hero.style.backgroundImage = [
        'radial-gradient(ellipse 120% 80% at 30% 20%, ' + g[0] + ', transparent 60%)',
        'radial-gradient(ellipse 80% 120% at 70% 80%, ' + g[1] + ', transparent 65%)',
        'radial-gradient(ellipse 110% 90% at 50% 50%, ' + g[2] + ', transparent 60%)'
      ].join(', ');
    }

    var s = (p && (p.slug || p.id)) ? encodeURIComponent(p.slug || String(p.id)) : '';
    if (!s) return setGradient();

    var triedPng = false;
    var img = new Image();
    img.onload = function () {
      hero.style.backgroundImage = 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35)), url(' + img.src + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    };
    img.onerror = function () {
      if (!triedPng) {
        triedPng = true;
        img.src = '/assets/values/' + s + '.png';
      } else {
        setGradient();
      }
    };
    img.src = '/assets/values/' + s + '.jpg';
  }

  function setMeta(p) {
    var titleEl = qs('.detail-title');
    if (titleEl) titleEl.textContent = (p && p.title) ? p.title : 'Post';

    var authorEl = qs('.detail-author');
    if (authorEl) authorEl.textContent = (p && p.author) ? ('by ' + p.author) : '';

    var tEl = qs('.detail-time');
    if (tEl) {
      var t = (p && p.timestamp) ? p.timestamp : '';
      var valid = false;
      try {
        var d = new Date(t);
        if (!isNaN(d.getTime())) {
          tEl.setAttribute('datetime', d.toISOString());
          tEl.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
          valid = true;
        }
      } catch (_) {}
      if (!valid) {
        if (t) tEl.textContent = String(t);
      }
    }
  }

  function setBody(p) {
    var body = qs('#detail-body');
    if (!body) return;
    if (!p) {
      body.innerHTML = '<p>Post not found.</p>';
      return;
    }
    if (p.fullContent) {
      if (typeof p.fullContent === 'string' && p.fullContent.indexOf('<') >= 0 || p.fullContent.indexOf('>') >= 0 || /<\/?\w+/.test(p.fullContent)) {
        body.innerHTML = p.fullContent;
      } else {
        body.textContent = p.fullContent;
      }
    } else if (p.content) {
      if (typeof p.content === 'string' && p.content.indexOf('<') >= 0 || p.content.indexOf('>') >= 0 || /<\/?\w+/.test(p.content)) {
        body.innerHTML = p.content;
      } else {
        body.textContent = p.content;
      }
    } else {
      body.textContent = '';
    }
  }

  function render() {
    if (!post) {
      setHero(null);
      setMeta(null);
      setBody(null);
      return;
    }
    setHero(post);
    setMeta(post);
    setBody(post);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();