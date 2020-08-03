import { AnyNaptrRecord } from 'dns';

class UserViral {
  currScrapeCount: number;
  posts: any[];
  viralPosts: any[];
  userId: string;
  isPrivate: boolean;
  username: string;
  numPosts: number;
  numFollowers: number;
  numFollowing: number;
  averageLikes: number;
  averageComments: number;
  medianLikes: number;
  medianComments: number;
  totalLikes: number;
  totalComments: number;
  userSharedData: any;
  userWebData: any;

  constructor() {
    this.init();
  }

  init() {
    // viral info
    this.currScrapeCount = 0;
    this.posts = [];
    this.viralPosts = [];
    // user info
    this.userId = '';
    this.isPrivate = false;
    this.username = '';
    this.numPosts = 0;
    this.numFollowers = 0;
    this.numFollowing = 0;
    this.averageLikes = 0;
    this.averageComments = 0;
    this.medianLikes = 0;
    this.medianComments = 0;
    this.totalLikes = 0;
    this.totalComments = 0;
    // from window._sharedData object in user profile page
    this.userSharedData = {};
    // User-specific data from userSharedData
    this.userWebData = {};
  }
}

export default UserViral;
