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
  mediaSize: number;
  mediaName: string;
  mediaType: string;
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
  }[];
};

export type Tags = {
  value: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};
