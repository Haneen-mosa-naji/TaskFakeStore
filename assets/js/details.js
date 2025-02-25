const getCategories = async () => {
    const {data} = await axios.get('https://fakestoreapi.com/products/categories');
    return data;
}

 const displayCategories = async () => {
    const categories = await getCategories();
    const result = categories.map(category =>
        `<div class='category'>
            <h2>${category}</h2>
            <button type="button"> <a href="./details.html?category=${category}">See all products</a></button>
        </div>`
    ).join('');
    document.querySelector(".Categories .row").innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");

}

displayCategories();


const getCategoryProducts = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category');
    
    const {data} = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
    return data;
}

const displayProducts = async () => {
    const products = await getCategoryProducts();

    const result = products.map((product) =>
        `
    <div class="product">
            <div class="image-product"> 
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="info-product">
                <h2>${product.title}</h2>
                <p>${product.price} $</p>
              <button type="button"> <a href="./product.html?id=${product.id}">See details</a></button>
             

            </div>
        </div>`
        
    ).join('');

    console.log(products);
    document.querySelector(".Products .row" ).innerHTML = result;
    document.querySelector(".loading").classList.add("d-none");

}

displayProducts();