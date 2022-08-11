const router = require('express').Router();

// import the controller methods
const {
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// set up POST route at api/comments/:pizzaId and use the addComment method
router.route('/:pizzaId').post(addComment);

// api/comments/:pizzaId/:commentId
// use the removeComment method on a delete request
// use the addReply method on a put request
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);

// api/comments/:pizzaId/:commentId/:replyId
// delete a reply from a comment
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;