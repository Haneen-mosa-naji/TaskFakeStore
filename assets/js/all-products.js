const productsPerPage = 3; // عدد المنتجات في كل صفحة
let currentPage = 1;
let allProducts = [];

const getCategoryProducts = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    const { data } = await axios.get(`https://fakestoreapi.com/products`);
    
    return category ? data.filter(product => product.category === category) : data;
};

const displayProducts = () => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const products = allProducts.slice(start, end);

    const result = products.map((product) => {
        const stars = getStars(product.rating.rate);
        
        return `
        <div class="product">
            <div class="image-product"> 
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="info-product">
                <h2>${product.title}</h2>
                <p>${product.price} $</p>
                <p>${product.description}</p>
                <p>Category: ${product.category}</p>
                <div class="stars">${stars}</div>
                <div class="review-text">Based on <span class="review-count">${product.rating.count}</span> reviews</div>
            </div>
        </div>`;
    }).join('');

    document.querySelector(".all-products .row").innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");

    displayPagination();
};

const displayPagination = () => {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    let paginationHTML = "";

    if (currentPage > 1) {
        paginationHTML += `<button class="arrow-btn" onclick="changePage(1)"><<</button>`;
        paginationHTML += `<button class="arrow-btn" onclick="changePage(${currentPage - 1})"><</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (currentPage < totalPages) {
        paginationHTML += `<button class="arrow-btn" onclick="changePage(${currentPage + 1})">></button>`;
        paginationHTML += `<button class="arrow-btn" onclick="changePage(${totalPages})">>></button>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const changePage = (page) => {
    currentPage = page;
    displayProducts();
};

const init = async () => {
    allProducts = await getCategoryProducts();
    displayProducts();
};

function getStars(rating) {
    const fullStar = "★";
    const emptyStar = "☆";
    const roundedRating = Math.round(rating); 
    return fullStar.repeat(roundedRating) + emptyStar.repeat(5 - roundedRating);
}

init();
