import styles from './Error.module.css';

type ErrorProps = {
  message: string;
};

function Error({ message }: ErrorProps) {
  return <span className={styles.error}>❌ {message}</span>;
}

export default Error;
