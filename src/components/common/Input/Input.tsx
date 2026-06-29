import type { ReactNode } from 'react';

import styles from './Input.module.css';

interface InputProps {
  type: string;
  placeholder: string;
  value?: string;
  name?: string;
  changeHandler?: (value: string) => void;
}

function Input({
  type,
  placeholder,
  value,
  name,
  changeHandler,
}: InputProps): ReactNode {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={(e) => changeHandler(e.target.value)}
    />
  );
}

export default Input;
