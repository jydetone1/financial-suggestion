import React, { forwardRef, ChangeEventHandler } from 'react';

export type InputFieldProps = {
  name: HTMLInputElement['name'];
  value: HTMLInputElement['value'];
  type?: HTMLInputElement['type'];
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className: HTMLInputElement['className'];
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      name,
      value = '',
      type = 'text',
      onChange,
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    return (
      <input
        {...props}
        data-testid='input-field'
        autoComplete='off'
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className={className}
        onKeyDown={onKeyDown}
        ref={ref}
      />
    );
  }
);

export default React.memo(InputField);
