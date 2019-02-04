function upsertUser(values) {
  return {
    text: `INSERT INTO users(user_id, username, fullname, num_posts, num_followers, num_following, average_likes, average_comments, is_private, is_verified, profile_pic_url, is_business_account, business_category_name, business_email, business_phone_number, business_address_json, rhx_gis, csrf_token, country_code, language_code, locale)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    ON CONFLICT(user_id)
    DO UPDATE SET user_id = EXCLUDED.user_id, username = EXCLUDED.username, fullname = EXCLUDED.fullname,   num_posts = EXCLUDED.num_posts, num_followers = EXCLUDED.num_followers, num_following = EXCLUDED.num_following, average_likes = EXCLUDED.average_likes, average_comments = EXCLUDED.average_comments, is_private = EXCLUDED.is_private, is_verified = EXCLUDED.is_verified, profile_pic_url = EXCLUDED.profile_pic_url, is_business_account = EXCLUDED.is_business_account, business_category_name = EXCLUDED.business_category_name, business_email = EXCLUDED.business_email, business_phone_number = EXCLUDED.business_phone_number, business_address_json = EXCLUDED.business_address_json, rhx_gis = EXCLUDED.rhx_gis, csrf_token = EXCLUDED.csrf_token, country_code = EXCLUDED.country_code, language_code = EXCLUDED.language_code, locale = EXCLUDED.locale
    `,
    values
  };
}

module.exports = { upsertUser };
