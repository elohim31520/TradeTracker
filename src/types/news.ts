
export interface NewsAttributes {
  id?: string;
  content: string;
  status: 'draft' | 'published' | 'archived'; // Assuming these are the possible statuses
  publishedAt?: Date;
  viewCount?: number;
  isTop?: boolean;
}
