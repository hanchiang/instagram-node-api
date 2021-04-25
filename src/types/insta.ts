export interface UnauthCookie {
  ig_did: string;
  csrftoken: string;
  mid: string;
  urlgen: string;
}

export interface AuthCookie extends UnauthCookie {
  // TODO: Make mandatory
  sessionid?: string;
  ds_user_id?: string;
  'x-ig-www-claim'?: string;
}
