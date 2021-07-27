import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './post.module.scss';

interface PostProps {
  time: string;
  uid: string;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export function Post({ data, time, uid }: PostProps): JSX.Element {
  return (
    <Link href={`/post/${uid}`}>
      <a>
        <div className={styles.post}>
          <h1>{data.title}</h1>
          <span>{data.subtitle}</span>
          <div className={styles.postFooter}>
            <div className={styles.time}>
              <FiCalendar size={20} />
              <time>{time}</time>
            </div>
            <div className={styles.author}>
              <FiUser size={20} />
              <span>{data.author}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
