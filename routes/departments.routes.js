const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');

router.get('/departments', async (req, res) => {
  try {
    res.json(await Department.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments(); // zlicza liczbe dokumentow
    const rand = Math.floor(Math.random() * count); // losowa liczba z zakresu liczby dokumentow
    const dep = await Department.findOne().skip(rand); // pomija rand dokumentow i bierze pierwszy wskazany
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);

  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save(); // metoda mongoose odpowiada insertOne
    res.json({ message: 'OK' });

  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put('/departments/:id', async (req, res) => {
  const { name } = req.body;

  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      // const modDep = await Department.updateOne({ _id: req.params.id }, { $set: { name: name } });

      // lub zamiast await Department.updateOne
      dep.name = name;
      await dep.save();

      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      await Department.deleteOne({ _id: req.params.id });
      // res.send('usuwam: ' + dep);
      res.json(dep);
    }
    else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;