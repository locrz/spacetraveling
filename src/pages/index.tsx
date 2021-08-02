import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import { Post as PostComponent } from '../components/Post';
import styles from './home.module.scss';
import { formatDate } from '../utils.formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function fetchNextPage(): Promise<void> {
    const { next_page, results } = await (await fetch(nextPage)).json();
    setNextPage(next_page);
    setPosts(prev => [...prev, ...results]);
  }

  return (
    <>
      <main className={styles.contentContainer}>
        {posts.map(post => (
          <PostComponent
            uid={post.uid}
            key={post.uid}
            data={post.data}
            time={formatDate(post.first_publication_date)}
          />
        ))}
        {!!nextPage && (
          <button type="button" onClick={fetchNextPage}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse?.results?.map(post => ({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      // first_publication_date: new Date(
      //   post.first_publication_date
      // ).toLocaleDateString('pt-BR', {
      //   day: '2-digit',
      //   month: 'long',
      //   year: 'numeric',
      // }),
      data: {
        title: post.data.title,
        author: post.data.author,
        subtitle: post.data.subtitle,
      },
    })),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
