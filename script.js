const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");

const apiKey = "qp2flhTq9rlni7PnCH3kjrzYwJ2Z3lt4RrbuwKioJUql89kMOlKjnKFY"
const perPage = 30;
let currentPage = 1;

let searchTerm = null;

const downloadImage = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"))

}


const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card">
        <a href="${img.src.large2x}" target="_blank">
            <img src="${img.src.large2x}" alt="">
        </a>
        <button onclick="downloadImage('${img.src.large2x}')">
            <i class="bi bi-download"></i>
        </button>
        </li>`
    ).join("");
}

const getImages = (apiURL) => {
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.add("disabled");
    })
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL)
}

const loadSearchImages = (e) => {
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        if (searchTerm == "") {
            getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
        }
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)

    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)

loadMoreBtn.addEventListener("click", loadMoreImages)
searchInput.addEventListener("keyup", loadSearchImages)
