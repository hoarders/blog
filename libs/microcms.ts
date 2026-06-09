import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

// タグの型定義
export type Tag = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

// ライターの型定義
export type Writer = {
  name: string;
  profile: string;
  image?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

// ブログの型定義
export type Blog = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  tags?: Tag[];
  writer?: Writer;
};

export type Article = Blog & MicroCMSContentId & MicroCMSDate;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// Initialize Client SDK.
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Blog>({
      endpoint: 'blog',
      queries,
    })
    .catch(notFound);
  return listData;
};

// ブログの詳細を取得
export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Blog>({
      endpoint: 'blog',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// タグの一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Tag>({
      endpoint: 'tags',
      queries,
    })
    .catch(notFound);

  return listData;
};

// タグの詳細を取得
export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Tag>({
      endpoint: 'tags',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// 全ブログ記事の contentId を取得（generateStaticParams 用）
export const getAllBlogIds = async (): Promise<string[]> => {
  const PAGE = 100;
  const ids: string[] = [];
  let offset = 0;
  while (true) {
    const { contents, totalCount } = await client.getList<Blog>({
      endpoint: 'blog',
      queries: { limit: PAGE, offset, fields: ['id'] },
    });
    ids.push(...contents.map((c) => c.id));
    if (ids.length >= totalCount) break;
    offset += PAGE;
  }
  return ids;
};

// 全タグの contentId を取得（generateStaticParams 用）
export const getAllTagIds = async (): Promise<string[]> => {
  const PAGE = 100;
  const ids: string[] = [];
  let offset = 0;
  while (true) {
    const { contents, totalCount } = await client.getList<Tag>({
      endpoint: 'tags',
      queries: { limit: PAGE, offset, fields: ['id'] },
    });
    ids.push(...contents.map((c) => c.id));
    if (ids.length >= totalCount) break;
    offset += PAGE;
  }
  return ids;
};

// ブログ記事の総件数を取得（ページネーション計算用）
export const getBlogTotalCount = async (filters?: string): Promise<number> => {
  const queries: MicroCMSQueries = { limit: 1, fields: ['id'] };
  if (filters) queries.filters = filters;
  const { totalCount } = await client.getList<Blog>({
    endpoint: 'blog',
    queries,
  });
  return totalCount;
};
