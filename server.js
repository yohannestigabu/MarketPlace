const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Marketplace', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to DressStore Application.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const Product = mongoose.model('Product', new mongoose.Schema({
name: {
    type: String,
    required: true
},
description: String,
price: {
    type: Number,
    required: true
},
quantity: {
    type: Number,
    default: 1
}
}));

const Category = mongoose.model('Category', new mongoose.Schema({
    name: String
}));



const ProductController = {
    getAll: async (req, res) => {
        try {
            let products;

            // Check if name query parameter exists
            if (req.query.name) {
                products = await Product.find({ name: req.query.name });
            } else {
                products = await Product.find();
            }

            res.json(products);
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    },

    getById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if(!product) return res.status(404).json({message: "Product not found"});
            res.json(product);
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    },

    add: async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            const savedProduct = await newProduct.save();
            res.json(savedProduct);
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    },

    update: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!updatedProduct) return res.status(404).json({message: "Product not found"});
            res.json(updatedProduct);
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    },

    delete: async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if(!deletedProduct) return res.status(404).json({message: "Product not found"});
            res.json({message: "Product deleted"});
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }
};

app.use(bodyParser.json());

// Get all products
app.get('/product', ProductController.getAll);

// Get a single product by ID
app.get('/product/:id', ProductController.getById);

// Add a new product
app.post('/product', ProductController.add);

// Update a product by ID
app.put('/product/:id', ProductController.update);

// Delete a product by ID
app.delete('/product/:id', ProductController.delete);


const seedProducts = async () => {
    const products = [
        {
            name: "Jacket",
            description: "Leather Jacket with Fur",
            price: 100,
            quantity: 10,
            category: "Men"
        },
        {
            name: "Sweater",
            description: "Warm wool sweater",
            price: 50,
            quantity: 20,
            category: "Women"
        },
        {
            name: "Jeans",
            description: "Blue denim jeans",
            price: 40,
            quantity: 50,
            category: "Men"
        },
        {
            name: "Dress",
            description: "Summer floral dress",
            price: 80,
            quantity: 15,
            category: "Women"
        },
        {
            name: "Shoes",
            description: "Running shoes",
            price: 60,
            quantity: 25,
            category: "Unisex"
        },
        {
            name: "Hat",
            description: "Baseball cap",
            price: 20,
            quantity: 30,
            category: "Men"
        }
    ];

    try {
        for(let product of products) {
            const newProduct = new Product(product);
            await newProduct.save();
        }
        console.log('Products seeded successfully!');
    } catch(err) {
        console.error('Error seeding products:', err.message);
    }
};

seedProducts();






