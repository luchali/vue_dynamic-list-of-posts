import { client } from '../utils/http';

export const getComments = async (postId) => {
  const { data } = await client.get(`/comments?postId=${postId}`);

  return data;
};
