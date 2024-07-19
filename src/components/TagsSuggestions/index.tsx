import React, { useEffect, useRef, useCallback } from 'react';
import { useTagsStore } from '../../useTagsStore';
import InputField from '../InputField';
import { useQuery } from 'react-query';
import { debounce, suggestionWidth, apiRequest } from '../../utils';
import styles from './TagsSuggestions.module.scss';

const TagsSuggestions = () => {
  const {
    tags,
    addTag,
    deleteTag,
    text,
    setText,
    display,
    setDisplay,
    onClickEdit,
    updateTag,
    setEditText,
    editText,
    editingIndex,
  } = useTagsStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: suggestedTags = [], refetch } = useQuery(
    'autocomplete',
    async () => {
      const response = await fetch(apiRequest);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    }
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingIndex !== null) {
        updateTag(editingIndex, editText);
        onClickEdit(null);
      } else if (text && !tags.includes(text.toLowerCase())) {
        addTag(text);
        setText('');
      }
    }
  };

  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setDisplay(false);
      }
    },
    [setDisplay]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [onClickOutside]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setDisplay(true);
    refetch();
  };

  const onChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const updateSuggestionPosition = useCallback(() => {
    if (inputRef.current && suggestionsRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = suggestionWidth;
      const spaceOnRight = viewportWidth - inputRect.left;
      const leftPosition =
        spaceOnRight >= dropdownWidth
          ? inputRect.left
          : viewportWidth - dropdownWidth - 20;

      suggestionsRef.current.style.top = `${inputRect.bottom}px`;
      suggestionsRef.current.style.left = `${leftPosition}px`;
      suggestionsRef.current.style.width = `${dropdownWidth}px`;
    }
  }, []);

  useEffect(() => {
    if (display) {
      updateSuggestionPosition();
      const debouncedUpdate = debounce(updateSuggestionPosition, 100);
      window.addEventListener('resize', debouncedUpdate);
      window.addEventListener('scroll', debouncedUpdate);

      return () => {
        window.removeEventListener('resize', debouncedUpdate);
        window.removeEventListener('scroll', debouncedUpdate);
      };
    }
  }, [display, updateSuggestionPosition]);

  const onAddTagFromSuggestion = (tag: string) => {
    addTag(tag);
    setText('');
    setDisplay(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.tagContent}>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tagContentWrapper}>
          {tag}
          <div className={styles.tagContentWrapperEditTag}>
            {editingIndex === index ? (
              <InputField
                value={editText}
                name='tags'
                onChange={onChangeEdit}
                onKeyDown={onKeyDown}
                ref={inputRef}
                className={styles.tagContentInputWrapperEditInput}
              />
            ) : (
              <div onClick={() => onClickEdit(index)}> [x] </div>
            )}
            <div
              className={styles.tagContentWrapperRemoveTag}
              onClick={() => deleteTag(index)}
            >
              x
            </div>
          </div>
        </div>
      ))}
      <div className={styles.tagContentInputWrapper}>
        <InputField
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={onChange}
          value={text}
          name='tags'
          className={styles.tagContentInputWrapperInput}
        />
      </div>

      {display && Boolean(suggestedTags.length) && (
        <div
          ref={suggestionsRef}
          className={styles.tagContentSuggestionWrapper}
        >
          <div className={styles.tagContentSuggestionWrapperItems}>
            {suggestedTags.map((tag: { category: string }, index: number) => (
              <div
                onClick={() => onAddTagFromSuggestion(tag.category)}
                key={index}
                className={styles.tagSuggestionsText}
              >
                {tag.category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsSuggestions;
