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
const BANNER_URL_PATH = "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/";
const updateBanner = (item) => {
  const backgroundContainer = document.querySelector("header .background-container");
  backgroundContainer.style.backgroundImage = `url('${BANNER_URL_PATH}${item.poster_path}')`;
  const rate = document.querySelector("header .rate > span");
  rate.textContent = `${item.vote_average}`;
  const title = document.querySelector("header .top-rated-movie .title");
  title.textContent = `${item.title}`;
};
const starImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
const THUMBNAIL_URL_PATH = "https://media.themoviedb.org/t/p/w440_and_h660_face/";
const createMovieItem = (item) => {
  const listItem = document.createElement("li");
  const itemContainer = createItemContainer({
    thumbnailPath: item.poster_path,
    voteAverage: item.vote_average,
    title: item.title
  });
  listItem.appendChild(itemContainer);
  return listItem;
};
const createItemContainer = ({ thumbnailPath, voteAverage, title }) => {
  const itemContainer = document.createElement("div");
  itemContainer.className = "item";
  const thumbnail = document.createElement("img");
  thumbnail.className = "thumbnail";
  thumbnail.src = `${THUMBNAIL_URL_PATH}${thumbnailPath}`;
  const infoContainer = createInfoItem({
    voteAverage,
    title
  });
  itemContainer.append(thumbnail, infoContainer);
  return itemContainer;
};
const createInfoItem = ({ voteAverage, title: movieTitle }) => {
  const container = document.createElement("div");
  container.className = "item-desc";
  const rate = createRateItem(voteAverage);
  const title = document.createElement("strong");
  title.textContent = movieTitle;
  container.append(rate, title);
  return container;
};
const createRateItem = (voteAverage) => {
  const paragraph = document.createElement("p");
  paragraph.className = "rate";
  const starIcon = document.createElement("img");
  starIcon.className = "star";
  starIcon.src = starImage;
  const rateSpan = document.createElement("span");
  rateSpan.textContent = voteAverage;
  paragraph.append(starIcon, rateSpan);
  return paragraph;
};
const createMovieList = (itemList) => {
  const fragment = document.createDocumentFragment();
  fragment.append(...itemList.map(createMovieItem));
  return fragment;
};
const createSkeletonItem = () => {
  const list = document.createElement("li");
  list.className = "skeleton-item";
  const thumbnail = document.createElement("div");
  thumbnail.className = "skeleton-thumbnail";
  list.appendChild(thumbnail);
  return list;
};
const createSkeleton = (count = 20) => {
  const fragment = document.createDocumentFragment();
  fragment.append(...Array.from({ length: count }, createSkeletonItem));
  return fragment;
};
const removeSkeleton = () => {
  document.querySelectorAll(".skeleton-item").forEach((item) => item.remove());
};
const ERROR_API_MESSAGE = "예상하지 못한 오류가 발생했습니다. 일시적인 현상이거나 네트워크 문제일 수 있으니, 잠시 후 다시 시도해주세요.";
const BASE_URL = "https://api.themoviedb.org/3/";
class ApiClient {
  static async get(endpoint, headers2 = {}) {
    return this.request("GET", endpoint, null, headers2);
  }
  static async post(endpoint, body, headers2 = {}) {
    return this.request("POST", endpoint, body, headers2);
  }
  static async put(endpoint, body, headers2 = {}) {
    return this.request("PUT", endpoint, body, headers2);
  }
  static async delete(endpoint, headers2 = {}) {
    return this.request("DELETE", endpoint, null, headers2);
  }
  static async request(method, endpoint, body = null, headers2 = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers2
      },
      body: body ? JSON.stringify(body) : null
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
const headers = {
  Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWRjZjU0NWFlZmNlZWU3MjUyNjVlMjAyYzg3MmI1ZSIsIm5iZiI6MTc1ODgwNDk0NS4zMTEsInN1YiI6IjY4ZDUzYmQxN2UzOGNkMWZkODg4MjBkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WyH0uzXne9p57VtidDnVRu2y6nfbMnfkNQwImQWrkwc"}`
};
async function getPopularMovies(page = 1) {
  const endPoint = "movie/popular";
  const queries = new URLSearchParams({
    language: "ko-KR",
    page
  }).toString();
  return await ApiClient.get(`${endPoint}?${queries}`, headers);
}
addEventListener("load", async () => {
  const thumbnailList = document.querySelector("main .thumbnail-list");
  thumbnailList.appendChild(createSkeleton());
  let popularMovieListData;
  try {
    popularMovieListData = await getPopularMovies();
  } catch (error) {
    removeSkeleton();
    alert(ERROR_API_MESSAGE);
    return;
  }
  removeSkeleton();
  updateBanner(popularMovieListData.results[0]);
  const movieList = popularMovieListData.results;
  const pager = createPager();
  const popularMovieList = createMovieList(movieList);
  const moreButton = document.querySelector("main .more");
  setVisibililty(
    moreButton,
    popularMovieListData.total_pages > pager.getPage()
  );
  moreButton.addEventListener("click", async () => {
    moreButton.disabled = true;
    thumbnailList.appendChild(createSkeleton());
    let moreMovieListData;
    try {
      moreMovieListData = await getPopularMovies(pager.getNextPage());
    } catch (error) {
      removeSkeleton();
      alert(ERROR_API_MESSAGE);
      moreButton.disabled = false;
      return;
    }
    removeSkeleton();
    moreButton.disabled = false;
    setVisibililty(moreButton, moreMovieListData.total_pages > pager.getPage());
    const moreMovieList = createMovieList(moreMovieListData.results);
    thumbnailList.appendChild(moreMovieList);
  });
  thumbnailList.appendChild(popularMovieList);
});
const createPager = () => {
  let currentPage = 1;
  return {
    getPage: () => currentPage,
    getNextPage: () => ++currentPage
  };
};
const setVisibililty = (element, isVisible) => {
  element.classList.toggle("visible", isVisible);
};
