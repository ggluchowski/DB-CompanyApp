const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Product.countDocuments(); // zlicza liczbe dokumentow
    const rand = Math.floor(Math.random() * count); // losowa liczba z zakresu liczby dokumentow
    const prod = await Product.findOne().skip(rand); // pomija rand dokumentow i bierze pierwszy wskazany
    if (!prod) res.status(404).json({ message: 'Not found' });
    else res.json(prod);

  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) res.status(404).json({ message: 'Not found' });
    else res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name: name, client: client });
    await newProduct.save(); // metoda mongoose odpowiada insertOne
    res.json({ message: 'OK' });

  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putId = async (req, res) => {
  const { name, client } = req.body;

  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      await Product.updateOne({ _id: req.params.id }, { $set: { name: name, client: client } });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });

  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteId = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (prod) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};