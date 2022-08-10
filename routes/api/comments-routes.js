const router = require('express').Router();

// import the controller methods
const {
    addComment,
    removeComment
} = require('../../controllers/comment-controller');

// set up POST route at api/comments/:pizzaId and use the addComment method
router.route('/:pizzaId').post(addComment);

// set up DELETE route at api/comments/:pizzaId/:commentId and use the removeComment method
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;