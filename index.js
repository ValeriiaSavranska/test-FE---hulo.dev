const videoId = "824804225";
const apiUrl = `https://api.vimeo.com/videos/${videoId}?fields=pictures.sizes`;
const apiKey = "6a6a2c62597e36fe5e3bfe3a0272697b";

const slideContainer = document.getElementById("slideContainer");
const btnPrev = document.querySelector("button.btn-prev");
const btnNext = document.querySelector("button.btn-next");
const pagination = document.querySelector(".pagination");
const modal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");

btnPrev.setAttribute("disabled", "");

const fetchImg = async () => {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return response.json();
};

const getImg = () => {
  fetchImg()
    .then((data) => {
      console.log(data);
      const pictureUrl = data.pictures.sizes[0].link;
      let markup = "";

      for (let i = 0; i < 8; i++) {
        markup += `<img src=${pictureUrl} alt=video_preview_${i} data-video-id=${videoId}  data-video-ind=${i} class=slide />`;

        const paginationItem = document.createElement("span");
        paginationItem.className = "pagination-item";
        paginationItem.setAttribute("data-ind", i);
        paginationItem.addEventListener("click", function () {
          const paginationItems = document.querySelectorAll(".pagination-item");
          paginationItems.forEach((item) => {
            item.classList.remove("pagination-item--active");
          });
          paginationItem.classList.add("pagination-item--active");
          openModal(videoId);
        });
        pagination.appendChild(paginationItem);
      }

      slideContainer.innerHTML = markup;
    })
    .catch((err) => console.log(err));
};

getImg();

btnPrev.addEventListener("click", (event) => {
  slideContainer.classList.remove("move-left");
  btnPrev.setAttribute("disabled", "");
  btnNext.removeAttribute("disabled");
});
btnNext.addEventListener("click", (event) => {
  slideContainer.classList.add("move-left");
  btnNext.setAttribute("disabled", "");
  btnPrev.removeAttribute("disabled");
});

let currentPlayer;

slideContainer.addEventListener("click", function (event) {
  const videoId = event.target.getAttribute("data-video-id");
  const videoInd = event.target.getAttribute("data-video-ind");

  const paginationItems = document.querySelectorAll(".pagination-item");
  paginationItems.forEach((item) => {
    item.classList.remove("pagination-item--active");
    if (item.dataset.ind === videoInd) {
      console.log(item.dataset.ind);
      item.classList.add("pagination-item--active");
    }
  });

  if (videoId) {
    openModal(videoId);
  }
});

document.querySelector(".close").addEventListener("click", function () {
  closeModal();
});

function openModal(videoId) {
  modal.style.display = "block";
  videoPlayer.innerHTML = `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  currentPlayer = new Vimeo.Player(videoPlayer.querySelector("iframe"));
  currentPlayer.play();
}

function closeModal() {
  modal.style.display = "none";
  videoPlayer.innerHTML = "";
  if (currentPlayer) {
    currentPlayer.pause();
  }
}
