import { client } from '../utils/http';

export const getPosts = async (userId) => {
  const { data } = await client.get(`/posts?userId=${userId}`);

  return data;
};

export const getPostById = async (id) => {
  const { data } = await client.get(`/posts/${id}`);

  return data;
};
