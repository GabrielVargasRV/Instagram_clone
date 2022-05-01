
export interface commentType {
  username: string;
  text: string;
  id: number;
  userPhoto: string;
}

export interface postType {
  username: string;
  userPhoto: string;
  id: string;
  photo: string;
  likes: [string];
  comments: [commentType];
  caption: string;
}