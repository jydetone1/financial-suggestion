import React from 'react';
import styles from './index.module.scss';
import TagsSuggestions from './components/TagsSuggestions';

const AutocompleteInput = () => {
  return (
    <div className={styles.container}>
      <TagsSuggestions />
    </div>
  );
};

export default AutocompleteInput;
