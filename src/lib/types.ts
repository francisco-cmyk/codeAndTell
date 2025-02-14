export type PostType = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  createdById: string | null;
  updatedById: string | null;
  title: string | null;
  description: string | null;
  badges: string[];
  mediaSource: string[];
  mediaSize: number[];
  mediaName: string[];
  mediaType: string[];
  mediaUrl: string[];
  profile: {
    id: string;
    avatarURL: string;
    name: string;
  };
  comments: {
    id: number;
    userID: string;
    content: string;
    parentCommentID: string | null;
    createdAt: string | null;
    profile: {
      id: string;
      avatarURL: string;
      name: string;
    };
  }[];
};

export type SinglePostType = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  createdById: string | null;
  updatedById: string | null;
  title: string | null;
  description: string | null;
  badges: string[];
  mediaSource: string[];
  mediaSize: number[];
  mediaName: string[];
  mediaType: string[];
  mediaUrl: string[];
};

export type CommentType = {
  id: number;
  userID: string;
  content: string;
  postID: string;
  parentCommentID: string | null;
  createdAt: string | null;
  profile: {
    id: string;
    avatarURL: string;
    name: string;
  };
  post: {
    createdAt: string;
    description: string;
    id: string;
    title: string;
    author: {
      id: string;
      avatarURL: string;
      name: string;
    };
  };
};

export type Tags = {
  value: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type MediaPayload = {
  mediaSource: string[] | null;
  mediaType: string[] | null;
  mediaSize: number[] | null;
  mediaName: string[] | null;
};
