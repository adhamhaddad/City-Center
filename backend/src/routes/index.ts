import { Router } from 'express';
import {
  auth,
  users,
  profilePictures,
  phones,
  birthDates,
  usersCity,
  colleges,
  jobs,
  groups,
  groupMembers,
  posts,
  postLikes,
  postComments,
  rooms,
  roomMembers
} from './api';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/phones', phones);
router.use('/profile-pictures', profilePictures);
router.use('/birth-dates', birthDates);
router.use('/users-city', usersCity);
router.use('/colleges', colleges);
router.use('/jobs', jobs);
router.use('/groups', groups);
router.use('/group-members', groupMembers);
router.use('/posts', posts);
router.use('/post-likes', postLikes);
router.use('/post-comments', postComments);
router.use('/rooms', rooms);
router.use('/room-members', roomMembers);

export default router;
