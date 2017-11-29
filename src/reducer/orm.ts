import {ORM} from 'redux-orm';
import User from '../containers/login/UserModel';
import Post from '../containers/posts/PostModel';
import Comment from '../containers/comments/CommentModel';
import Label from '../containers/labels/LabelModel';

export const orm = new ORM();
orm.register(User, Post, Comment, Label);

export default orm;