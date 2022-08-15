const { Comment, Pizza } = require('../models');

const commentController = {

    // CREATE comment that BELONGS to a pizza (pizza is the parent)
    addComment({ params, body }, res) {
        console.log('>> add comment body >>', body);
        Comment.create(body)
            .then(({ _id }) => {
             console.log('>> comment id >>', _id)
             return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
             );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id.' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // CREATE a reply on a comment
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id.' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },

    // DELETE a reply from a comment
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.json(err));
    },

    // DELETE comment and then use its id to REMOVE it from the pizza it's associated with
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id.' });
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId},
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id.' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }

};

module.exports = commentController;