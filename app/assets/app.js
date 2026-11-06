/* May Capital App 演示：页面里的小交互。单文件版也用这一份（window.MC_SINGLE 为真时走页内路由）。 */
(function(){
  function go(href){
    if(window.MC_SINGLE){ window.MC_GO(href); return; }
    location.href = href;
  }
  window.MC_go = go;

  function init(root){
    // 启动页：2.4 秒后自动进首页，点一下立刻进
    root.querySelectorAll('[data-splash]').forEach(function(el){
      if(document.documentElement.classList.contains('shot')) return;
      var t = setTimeout(function(){ if(isVisible(el)) go('home.html'); }, 2400);
      el.addEventListener('click', function(){ clearTimeout(t); go('home.html'); });
    });
    // 全部底稿：筛选
    root.querySelectorAll('[data-chips]').forEach(function(box){
      box.addEventListener('click', function(e){
        var b = e.target.closest('.chip'); if(!b) return;
        box.querySelectorAll('.chip').forEach(function(c){ c.classList.toggle('on', c===b); c.setAttribute('aria-pressed', c===b); });
        var f = b.dataset.filter, scope = box.parentElement, shown = 0;
        scope.querySelectorAll('[data-status]').forEach(function(r){
          var ok = f==='all' || r.dataset.status.indexOf(f) > -1;
          r.hidden = !ok; if(ok) shown++;
        });
        scope.querySelectorAll('.month').forEach(function(m){
          var any = false, n = m.nextElementSibling;
          while(n && !n.classList.contains('month') && !n.classList.contains('endnote')){ if(n.querySelector && [].some.call(n.querySelectorAll('[data-status]'), function(r){return !r.hidden})) any = true; n = n.nextElementSibling; }
          m.hidden = !any;
        });
        var c = scope.querySelector('[data-count]'); if(c) c.textContent = shown;
      });
    });
    // 收藏、提醒开关
    root.querySelectorAll('[data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on);
        var l = b.querySelector('[data-label]'); if(l) l.textContent = on ? b.dataset.on : b.dataset.off;
        if(b.dataset.fill) b.querySelector('svg').style.fill = on ? 'currentColor' : 'none';
      });
    });
    // 私人银行：邀请码
    root.querySelectorAll('form[data-invite]').forEach(function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var v = f.querySelector('input').value.trim(), m = f.querySelector('.err');
        if(!v){ m.className = 'err caption-5'; m.textContent = '请先填入邀请函上的邀请码。'; return; }
        if(v.length < 6){ m.className = 'err caption-5'; m.textContent = '邀请码不完整，请对照邀请函再填一次。'; return; }
        m.className = 'err ok caption-5'; m.textContent = '已收到邀请码 ' + v + '。确认后，邀请函会出现在「我的」里。';
      });
    });
    // 群聊：发送
    root.querySelectorAll('form[data-send]').forEach(function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var i = f.querySelector('input'), v = i.value.trim(); if(!v) return;
        var body = f.closest('.phone').querySelector('.body');
        var d = new Date(), t = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
        var w = document.createElement('div'); w.className = 'msg me first tail';
        var b = document.createElement('div'); b.className = 'bubble body-6';
        b.textContent = v;
        var tm = document.createElement('span'); tm.className = 'time caption-5 num'; tm.textContent = t + ' ✓';
        b.appendChild(tm); w.appendChild(b); body.appendChild(w);
        i.value = ''; body.scrollTop = body.scrollHeight;
      });
    });
    // 群聊打开时滚到最新
    root.querySelectorAll('[data-stick-bottom]').forEach(function(b){ if(!document.documentElement.classList.contains('full')) b.scrollTop = b.scrollHeight; });
  }
  function isVisible(el){ return !!(el.offsetWidth || el.offsetHeight); }
  window.MC_init = init;
  if(location.search.indexOf('full=1') > -1) document.documentElement.classList.add('full','shot');
  if(location.search.indexOf('shot=1') > -1) document.documentElement.classList.add('shot');
  document.addEventListener('DOMContentLoaded', function(){ init(document); });
})();
