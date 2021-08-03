import { useUtterances } from '../../hooks/useUterances';
import styles from './styles.module.scss';

const commentNodeId = 'comments';

export function Comments(): JSX.Element {
  useUtterances(commentNodeId);
  return <div className={styles.comments} id={commentNodeId} />;
}

export default Comments;
