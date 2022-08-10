const { Pizza } = require('../models');

const pizzaController = {

  // GET all pizzas method
  getAllPizza(req, res) {
    // referencing the Pizza model using the mongoose 'find' method
    Pizza.find({})
        // populate the comments with the commentBody, not just commentId
        .populate({
            path: 'comments',
            select: '-__v' // - minus the version field
        })
        .select('-__v')
        // mongoose sort method, descending by id aka newest first
        .sort({ _id: -1 })
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
  },

  // GET single pizza by id method
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
        // populate the comment with commentBody
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
            // if no pizza, send 404 error
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
  },

  // CREATE pizza or pizzas, thanks to Mongoose capability
  createPizza({ body }, res) {
    Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
  },

  // PUT UPDATE single pizza by id
  updatePizza({ params, body }, res) {
    // new: true is necessary to return the updated document. else, returns original
    // where clause must be first (id), then the updated data (body)
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
  },

  // DELETE single pizza by id
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id.' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
  }

};

module.exports = pizzaController;