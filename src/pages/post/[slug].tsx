import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import { useCallback } from 'react';
import { getPrismicClient } from '../../services/prismic';

import { formatDate } from '../../utils.formatDate';
import styles from './post.module.scss';
import Comments from '../../components/Comments';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const WORDS_READ_PER_MINUTE = 200;

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const getTimeToRead = useCallback(() => {
    const contentAsText = RichText.asText(post.data.content);
    const totalOfWords = contentAsText?.split(/\s/)?.length ?? 0;
    const timeToRead = Math.floor(totalOfWords / WORDS_READ_PER_MINUTE);

    return `${timeToRead} min`;
  }, [post?.data?.content]);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.banner}>
          <img src={post.data.banner.url} alt="" />
        </div>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.postHeader}>
            <div>
              <FiCalendar />
              <time>{formatDate(post.first_publication_date)}</time>
            </div>
            <div>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div>
              <FiClock />
              <span>{getTimeToRead()}</span>
            </div>
          </div>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{
              __html: RichText.asHtml(post.data.content),
            }}
          />

          <Comments />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results
    .slice(0, 3)
    .map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30,
  };
};
