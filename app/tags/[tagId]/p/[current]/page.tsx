import { Metadata } from 'next';
import { getList, getTag, getAllTagIds, getBlogTotalCount } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

export const dynamicParams = false;

type Props = {
  params: Promise<{
    tagId: string;
    current: string;
    name: string;
  }>;
};

export async function generateStaticParams() {
  const tagIds = await getAllTagIds();
  const params: { tagId: string; current: string }[] = [];
  for (const tagId of tagIds) {
    const total = await getBlogTotalCount(`tags[contains]${tagId}`);
    const maxPage = Math.ceil(total / LIMIT);
    for (let p = 2; p <= maxPage; p++) {
      params.push({ tagId, current: String(p) });
    }
  }
  return params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { tagId } = params;
  const tag = await getTag(tagId);
  return {
    title: tag.name,
    openGraph: {
      title: tag.name,
    },
    alternates: {
      canonical: `/tags/${params.tagId}/p/${params.current}`,
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId } = params;
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    filters: `tags[contains]${tagId}`,
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath={`/tags/${tagId}`} />
    </>
  );
}
