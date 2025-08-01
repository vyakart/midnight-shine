/**
 * terminal.js
 * Retro, collapsible terminal with minimal commands.
 * - Collapsed by default; opened via #terminal-toggle button.
 * - Draggable and resizable when expanded.
 * - Commands: help, clear, whoami, about, projects, echo, ls, cat
 * - Topic triggers: bjj, physics, maths, ea, meditation -> one-liners
 */
(function () {
  var root = document.querySelector('.terminal');
  var toggleBtn = document.getElementById('terminal-toggle');
  if (!root || !toggleBtn) return;

  var bodyEl = root.querySelector('.terminal-body');
  var inputEl = root.querySelector('#terminal-input');
  var headerEl = root.querySelector('.terminal-header');
  var resizeEl = root.querySelector('.terminal-resize');

  // Collapsed/expanded state
  function openTerminal() {
    root.classList.remove('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'true');
    inputEl.focus();
  }
  function closeTerminal() {
    root.classList.add('collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  toggleBtn.addEventListener('click', function () {
    var isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeTerminal(); else openTerminal();
  });

  // Simple in-memory "fs"
  var files = {
    'README.txt': 'Explorations — a practice across form and meaning.\nType `help` to see commands.',
    'projects.txt': '- Astro Reel\n- Minimal Design System\n- BJJ Study Notes'
  };

  // Append a new line to terminal body
  function appendLine(text, className) {
    var div = document.createElement('div');
    div.className = 'line' + (className ? ' ' + className : '');
    div.textContent = text;
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // Topic one‑liners
  var topicReplies = {
    bjj: 'BJJ: frames, levers, timing—pressure tested ideas.',
    physics: 'Physics: models that don’t flinch under measurement.',
    maths: 'Maths: proofs that compress complexity into clarity.',
    ea: 'EA: aim effort where impact compounds.',
    meditation: 'Meditation: maintenance for perception and attention.'
  };

  // Commands implementation
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

    // Topic triggers
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

  // Submit on Enter
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var value = inputEl.value;
      inputEl.value = '';
      runCommand(value);
    }
  });

  // Focus handling
  root.addEventListener('click', function (e) {
    if (e.target === inputEl) return;
    inputEl.focus();
  });

  // Draggable (header as handle) when expanded
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

    headerEl.addEventListener('mousedown', onMouseDown);
  })();

  // Resizable (bottom-right handle) when expanded
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

    resizeEl.addEventListener('mousedown', onMouseDown);
  })();

  // Initial state: collapsed
  window.addEventListener('load', function () {
    closeTerminal();
  });

  // Keyboard accessibility: Esc clears current input
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') inputEl.value = '';
  });
})();