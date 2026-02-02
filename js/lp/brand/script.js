gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
jQuery(function ($) {

  // この中であればWordpressでも「$」が使用可能になる

  // =====================================
  // 各ブランドTOPのスライダー
  // =====================================
  const heroSwiper = new Swiper("#heroSwiper", {
    loop: true,              // FVはループのほうが気持ちいいこと多い
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,

    // ふわっと切り替え
    effect: "fade",
    fadeEffect: { crossFade: true },

    // ふわっと時間（切り替えの長さ）
    speed: 1200,

    // “流れ続ける”じゃなく、一定間隔で切り替える
    autoplay: {
      delay: 3000,              // 表示してる時間
      disableOnInteraction: false
    },
    on: {
      init(swiper) {
        // 初回表示をふわっとさせる
        //swiper.el.classList.add("is-ready");
        //$('.js__fedeIn_main').addClass('is-ready');
      }
    }

  });


  // ページ内リンク
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var target = $(this.hash);
    if (target.length) {
      $('html, body').animate(
        { scrollTop: target.offset().top- 120 }, // 移動先の位置
        600, // スクロール時間（ミリ秒）
        'swing'
      );
    }
  });
});



$(function () {
  setTimeout(function () {
    // フェードインアニメーション
    let mm = gsap.matchMedia();
    mm.add("(max-width: 821px)", () => {
      // ここに1024px以下のときのコードを書きます
      gsap.utils.toArray(".js__fadein").forEach((target) => {
        gsap.to(target, {
          scrollTrigger: {
            trigger: target,
            start: "top center+=70%",
          },
          opacity: 1,
          y: 0,
        });
      });
    });

    mm.add("(min-width: 821px)", () => {
      // ここに1025px以上のときのコードを書きます
      gsap.utils.toArray(".js__fadein").forEach((target) => {
        gsap.to(target, {
          scrollTrigger: {
            trigger: target,
            start: "top center+=40%",
          },
          opacity: 1,
          y: 0,
        });
      });
    });
  }, 0);
});
