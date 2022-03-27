const db = require('../../database/models');
const sequelize = db.sequelize;

const productsController = {
    'list': (req, res) => {
        let mangas = db.Product.count({
            where: { category: "Mangas" }
        });
        let comics = db.Product.count({
            where: { category: "Comics" }
        });
        let libros = db.Product.count({
            where: { category: "Libros" }
        });

        Promise.all([mangas, comics, libros])
        .then(data => {
            db.Product.findAll()
            .then(allProducts => {
                let products = [];
                allProducts.forEach(data => {
                    let product = {
                        id: data.id,
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        stock_min: data.stock_min,
                        stock_max: data.stock_max,
                        categories_id: data.categories_id,
                        sizes_id: data.sizes_id,
                        detail_id: data.detail_id,
                        editorials_id: data.editorials_id,
                        states_id: data.states_id,
                    };
                    products.push(product);
                })
                let countCategories = [
                    {
                        name: "Comics",
                        amount: data[0]
                    },
                    {
                        name: "Mangas",
                        amount: data[1]
                    },
                    {
                        name: "Libros",
                        amount: data[2]
                    }
                ]
                res.status(200).json( {
                    meta: {
                        status:200,
                        count: products.length,
                        countByCategory: countCategories,
                        url: "api/products"
                    },
                    products
                })
            })
        })
    },
    'detail': (req, res) => {
        db.Product.findByPk(req.params.id)
            .then(data => {

                let product = {
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    stock_min: data.stock_min,
                    stock_max: data.stock_max,
                    categories_id: data.categories_id,
                    sizes_id: data.sizes_id,
                    editorials_id: data.editorials_id,
                    states_id: data.states_id,
                    detail: `http://localhost:3000/products/detailProduct/${data.id}`
                };
                res.status(200).json( {
                    meta: {
                        status:200,
                        url: "api/products/:id"
                    },
                    product
                });
            });
    }
}

module.exports = productsController;