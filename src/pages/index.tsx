import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import { Post } from '../components/Post';

import styles from './home.module.scss';

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
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  async function fetchNextPage(): Promise<void> {
    await fetch(postsPagination.next_page);
  }

  return (
    <>
      <main className={styles.contentContainer}>
        {postsPagination?.results?.map(post => (
          <Post
            uid={post.uid}
            key={post.uid}
            time={post.first_publication_date}
            data={post.data}
          />
        ))}
        <button type="button" onClick={fetchNextPage}>
          Carregar mais posts
        </button>
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
      pageSize: 50,
    }
  );

  console.log(
    'postsResponse',
    postsResponse.results.map(post => post)
  );

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse?.results?.map(post => ({
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
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
