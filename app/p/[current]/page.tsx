import { Metadata } from 'next';
import { getList, getBlogTotalCount } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

export const dynamicParams = false;

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export async function generateStaticParams() {
  const total = await getBlogTotalCount();
  const maxPage = Math.ceil(total / LIMIT);
  const params: { current: string }[] = [];
  for (let p = 2; p <= maxPage; p++) {
    params.push({ current: String(p) });
  }
  return params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    alternates: {
      canonical: `/p/${params.current}`,
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);
  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
  });
  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} />
    </>
  );
}
