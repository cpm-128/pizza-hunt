const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const PizzaSchema = new Schema({
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // get is a mongoose native to transform data
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    // the child collection is comments
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  // access virtuals
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// total count of comments and replies on retrieved pizza
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;