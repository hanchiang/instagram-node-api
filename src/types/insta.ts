export interface UnauthCookie {
  ig_did: string;
  csrftoken: string;
  mid: string;
}

export interface AuthCookie extends UnauthCookie {
  sessionid: string;
  ds_user_id: string;
  'x-ig-www-claim'?: string;
}
