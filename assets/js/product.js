const getProducts = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idnum = urlParams.get('id');
    
    const {data} = await axios.get(`https://fakestoreapi.com/products/${idnum}`);
    return data; 
}

const displayProductsDetails = async () => {
    const product = await getProducts();
    const stars = getStars(product.rating.rate);

    const result = `
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

    document.querySelector(".Products-Details .row").innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");

}

function getStars(rating) {
    const fullStar = "★";
    const emptyStar = "☆";
    const roundedRating = Math.round(rating); 
    return fullStar.repeat(roundedRating) + emptyStar.repeat(5 - roundedRating);
}

displayProductsDetails();