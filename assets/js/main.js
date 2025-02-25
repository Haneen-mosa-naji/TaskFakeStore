const getCategories = async () => {
    const { data } = await axios.get('https://fakestoreapi.com/products/categories');
    return data;
};

const displayCategories = async () => {
    const categories = await getCategories();
    const result = categories.map(category =>
        `<div class='category'>
            <h2>${category}</h2>
            <button type="button">
                <a href="./details.html?category=${category}">See all products</a>
            </button>
        </div>`
    ).join('');
    document.querySelector(".Categories .row").innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");
};

displayCategories();

/** -------------------- Display Products with Fixed Pagination -------------------- **/
const productsPerPage = 4; // عدد المنتجات في كل صفحة
let currentPage = 1;
let allProducts = [];

const getAllProducts = async () => {
    try {
        const { data } = await axios.get('https://fakestoreapi.com/products');
        allProducts = data; 
        displayAllProducts(currentPage);
    } catch (error) {
        console.error("Error fetching products:", error);
        document.querySelector(".All-Products .row").innerHTML = "<p>Error loading products. Please try again later.</p>";
    }
};

const displayAllProducts = (page = 1) => {
    if (allProducts.length === 0) {
        document.querySelector(".All-Products .row").innerHTML = "<p>No products available.</p>";
        return;
    }

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const products = allProducts.slice(start, end);
    const result = products.map(item =>
        `<div class='item'>
            <div class="image-product">
                <img src="${item.image}" class="product-image" alt="${item.title}">
            </div>
            <div class="info-product">
                <h2>${item.category}</h2>  
                <button type="button"> 
                    <a href="./product.html?id=${item.id}">See details</a>
                </button>
            </div>
        </div>`
    ).join('');

    document.querySelector(".All-Products .row").innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");

    customModal();
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
    displayAllProducts(currentPage); 
};

const init = async () => {
    await getAllProducts(); 
};

getAllProducts();
init();

/** -------------------- Modal -------------------- **/
function customModal() {
    const model = document.querySelector(".my-modal");
    const closeBtn = document.querySelector(".close-btn");
    const leftBtn = document.querySelector(".left-arrow");
    const rightBtn = document.querySelector(".right-arrow");
    const images = Array.from(document.querySelectorAll(".product-image")); 
    let currentIndex = 0;

    images.forEach(function (img) {
        img.addEventListener("click", (e) => {
            model.classList.remove("d-none");
            model.querySelector("img").setAttribute("src", e.target.src);
            currentIndex = images.indexOf(e.target);
        });
    });

    closeBtn.addEventListener("click", () => {
        model.classList.add("d-none");
    });

    rightBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        const src = images[currentIndex].getAttribute("src");
        model.querySelector("img").setAttribute("src", src);  
    });

    leftBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        const src = images[currentIndex].getAttribute("src");
        model.querySelector("img").setAttribute("src", src);  
    });

    document.addEventListener("keydown", (e) => {
        if (e.code == "ArrowRight") {
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            const src = images[currentIndex].getAttribute("src");
            model.querySelector("img").setAttribute("src", src);
        } else if (e.code == "ArrowLeft") {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            const src = images[currentIndex].getAttribute("src");
            model.querySelector("img").setAttribute("src", src);
        } else if (e.code == "Escape") {
            model.classList.add('d-none');
        }
    });
}
