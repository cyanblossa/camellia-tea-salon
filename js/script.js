"use strict";

// お知らせのデータ

const newsData = [
  {
    date: "2026.10.14",
    title: "臨時休業のお知らせ",
    detail:
      "誠に勝手ながら、2026年10月16日（金）は終日休業とさせていただきます。お客様にはご不便をおかけいたしますが、何卒ご理解のほどよろしくお願い申し上げます。",
  },

  {
    date: "2026.10.01",
    title: "秋の限定メニューが始まりました",
    detail:
      "秋の味覚を楽しめる季節限定メニューをご用意しました。紅茶とともに、ゆったりとしたひとときをお過ごしください。",
  },
  {
    date: "2026.09.20",
    title: "新しい紅茶が入荷しました",
    detail:
      "香り豊かな新しい紅茶が入荷いたしました。ぜひお気に入りの一杯を見つけてください。",
  },
];

// お知らせを表示する場所を取得
const newsList = document.querySelector("#news-list");

// お知らせのHTMLを作成
if (newsList) {
  [...newsData]
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((news, index) => {
      const item = document.createElement("div");
      item.classList.add("news__item");

      // クリックできる見出し
      const button = document.createElement("button");
      button.classList.add("news__button");
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `news-detail-${index + 1}`);

      const date = document.createElement("time");
      date.classList.add("news__date");
      date.textContent = news.date;
      date.dateTime = news.date.replaceAll(".", "-");

      const title = document.createElement("span");
      title.classList.add("news__title");
      title.textContent = news.title;

      const arrow = document.createElement("span");
      arrow.classList.add("news__arrow");
      arrow.innerHTML = `
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none"
          stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
          stroke-linejoin="round" focusable="false" aria-hidden="true"
          style="display:block">
          <path d="M5 19 19 5M5 5h14v14"/>
        </svg>`;
      arrow.setAttribute("aria-hidden", "true");

      // 詳細文
      const detail = document.createElement("div");
      detail.classList.add("news__detail");
      detail.id = `news-detail-${index + 1}`;
      detail.inert = true;
      detail.setAttribute("aria-hidden", "true");

      const paragraph = document.createElement("p");
      paragraph.textContent = news.detail;
      detail.appendChild(paragraph);

      // クリック時の処理
      button.addEventListener("click", () => {
        const isOpen = item.classList.toggle("is-open");

        if (!isOpen && detail.contains(document.activeElement)) {
          button.focus();
        }
        detail.inert = !isOpen;
        detail.setAttribute("aria-hidden", String(!isOpen));
        button.setAttribute("aria-expanded", String(isOpen));
      });

      button.append(date, title, arrow);
      item.append(button, detail);
      newsList.appendChild(item);
    });
}

// ==========================
// About スライドショー
// ==========================

const slides = document.querySelectorAll(".about__slide");

if (slides.length > 1) {
  let currentSlide = 0;
  let slideshowTimer = null;
  let slideshowPaused = false;
  const slideshowToggle = document.querySelector(".about__slideshow-toggle");
  const slideshowMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncSlideAccessibility = () => {
    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== currentSlide));
    });
  };
  syncSlideAccessibility();

  const updateSlideshow = () => {
    if (slideshowTimer !== null) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
    const stopped = slideshowPaused || slideshowMotion.matches;
    if (slideshowToggle) {
      const label = slideshowMotion.matches
        ? "動きを減らす設定により自動切り替えを停止中"
        : stopped
          ? "写真の自動切り替えを再開"
          : "写真の自動切り替えを一時停止";
      slideshowToggle.classList.toggle("is-paused", stopped);
      slideshowToggle.setAttribute("aria-label", label);
      slideshowToggle.disabled = slideshowMotion.matches;
      slideshowToggle.hidden = false;
    }
    if (stopped) return;
    slideshowTimer = setInterval(() => {
      slides[currentSlide].classList.remove("is-active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("is-active");
      syncSlideAccessibility();
    }, 9000);
  };

  if (slideshowToggle) {
    slideshowToggle.addEventListener("click", () => {
      slideshowPaused = !slideshowPaused;
      updateSlideshow();
    });
  }
  slideshowMotion.addEventListener("change", updateSlideshow);
  updateSlideshow();
}


 // ==========================
 // Header ハンバーガーメニュー
 // ==========================

 const menuToggle = document.querySelector(".header__toggle");
 const headerNav = document.querySelector(".header__nav");

 if (menuToggle && headerNav) {
   // メニューを開閉する
   const setMenuOpen = (isOpen) => {
     headerNav.classList.toggle("is-open", isOpen);
     menuToggle.classList.toggle("is-open", isOpen);

     menuToggle.setAttribute("aria-expanded", String(isOpen));
     menuToggle.setAttribute(
       "aria-label",
       isOpen ? "メニューを閉じる" : "メニューを開く"
     );
   };

   // ボタンをクリックしたとき
   menuToggle.addEventListener("click", () => {
     const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
     setMenuOpen(!isOpen);
   });

   // メニュー内のリンクをクリックしたとき
   headerNav.querySelectorAll("a").forEach((link) => {
     link.addEventListener("click", () => {
       setMenuOpen(false);
     });
   });

   // メニュー以外をクリックしたとき
   document.addEventListener("click", (event) => {
     if (
       !headerNav.contains(event.target) &&
       !menuToggle.contains(event.target)
     ) {
       setMenuOpen(false);
     }
   });

   // Escキーを押したとき
   document.addEventListener("keydown", (event) => {
     if (event.key === "Escape") {
       const returnFocus = window.matchMedia("(max-width: 768px)").matches &&
         menuToggle.getAttribute("aria-expanded") === "true" &&
         headerNav.contains(document.activeElement);
       if (returnFocus) menuToggle.focus({ preventScroll: true });
       setMenuOpen(false);
     }
   });
 }

// About専用ギャラリー。TOPに対象要素がない場合は何もしません。
(() => {
  const viewport = document.querySelector(".about-page__gallery-viewport");
  const toggle = document.querySelector(".about-page__gallery-toggle");
  if (!viewport || !toggle) return;
  const track = viewport.querySelector(".about-page__gallery-track");
  if (!track || !track.children.length) return;
  const originals = [...track.children];
  // ブラウザー標準の画像ドラッグではなく、ギャラリーを移動する。
  originals.forEach((photo) => { photo.draggable = false; });
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const copies = originals.map((photo) => {
    const copy = photo.cloneNode(true);
    copy.alt = "";
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
    return copy;
  });

  let stopped = false;
  let allowToggleFocus = false;
  let hovering = false;
  let touching = false;
  let dragPointer = null;
  let dragX = 0;
  let dragScroll = 0;
  let visible = true;
  let interactionResumeAt = 0;
  let trackingInteraction = false;
  let frame = 0;
  let previousTime = 0;
  let cycleWidth = 0;
  let position = viewport.scrollLeft;
  let expectedScroll = viewport.scrollLeft;

  const measure = () => {
    cycleWidth = copies[0].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
    position = viewport.scrollLeft;
    expectedScroll = viewport.scrollLeft;
  };
  // 期限を更新するだけにし、操作ごとのタイマーを積み重ねない。
  const pauseAfterInteraction = () => {
    trackingInteraction = true;
    interactionResumeAt = performance.now() + 1000;
  };
  const resumeImmediately = () => {
    interactionResumeAt = 0;
    trackingInteraction = false;
    position = viewport.scrollLeft;
    expectedScroll = viewport.scrollLeft;
  };
  // フォーカスによる一時停止は、ユーザーが選んだ停止状態とは別に扱う。
  const hasGalleryFocus = () => viewport.contains(document.activeElement) ||
    (document.activeElement === toggle && !allowToggleFocus);
  const canPlay = () => !motion.matches && !stopped && !hovering && !touching && !hasGalleryFocus() && visible && !document.hidden;

  const animate = (time) => {
    const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
    previousTime = time;
    // 操作中の位置変更だけで待機期限を更新する。自動移動では延長しない。
    if (Math.abs(viewport.scrollLeft - expectedScroll) > 0.5) {
      position = viewport.scrollLeft;
      if (trackingInteraction) pauseAfterInteraction();
    }
    if (canPlay() && time >= interactionResumeAt && cycleWidth > 0) {
      trackingInteraction = false;
      position += elapsed * 0.018; // 1秒に18px、ゆっくり移動
      if (position >= cycleWidth) position %= cycleWidth;
      viewport.scrollLeft = position;
    } else {
      // スワイプ・キーボードで移動した位置から再開する。
      position = viewport.scrollLeft;
    }
    expectedScroll = viewport.scrollLeft;
    frame = requestAnimationFrame(animate);
  };
  const start = () => {
    cancelAnimationFrame(frame);
    previousTime = 0;
    if (!motion.matches && !document.hidden && visible) frame = requestAnimationFrame(animate);
  };
  const updateMotion = () => {
    copies.forEach((copy) => { copy.hidden = motion.matches; });
    toggle.hidden = motion.matches;
    if (motion.matches) viewport.scrollLeft = 0;
    measure();
    start();
  };

  toggle.hidden = motion.matches;
  toggle.addEventListener("click", () => {
    stopped = !stopped;
    // 明示的な再開だけ、現在ボタンに残っているフォーカスを免除する。
    allowToggleFocus = !stopped && document.activeElement === toggle;
    toggle.textContent = stopped ? "自動スクロールを再開" : "自動スクロールを停止";
    if (!stopped) resumeImmediately();
  });
  toggle.addEventListener("blur", () => { allowToggleFocus = false; });
  viewport.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") hovering = true; });
  viewport.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch") return;
    hovering = false;
    // マウス退出時は、以前の手動操作の待機期限も解除する。
    if (!touching) resumeImmediately();
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    touching = true;
    trackingInteraction = true;
    if (event.pointerType === "mouse") {
      dragPointer = event.pointerId;
      dragX = event.clientX;
      dragScroll = viewport.scrollLeft;
    }
  });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerId !== dragPointer) return;
    // ウィンドウ外でボタンを離した場合も停止状態を残さない。
    if (!(event.buttons & 1)) { endInteraction(); return; }
    viewport.scrollLeft = dragScroll - (event.clientX - dragX);
    pauseAfterInteraction();
  });
  const endInteraction = () => {
    touching = false;
    dragPointer = null;
    pauseAfterInteraction();
  };
  window.addEventListener("pointerup", () => { if (touching) endInteraction(); });
  window.addEventListener("pointercancel", endInteraction);
  window.addEventListener("blur", () => { hovering = false; endInteraction(); });
  viewport.addEventListener("dragstart", (event) => { event.preventDefault(); });
  viewport.addEventListener("wheel", pauseAfterInteraction, { passive: true });
  // フォーカス自体には待機時間を設けず、実際のキー操作だけを扱う。
  viewport.addEventListener("keydown", pauseAfterInteraction);
  window.addEventListener("resize", measure);
  document.addEventListener("visibilitychange", start);
  motion.addEventListener("change", updateMotion);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }).observe(viewport);
  }
  updateMotion();
})();

// 各ページ共通：先頭へ戻るボタン
(() => {
  const button = document.querySelector(".back-to-top");
  if (!button) return;
  const footer = document.querySelector("footer");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pending = false;
  let returningToTop = false;

  const update = () => {
    pending = false;
    if (returningToTop && window.scrollY <= 1) {
      returningToTop = false;
      if (document.activeElement === button) {
        const topLink = document.querySelector(".header__logo");
        if (topLink) topLink.focus({ preventScroll: true });
        else button.blur();
      }
    }
    // 操作中のフォーカスを失わせない。離れたら通常の表示条件に戻す。
    button.hidden = (window.scrollY < 400 || footerVisible) &&
      document.activeElement !== button;
  };
  const scheduleUpdate = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };

  // 初回通知前も、フッターが見えているページでは表示しない。
  let footerVisible = false;
  if (footer) {
    const rect = footer.getBoundingClientRect();
    footerVisible = rect.top < document.documentElement.clientHeight && rect.bottom > 0;
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      scheduleUpdate();
    });
    footerObserver.observe(footer);
  }

  button.addEventListener("click", () => {
    returningToTop = true;
    window.scrollTo({ top: 0, behavior: motion.matches ? "instant" : "smooth" });
    scheduleUpdate();
  });
  const cancelReturn = () => { returningToTop = false; };
  window.addEventListener("wheel", cancelReturn, { passive: true });
  window.addEventListener("touchstart", cancelReturn, { passive: true });
  window.addEventListener("keydown", cancelReturn);
  button.addEventListener("focus", scheduleUpdate);
  button.addEventListener("blur", scheduleUpdate);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  update();
})();

// Menu専用：Teaの手動スワイプとドットを同期。自動再生はしない。
(() => {
  const gallery = document.querySelector(".menu-page__tea-gallery");
  const controls = document.querySelector(".menu-page__tea-dots");
  if (!gallery || !controls) return;
  const slides = [...gallery.querySelectorAll(".menu-page__tea-slide")];
  const dots = [...controls.querySelectorAll(".menu-page__tea-dot")];
  if (!slides.length || slides.length !== dots.length) return;
  const mobile = window.matchMedia("(max-width: 768px)");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pending = false;

  const positions = () => {
    const left = gallery.getBoundingClientRect().left;
    const max = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    return slides.map((slide) => Math.max(0, Math.min(max,
      slide.getBoundingClientRect().left - left + gallery.scrollLeft)));
  };
  const update = () => {
    pending = false;
    controls.hidden = !mobile.matches;
    if (!mobile.matches) return;
    const offsets = positions();
    let current = 0;
    offsets.forEach((offset, index) => {
      if (Math.abs(offset - gallery.scrollLeft) < Math.abs(offsets[current] - gallery.scrollLeft)) current = index;
    });
    dots.forEach((dot, index) => {
      if (index === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };
  const scheduleUpdate = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  };
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      gallery.scrollTo({ left: positions()[index], behavior: motion.matches ? "instant" : "smooth" });
    });
  });
  gallery.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  mobile.addEventListener("change", scheduleUpdate);
  update();
})();
