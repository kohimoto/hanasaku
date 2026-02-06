gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// ===============================
//  追加：初回スクロールまで待機させる仕組み
// ===============================
const delayedST = [];
const SCROLL_ONLY_MODE = false; // falseで全部即発火寄りに
const shouldDelay = () => SCROLL_ONLY_MODE && window.scrollY === 0;

// 最初のスクロールで一斉に有効化
const enableDelayedTriggers = () => {
  delayedST.forEach((st) => st.enable());
  delayedST.length = 0;
  ScrollTrigger.refresh(true);
};

// scroll / wheel / touch のどれかが来たら一度だけ有効化
if (shouldDelay()) {
  window.addEventListener("scroll", enableDelayedTriggers, { once: true, passive: true });
  window.addEventListener("wheel", enableDelayedTriggers, { once: true, passive: true });
  window.addEventListener("touchmove", enableDelayedTriggers, { once: true, passive: true });
}

// 作った ScrollTrigger を “必要なら止めて溜める” ヘルパ
const delayIfNeeded = (st) => {
  if (!st) return;
  if (shouldDelay()) st.disable(false); // ← killせず無効化
  delayedST.push(st);
};



jQuery(function ($) {

  // =====================================
// loading（24時間に1回だけ表示）
// =====================================
const LOADING_KEY = "loading_last_shown_at";
const LOADING_TTL = 24 * 60 * 60 * 1000; // 24h

const now = Date.now();
const last = Number(localStorage.getItem(LOADING_KEY) || 0);
const shouldShowLoading = !last || (now - last) > LOADING_TTL;

if (shouldShowLoading) {
  //  今回はローディングを出す → 記録
  localStorage.setItem(LOADING_KEY, String(now));

  $(".loading").addClass("is-disp");
  setTimeout(function () {
    $(".loading").addClass("is-active");
  }, 500);

  setTimeout(function () {
    $(".loading").fadeOut();
  }, 3500);

  setTimeout(function () {
    $(".main__image").addClass("is-active");
  }, 4000);

  setTimeout(function () {
    $(".main__text").addClass("is-active");
  }, 4500);
  setTimeout(function () {
    $(".line__text").addClass("is-active");
  }, 5000);

} else {
  //  24時間以内 → ローディングは出さない（最初から消す）
  $(".loading").hide();
  $(".main__image").addClass("is-active");
  $(".main__text").addClass("is-active");
  $(".line__text").addClass("is-active");
}


  // =====================================
  // 各ブランドTOPのスライダー
  // =====================================
  const heroSwiper = new Swiper("#heroSwiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: 1200,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  });

  // =====================================
  // about_01にきたらヘッダー出現
  // =====================================
  const header = document.querySelector('.l-header');

  const headerST = ScrollTrigger.create({
    trigger: '.about__01',
    start: 'top top',
    onEnter: () => header.classList.add('is-show'),
    onLeaveBack: () => header.classList.remove('is-show'),
  });

  //  追加：これも「初回スクロールまで待機」対象にするならここ
  delayIfNeeded(headerST);

});


// =====================================
// fade in
// =====================================
$(function () {
  setTimeout(function () {
    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    const setupBeforeFade = (selector, startPos) => {
      gsap.utils.toArray(selector).forEach((el) => {
        const tween = gsap.to(el, {
          "--bgBeforeOpacity": 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: startPos,
            once: true,
          },
        });

        //  追加：初回スクロールまで待機
        delayIfNeeded(tween.scrollTrigger);
      });
    };

    const setupFade = (selector, startPos, delaySec = 0) => {
      gsap.utils.toArray(selector).forEach((target) => {
        const tween = gsap.to(target, {
          opacity: 1,
          y: 0,
          delay: delaySec,
          scrollTrigger: {
            trigger: target,
            start: startPos,
            once: true, // ← “1回だけ”にしたいなら付ける（任意）
          },
        });

        //  追加：初回スクロールまで待機
        delayIfNeeded(tween.scrollTrigger);
      });
    };

    mm.add("(max-width: 820px)", () => {
      setupBeforeFade(".js__fadein__bg", "top bottom-=5%");
      setupFade(".js__fadein",  "top center+=70%", 0);
      setupFade(".js__fadein2", "top center+=70%", 0.2);
    });

    mm.add("(min-width: 821px)", () => {
      setupBeforeFade(".js__fadein__bg", "top bottom-=10%");
      setupFade(".js__fadein",  "top center+=40%", 0);
      setupFade(".js__fadein2", "top center+=40%", 0.2);
    });
  }, 0);
});



$(function () {
  setTimeout(function () {
    let mm = gsap.matchMedia();

    mm.add("(max-width: 821px)", () => {
      const tween = gsap.fromTo(
        ".fade__item",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".fade__position",
            start: "top center+=10%",
            once: true,
          },
        }
      );

      //  追加：初回スクロールまで待機
      delayIfNeeded(tween.scrollTrigger);
    });

    mm.add("(min-width: 821px)", () => {
      const tween = gsap.fromTo(
        ".fade__item",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".fade__position",
            start: "top center+=0%",
            once: true,
          },
        }
      );

      //  追加：初回スクロールまで待機
      delayIfNeeded(tween.scrollTrigger);
    });

  }, 0);
});



// ===============================
// リサイズ → URL Enter相当（=遷移として再読み込み）
// ===============================

let resizeTimer = null;
const RESIZE_THRESHOLD = 40;
let lastWidth = window.innerWidth;

const navigateLikeEnterOnResize = () => {
  const w = window.innerWidth;
  const diff = Math.abs(w - lastWidth);

  // 微小変化（アドレスバー出入り等）は無視
  if (diff < RESIZE_THRESHOLD) return;
  lastWidth = w;

  // あなたの「キャッシュ済みローディング」分岐用
  sessionStorage.setItem("forceCachedLoading", "1");

  // リロード後にTOP固定したいなら（任意）
  sessionStorage.setItem("scrollTopAfterReload", "1");

  // URL入力→Enter相当（履歴は増やさない）
  const url = location.pathname + location.search + location.hash;
  location.replace(url);
};

window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(navigateLikeEnterOnResize, 200);
  },
  { passive: true }
);
