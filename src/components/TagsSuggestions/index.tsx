import React, { useEffect, useState, useRef, useCallback } from 'react';
import InputField from '../InputField';
import { AccountBalance } from '../../mock';
import { debounce, suggestionWidth } from '../../utils';
import styles from './TagsSuggestions.module.scss';

const TagsSuggestions = () => {
  const [display, setDisplay] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (text.length > 0) {
      setSuggestedTags(
        AccountBalance.filter(
          (suggest) =>
            suggest.toLowerCase().includes(text.toLowerCase()) &&
            !tags.includes(suggest.toLowerCase())
        )
      );
      setDisplay(true);
      return;
    }
    setDisplay(false);
  }, [text, tags]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (text && !tags.includes(text.toLowerCase())) {
        setTags((prevTags) => [...prevTags, text]);
        setText('');
      }
    }
  };

  const onAddTags = useCallback(
    (tag: string) => {
      if (!tags.includes(tag.toLowerCase())) {
        setTags((prevTags) => [...prevTags, tag]);
      }
      setText('');
      setDisplay(false);
      inputRef.current?.focus();
    },
    [tags]
  );

  const onDeleteTags = useCallback((index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }, []);

  const onClickOutside = useCallback((e: MouseEvent) => {
    if (
      inputWrapperRef.current &&
      !inputWrapperRef.current.contains(e.target as Node) &&
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node)
    ) {
      setDisplay(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [onClickOutside]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const updateSuggestionPosition = useCallback(() => {
    if (inputWrapperRef.current && suggestionsRef.current) {
      const inputRect = inputWrapperRef.current.getBoundingClientRect();
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

  return (
    <div className={styles.tagContent}>
      {tags.map((tag, index) => (
        <div key={index} className={styles.tagContentWrapper}>
          {tag}
          <div
            className={styles.tagContentWrapperRemoveTag}
            onClick={() => onDeleteTags(index)}
          >
            [X]
          </div>
        </div>
      ))}
      <div ref={inputWrapperRef} className={styles.tagContentInputWrapper}>
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
            {suggestedTags.map((tag, index) => (
              <div
                onClick={() => onAddTags(tag)}
                key={index}
                className={styles.tagSuggestionsText}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsSuggestions;
