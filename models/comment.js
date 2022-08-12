const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema (
    {
        // set a custom id, instead of default _id, to avoid confusion with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            trim: true,
            required: 'You must include a reply message in order to reply.'
        },
        writtenBy: {
            type: String,
            required: 'You must enter an author name.'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: 'You must enter an author name.'
        },
        commentBody: {
            type: String,
            required: 'You must include a comment message in order to comment.'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // populate associated replies
        // replies are nested directly, not referred to
        replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

// VIRTUAL: total count of replies per comment
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;