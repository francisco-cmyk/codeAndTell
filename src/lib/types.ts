export type MediaType = {
  mediaSource: string;
  mediaSize: number;
  mediaName: string;
  mediaType: string;
  mediaUrl: string;
};

export type MediaPayload = {
  mediaSource: string[] | null;
  mediaType: string[] | null;
  mediaSize: number[] | null;
  mediaName: string[] | null;
};

export type PostType = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  createdById: string;
  updatedById: string | null;
  title: string;
  description: string;
  badges: string[];
  getHelp: boolean | null;
  media: MediaType[];
  profile: {
    id: string;
    avatarURL: string;
    name: string;
    contactInfo: string;
  };
  commentCount: number;
  comments: {
    id: number;
    userID: string;
    content: string;
    createdAt: string;
    likeCount: number;
    parentCommentID: number | null;
    userHasLiked: boolean;
    profile: {
      id: string;
      avatarURL: string;
      name: string;
      contactInfo: string;
    };
  }[];
};

export type CommentType = {
  id: number;
  userID: string;
  content: string;
  postID: string;
  parentCommentID: number | null;
  createdAt: string;
  profile: {
    id: string;
    avatarURL: string;
    name: string;
    contactInfo: string;
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
      contactInfo: string;
    };
  };
};

export type Tags = {
  value: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type NotificationType = {
  id: number;
  userID: string;
  postID: string;
  commentID: number;
  type: string;
  read: boolean;
  createdAt: string;
  createdByID: string;
  profile: {
    id: string;
    avatarURL: string;
    name: string;
    contactInfo: string;
  };
};

export type UserType = {
  id: string;
  name: string;
  preferredName: string;
  userName: string;
  avatarUrl: string;
  bio: string;
  email: string;
  contactInfo: string;
  role: string;
  lastSignInAt: string;
  provider: string;
  providers: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
};
