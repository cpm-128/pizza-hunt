const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const PizzaSchema = new Schema({
    pizzaName: {
      type: String,
      required: 'You must enter a pizza name.',
      trim: true
    },
    createdBy: {
      type: String,
      required: 'You must enter a chef for this pizza.',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // get is a mongoose native to transform data
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;