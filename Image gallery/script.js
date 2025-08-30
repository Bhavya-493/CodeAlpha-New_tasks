(function () {
  "use strict";

  const gallery = document.getElementById("gallery");
  const items = Array.from(gallery.querySelectorAll(".gallery-item"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));

  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let activeFilter = "all";
  let visibleIndexes = items.map((_, i) => i);
  let currentIndex = 0;

  function applyFilter(category) {
    activeFilter = category;
    visibleIndexes = [];
    items.forEach((item, index) => {
      const match = category === "all" || item.dataset.category === category;
      if (match) {
        item.classList.remove("hidden");
        visibleIndexes.push(index);
      } else {
        item.classList.add("hidden");
      }
    });
    // Reset currentIndex to first of visible
    if (visibleIndexes.length > 0) currentIndex = 0;
  }

  function openLightbox(indexInVisible) {
    if (visibleIndexes.length === 0) return;
    const realIndex = visibleIndexes[indexInVisible];
    const figure = items[realIndex];
    const img = figure.querySelector("img");
    const caption = figure.querySelector("figcaption");
    lbImage.src = img.src;
    lbImage.alt = img.alt || "";
    lbCaption.textContent = caption ? caption.textContent : "";
    currentIndex = indexInVisible;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showNext(delta) {
    if (visibleIndexes.length === 0) return;
    const newIndex = (currentIndex + delta + visibleIndexes.length) % visibleIndexes.length;
    openLightbox(newIndex);
  }

  // Click handlers for opening lightbox
  items.forEach((item, absoluteIndex) => {
    item.addEventListener("click", () => {
      const inVisible = visibleIndexes.indexOf(absoluteIndex);
      if (inVisible !== -1) openLightbox(inVisible);
    });
    item.style.cursor = "zoom-in";
  });

  // Lightbox controls
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeLightbox();
  });
  lbPrev.addEventListener("click", () => showNext(-1));
  lbNext.addEventListener("click", () => showNext(1));

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext(1);
    if (e.key === "ArrowLeft") showNext(-1);
  });

  // Filters
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  // Initialize
  applyFilter("all");
})();

