const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const filters = document.querySelectorAll(".filter");
const days = document.querySelectorAll(".day-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    days.forEach((day) => {
      const tags = day.dataset.tags.split(" ");
      day.classList.toggle("hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

document.querySelectorAll(".checklist").forEach((list) => {
  const key = `sg-trip-${list.dataset.list}`;
  const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  boxes.forEach((box) => { box.checked = saved.includes(box.value); });

  const update = () => {
    const checked = boxes.filter((box) => box.checked).map((box) => box.value);
    localStorage.setItem(key, JSON.stringify(checked));
    if (list.dataset.list === "baby") {
      const card = list.closest(".checklist-card");
      card.querySelector(".progress span").style.width = `${(checked.length / boxes.length) * 100}%`;
      card.querySelector(".progress-label").textContent = `${checked.length} / ${boxes.length} packed`;
    }
  };

  boxes.forEach((box) => box.addEventListener("change", update));
  update();
});

const toast = document.querySelector(".toast");
let toastTimer;
document.querySelectorAll("[data-map]").forEach((button) => {
  const query = button.dataset.query;
  if (query) {
    button.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    button.target = "_blank";
    button.rel = "noopener";
  }
  button.addEventListener("click", (event) => {
    if (!query) event.preventDefault();
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...nav.querySelectorAll("a")];
const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
  });
}, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .1, .25] });

sections.forEach((section) => observer.observe(section));

const routeScroll = document.querySelector(".route-scroll");
if (routeScroll && window.innerWidth <= 600) {
  requestAnimationFrame(() => {
    routeScroll.scrollLeft = (routeScroll.scrollWidth - routeScroll.clientWidth) / 2;
  });
}
