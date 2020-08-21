export interface User {
  id: string;
  username: string;
  fullname: string;
  numPosts: number;
  numFollowers: number;
  numFollowing: number;
  averageLikes?: number;
  averageComments?: number;
  isPrivate: boolean;
  isVerified: boolean;
  profilePicUrl: string;
  isBusinessAccount: boolean;
  businessCategory: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: JSON;
  csrfToken: string;
  countryCode: string;
  languageCode: string;
  locale: string;
  userSharedData?: any;
  userWebData?: any;
}

export interface ProfileStats {
  averageLikes: number;
  averageComments: number;
}
