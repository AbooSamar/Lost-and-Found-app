import api from "./axios";

//get all posts
export const getAllPosts = async () => {
  const { data } = await api.get("/api/v1/posts");
  return data;
};

//get a post by id
export const getPostById = async (id) => {
  const { data } = await api.get(`/api/v1/posts/${id}`);
  return data;
};

//Get logged-in user's posts
export const getMyPosts = async () => {
  const { data } = await api.get("/api/v1/posts/my-posts");
  return data;
};

//Mark post as resolved
export const resolvePost = async (id) => {
  const { data } = await api.patch(`/api/v1/posts/${id}/resolve`);
  return data.post; // backend must return updated post
};

//Delete post
export const deletePost = async (id) => {
  const { data } = await api.delete(`/api/v1/posts/${id}`);
  return data;
};

//create post
export const createPost = async (payload) => {
  const { data } = await api.post("/api/v1/posts", payload);
  return data;
};

//get all resolved posts only
export const getResolvedPosts = async () => {
  const { data } = await api.get("/api/v1/posts/get-resolved");
  return data;
};

//update post
export const updatePost = async (id, payload) => {
  const { data } = await api.put(`/api/v1/posts/${id}`, payload);
  return data;
};