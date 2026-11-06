/* May Capital 官网演示：菜单、进入视口上浮、标语逐字点亮、档案筛选、邀请码校验 */
(function(){
  var de = document.documentElement;
  if(location.search.indexOf('static=1') > -1) de.classList.add('static');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) de.classList.add('static');
  document.addEventListener('DOMContentLoaded', function(){
    // 手机菜单：整屏面板，链接按阅读顺序逐个进场（每个 60ms，总长不超过 400ms）
    var btn = document.querySelector('.menu-btn');
    if(btn){
      var links = document.querySelectorAll('.panel a');
      links.forEach(function(a, i){ a.style.transitionDelay = Math.min(i * 60, 400) + 'ms'; });
      btn.addEventListener('click', function(){
        var open = !de.classList.contains('menu-open');
        de.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      });
      links.forEach(function(a){ a.addEventListener('click', function(){ de.classList.remove('menu-open'); }); });
    }
    if(de.classList.contains('static')) return;
    // 区块进入视口：上浮 32px 并淡入，只播一次
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -10% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
    // 标语：每个字越过触发线时，按阅读顺序逐个变成正文色
    var queue = 0, last = 0;
    var tio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var now = performance.now(); if(now - last > 400) queue = 0; last = now;
        e.target.style.transitionDelay = (queue++ * 40) + 'ms';
        e.target.classList.add('on'); tio.unobserve(e.target);
      });
    }, {rootMargin:'0px 0px -35% 0px'});
    document.querySelectorAll('.reveal-type .w').forEach(function(w){ tio.observe(w); });
  });
  document.addEventListener('DOMContentLoaded', function(){
    // 档案筛选
    document.querySelectorAll('[data-chips]').forEach(function(box){
      box.addEventListener('click', function(e){
        var b = e.target.closest('.chip'); if(!b) return;
        box.querySelectorAll('.chip').forEach(function(c){ c.classList.toggle('on', c===b); c.setAttribute('aria-pressed', c===b); });
        var f = b.dataset.filter, n = 0;
        document.querySelectorAll('[data-status]').forEach(function(r){ var ok = f==='all' || r.dataset.status.indexOf(f) > -1; r.hidden = !ok; if(ok) n++; });
        var c = document.querySelector('[data-count]'); if(c) c.textContent = n;
      });
    });
    // 邀请码
    document.querySelectorAll('form[data-invite]').forEach(function(f){
      f.addEventListener('submit', function(e){
        e.preventDefault();
        var v = f.querySelector('input').value.trim(), m = f.querySelector('.err');
        if(!v){ m.className = 'err caption-5'; m.textContent = '请先填入邀请函上的邀请码。'; return; }
        if(v.length < 6){ m.className = 'err caption-5'; m.textContent = '邀请码不完整，请对照邀请函再填一次。'; return; }
        m.className = 'err ok caption-5'; m.textContent = '已收到邀请码 ' + v + '。确认后，我们会把邀请函发到你的 App 里。';
      });
    });
  });
})();
