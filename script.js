// ---------- Trending Section ----------
fetch('data/trending.json')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('trending');
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = "flex items-start gap-3";

      li.innerHTML = `
        <div class="flex-shrink-0">
          <img src="${item.image}" alt="${item.title}" class="w-12 h-12 rounded object-cover" />
        </div>
        <div class="flex-grow">
          <a href="${item.url}" class="text-blue-800 font-semibold hover:underline">${item.title}</a>
          <p class="text-sm text-gray-500">${item.subtitle}</p>
        </div>
      `;
      list.appendChild(li);
    });
  });

// ---------- Featured Carousel ----------
let carouselData = [];
let currentSlide = 0;

function renderCarouselSlide(index) {
  const container = document.getElementById('carousel-slides');
  const item = carouselData[index];

  container.innerHTML = `
    <div class="absolute inset-0 transition-all duration-500 bg-cover bg-center" style="background-image: url('${item.image}')">
      <a href="${item.url}" target="_blank" class="block bg-black/60 h-full p-6 text-white flex flex-col justify-end">
        <h3 class="text-2xl font-bold">${item.title}</h3>
        <p class="text-sm mt-2">${item.subtitle}</p>
      </a>
    </div>
  `;
}

function showNextSlide() {
  currentSlide = (currentSlide + 1) % carouselData.length;
  renderCarouselSlide(currentSlide);
}

function showPrevSlide() {
  currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
  renderCarouselSlide(currentSlide);
}

fetch('data/featured.json')
  .then(res => res.json())
  .then(data => {
    carouselData = data;
    renderCarouselSlide(currentSlide);

    document.getElementById('next').addEventListener('click', showNextSlide);
    document.getElementById('prev').addEventListener('click', showPrevSlide);

    // Optional autoplay
    // setInterval(showNextSlide, 6000);
  });

// ---------- For You Cards ----------

// Helpers to handle YouTube links
function isYouTubeUrl(url) {
  return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

function getYouTubeOEmbed(url) {
  return fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    .then(res => res.ok ? res.json() : null)
    .catch(() => null);
}

fetch('data/foryou.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('foryou');

    data.forEach(async item => {
      const card = document.createElement('div');
      card.className = "bg-gray-50 rounded shadow overflow-hidden";

      let title = item.title;
      let subtitle = item.subtitle;
      let image = item.image;
      let url = item.url;

      if (isYouTubeUrl(url)) {
        const ytData = await getYouTubeOEmbed(url);
        if (ytData) {
          title = ytData.title;
          subtitle = ytData.author_name;
          image = ytData.thumbnail_url;
        }
      }

      card.innerHTML = `
        <img src="${image}" alt="${title}" class="w-full h-40 object-cover" />
        <div class="p-3">
          <h4 class="font-semibold text-lg text-blue-800">${title}</h4>
          <p class="text-sm text-gray-600">${subtitle}</p>
          <a href="${url}" class="text-sm text-blue-600 hover:underline block mt-2" target="_blank">Read more</a>
        </div>
      `;
      container.appendChild(card);
    });
  });
