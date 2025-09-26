(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const starImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
const THUMBNAIL_URL_PATH = "https://image.tmdb.org/t/p/w200";
const createMovieItem = (item) => {
  const list = document.createElement("li");
  const itemDivision = document.createElement("div");
  itemDivision.classList.add("item");
  const thumbnail = document.createElement("img");
  thumbnail.className = "thumbnail";
  thumbnail.src = `${THUMBNAIL_URL_PATH}${item.poster_path}`;
  const rateDivision = document.createElement("div");
  rateDivision.classList.add("item-desc");
  const paragraph = document.createElement("p");
  paragraph.classList.add("rate");
  const starIcon = document.createElement("img");
  starIcon.classList.add("star");
  starIcon.src = starImage;
  const rateSpan = document.createElement("span");
  rateSpan.textContent = `${item.vote_average}`;
  const title = document.createElement("strong");
  title.textContent = `${item.title}`;
  paragraph.append(starIcon, rateSpan);
  rateDivision.append(paragraph, title);
  itemDivision.append(thumbnail, rateDivision);
  list.appendChild(itemDivision);
  return list;
};
const createMovieList = (itemList) => {
  const fragment = document.createDocumentFragment();
  itemList.forEach((item) => {
    fragment.append(createMovieItem(item));
  });
  return fragment;
};
const createSkeletonItem = () => {
  const list = document.createElement("li");
  list.classList.add("skeleton-item");
  const thumbnail = document.createElement("div");
  thumbnail.classList.add("skeleton-thumbnail");
  list.appendChild(thumbnail);
  return list;
};
const createSkeleton = (count = 20) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(createSkeletonItem());
  }
  return fragment;
};
const removeSkeleton = () => {
  document.querySelectorAll(".skeleton-item").forEach((item) => item.remove());
};
const headers = {
  Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWRjZjU0NWFlZmNlZWU3MjUyNjVlMjAyYzg3MmI1ZSIsIm5iZiI6MTc1ODgwNDk0NS4zMTEsInN1YiI6IjY4ZDUzYmQxN2UzOGNkMWZkODg4MjBkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WyH0uzXne9p57VtidDnVRu2y6nfbMnfkNQwImQWrkwc"}`
};
async function getPopularMovies(page = 1) {
  try {
    const url = "https://api.themoviedb.org/3/movie/popular";
    const queries = new URLSearchParams({
      language: "ko-KR",
      page
    }).toString();
    const response = await fetch(`${url}?${queries}`, { headers });
    if (!response.ok) {
      throw new Error(
        `[${response.status}] API 호출을 실패하였습니다. 다시 시도해주세요.`
      );
    }
    return await response.json();
  } catch (error) {
    throw new Error(`getPopularMovies error : ${error.message}`);
  }
}
let currentPage = 1;
addEventListener("load", async () => {
  const thumbnailList = document.querySelector("main .thumbnail-list");
  thumbnailList.appendChild(createSkeleton());
  const popularMovieListData = await getPopularMovies();
  await new Promise((resolve) => setTimeout(resolve, 500));
  removeSkeleton();
  const movieList = popularMovieListData.results;
  currentPage = popularMovieListData.page;
  const popularMovieList = createMovieList(movieList);
  const moreButton = document.querySelector("main .more");
  if (popularMovieListData.total_pages > currentPage) {
    moreButton.classList.add("visible");
  } else {
    moreButton.classList.remove("visible");
  }
  moreButton.addEventListener("click", async () => {
    thumbnailList.appendChild(createSkeleton());
    const moreMovieListData = await getPopularMovies(currentPage + 1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    removeSkeleton();
    currentPage = moreMovieListData.page;
    const moreMovieList = createMovieList(moreMovieListData.results);
    thumbnailList.appendChild(moreMovieList);
  });
  thumbnailList.classList.add("thumbnail-list");
  thumbnailList.appendChild(popularMovieList);
});
