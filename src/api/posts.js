import { client } from '@utils/http';

export const getPosts = async () => {
  const { data } = await client.get('/posts');
  return data;
};
