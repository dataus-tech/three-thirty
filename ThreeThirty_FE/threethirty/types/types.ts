export interface PostType {
  post_id: number;
  user_id: number;
  nick_name: string;
  image_url: string;
  post_content: string;
  update_date: null | string;
  like_count: number;
  hate_count: number;
  comment_count: number;
  company_title: string;
  hashtag_content: string[];
  attach_file_url: string[];
  like_status: number;
  hate_status: number;
}
