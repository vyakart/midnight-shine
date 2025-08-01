/**
 * terminal.js
 * Retro, collapsible terminal (existing) + Vyakart bottom-right typewriter box.
 * - Keeps existing terminal functionality intact.
 * - Adds a small retro "Vyakart:" typewriter box anchored in the Hero bottom-right.
 */
(function () {
  // ========== Existing interactive terminal (kept as-is) ==========
  var root = document.querySelector('.terminal');
  var toggleBtn = document.getElementById('terminal-toggle');
  if (root && toggleBtn) {
    var bodyEl = root.querySelector('.terminal-body');
    var inputEl = root.querySelector('#terminal-input');
    var headerEl = root.querySelector('.terminal-header');
    var resizeEl = root.querySelector('.terminal-resize');

    function openTerminal() {
      root.classList.remove('collapsed');
      toggleBtn.setAttribute('aria-expanded', 'true');
      inputEl && inputEl.focus();
    }
    function closeTerminal() {
      root.classList.add('collapsed');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    toggleBtn.addEventListener('click', function () {
      var isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeTerminal(); else openTerminal();
    });

    var files = {
      'README.txt': 'Explorations — a practice across form and meaning.\nType `help` to see commands.',
      'projects.txt': '- Astro Reel\n- Minimal Design System\n- BJJ Study Notes'
    };

    function appendLine(text, className) {
      var div = document.createElement('div');
      div.className = 'line' + (className ? ' ' + className : '');
      div.textContent = text;
      bodyEl.appendChild(div);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    var topicReplies = {
      bjj: 'BJJ: frames, levers, timing—pressure tested ideas.',
      physics: 'Physics: models that don’t flinch under measurement.',
      maths: 'Maths: proofs that compress complexity into clarity.',
      ea: 'EA: aim effort where impact compounds.',
      meditation: 'Meditation: maintenance for perception and attention.'
    };

    var commands = {
      help: function () {
        appendLine('Commands: help, clear, whoami, about, projects, echo, ls, cat');
        appendLine('Topics: bjj, physics, maths, ea, meditation');
      },
      clear: function () { bodyEl.innerHTML = ''; },
      whoami: function () { appendLine('guest'); },
      about: function () {
        appendLine('Explorations blends rigor and intuition across disciplines.');
        appendLine('Built with accessibility and performance in mind.');
      },
      projects: function () {
        appendLine('- Astro Reel (timelapse + processing)');
        appendLine('- Minimal Design System (tokens + components)');
        appendLine('- BJJ Study Notes (positions, levers, timing)');
      },
      echo: function (args) { appendLine(args.join(' ')); },
      ls: function () { appendLine(Object.keys(files).join('  ')); },
      cat: function (args) {
        if (!args.length) return appendLine('cat: missing file operand');
        var name = args.join(' ');
        appendLine(files[name] || ('cat: ' + name + ': No such file'));
      }
    };

    function runCommand(raw) {
      var line = raw.trim();
      if (!line) return;
      appendLine('$ ' + line, 'cmd');

      var parts = line.split(/\s+/);
      var cmd = parts[0].toLowerCase();
      var args = parts.slice(1);

      if (topicReplies[cmd]) {
        appendLine(topicReplies[cmd]);
        return;
      }

      if (commands[cmd]) {
        commands[cmd](args);
      } else {
        appendLine("Command not found: " + cmd + " (try 'help')");
      }
    }

    inputEl && inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var value = inputEl.value;
        inputEl.value = '';
        runCommand(value);
      }
    });

    root.addEventListener('click', function (e) {
      if (e.target === inputEl) return;
      inputEl && inputEl.focus();
    });

    (function mountDrag() {
      var dragging = false;
      var startX = 0, startY = 0;
      var startLeft = 0, startTop = 0;

      function onMouseDown(e) {
        if (root.classList.contains('collapsed')) return;
        if (e.button !== 0) return;
        dragging = true;
        root.style.left = root.offsetLeft + 'px';
        root.style.top = root.offsetTop + 'px';
        root.style.right = 'auto';
        root.style.bottom = 'auto';

        startX = e.clientX;
        startY = e.clientY;
        startLeft = root.offsetLeft;
        startTop = root.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      }

      function onMouseMove(e) {
        if (!dragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        root.style.left = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, startLeft + dx)) + 'px';
        root.style.top = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, startTop + dy)) + 'px';
      }

      function onMouseUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      headerEl && headerEl.addEventListener('mousedown', onMouseDown);
    })();

    (function mountResize() {
      var resizing = false;
      var startX = 0, startY = 0;
      var startW = 0, startH = 0;

      function onMouseDown(e) {
        if (root.classList.contains('collapsed')) return;
        if (e.button !== 0) return;
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = root.offsetWidth;
        startH = root.offsetHeight;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      }

      function onMouseMove(e) {
        if (!resizing) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var newW = Math.max(260, Math.min(700, startW + dx));
        var newH = Math.max(160, Math.min(600, startH + dy));
        root.style.width = newW + 'px';
        root.style.height = newH + 'px';
      }

      function onMouseUp() {
        resizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      resizeEl && resizeEl.addEventListener('mousedown', onMouseDown);
    })();

    window.addEventListener('load', function () {
      closeTerminal();
    });

    inputEl && inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') inputEl.value = '';
    });
  }

  // ========== New Vyakart bottom-right typewriter (Hero) ==========
  (function mountVyakartTypewriter() {
    var host = document.querySelector('.section.hero .hero-media');
    if (!host) return;

    // Create the box if missing
    var box = document.querySelector('.vyakart-terminal');
    if (!box) {
      box = document.createElement('div');
      box.className = 'vyakart-terminal';
      box.setAttribute('role', 'region');
      box.setAttribute('aria-label', 'Vyakart retro terminal');
      box.innerHTML = '<div class="vyakart-inner"><span class="vyakart-prefix">Vyakart: </span><span class="vyakart-text" id="vyakart-text" aria-live="polite" aria-atomic="true"></span><span class="vyakart-cursor" aria-hidden="true">|</span></div>';
      host.appendChild(box);
    }
    var textEl = document.getElementById('vyakart-text');
    var cursorEl = box.querySelector('.vyakart-cursor');
    if (!textEl || !cursorEl) return;

    // Ensure hero can anchor absolute
    var heroSection = document.querySelector('.section.hero');
    if (heroSection && getComputedStyle(heroSection).position === 'static') {
      heroSection.style.position = 'relative';
    }

    // Words (creator translations)
    var words = [
      'स्रष्टा', 'ಸೃಷ್ಟಿಕರ್ತ', '𑄥𑄲𑄢𑄴𑄔𑄚𑄨',
      'クリエーター','المُبدِع','உருவாக்குநர்',
      'സൃഷ്ടികർത്താവ്','निर्माता','স্রষ্টা','создатель','ẹlẹda'
    ];

    // Fisher–Yates shuffle
    var arr = words.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }

    // Inject blink keyframes if missing
    (function injectBlink() {
      if (document.getElementById('vyakart-blink-style')) return;
      var style = document.createElement('style');
      style.id = 'vyakart-blink-style';
      style.textContent = '@keyframes vyakart-blink{0%,49%{opacity:1}50%,100%{opacity:0}}';
      document.head.appendChild(style);
    })();

    // Styles (retro terminal)
    box.style.position = 'absolute';
    box.style.right = '1.5rem';
    box.style.bottom = '1.5rem';
    box.style.zIndex = '3';
    box.style.background = 'rgba(0,0,0,0.8)';
    box.style.color = '#34d399';
    box.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    box.style.padding = '1rem';
    box.style.borderRadius = '0.375rem';
    box.style.boxShadow = '0 0 0 1px rgba(5,150,105,0.5)';

    var inner = box.querySelector('.vyakart-inner');
    if (inner) {
      inner.style.whiteSpace = 'pre';
      inner.style.display = 'inline-flex';
      inner.style.alignItems = 'baseline';
    }
    var prefix = box.querySelector('.vyakart-prefix');
    if (prefix) {
      prefix.style.color = '#10b981';
    }
    cursorEl.style.display = 'inline-block';
    cursorEl.style.marginLeft = '2px';
    cursorEl.style.animation = 'vyakart-blink 1s steps(1,end) infinite';

    // Reserve width to fit longest word + cursor
    (function reserveWidth() {
      var probe = document.createElement('span');
      probe.style.visibility = 'hidden';
      probe.style.position = 'absolute';
      probe.style.whiteSpace = 'pre';
      probe.style.fontFamily = box.style.fontFamily;
      probe.style.fontSize = getComputedStyle(box).fontSize || '14px';
      var longest = arr.reduce(function (a, b) { return (a.length >= b.length) ? a : b; }, '');
      probe.textContent = 'Vyakart: ' + longest + '|';
      document.body.appendChild(probe);
      var w = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      box.style.minWidth = Math.ceil(w + 8) + 'px';
    })();

    var typeDelay = 80;
    var deleteDelay = 80;
    var fullPause = 800;
    var betweenPause = 400;

    var wordIndex = 0;
    var current = '';
    var target = arr[0];

    function typeNextChar() {
      if (current.length < target.length) {
        current = target.slice(0, current.length + 1);
        textEl.textContent = current;
        setTimeout(typeNextChar, typeDelay);
      } else {
        setTimeout(startDeleting, fullPause);
      }
    }

    function startDeleting() {
      if (current.length > 0) {
        current = current.slice(0, current.length - 1);
        textEl.textContent = current;
        setTimeout(startDeleting, deleteDelay);
      } else {
        wordIndex = (wordIndex + 1) % arr.length;
        target = arr[wordIndex];
        setTimeout(typeNextChar, betweenPause);
      }
    }

    // Start
    textEl.textContent = '';
    typeNextChar();
  })();
})();