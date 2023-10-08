import React, { LegacyRef } from "react";

type InputProps = {
  type: string;
  name: string;
  id: string;
  error: boolean;
  disabled: boolean;
  inputRef?: LegacyRef<HTMLInputElement> | undefined;
  textareaRef?: LegacyRef<HTMLTextAreaElement> | undefined;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function Input({
  type,
  name,
  id,
  error,
  handleChange,
  disabled = false,
  inputRef = undefined,
  textareaRef = undefined,
}: InputProps) {
  return (
    <>
      {type !== "textarea" ? (
        <input
          type={type}
          name={name}
          onChange={handleChange}
          id={id}
          disabled={disabled}
          className={`border px-4 py-4 rounded-md font-lg
                placeholder-zinc-400 disabled:opacity-50 dark:disabled:opacity-80 focus:outline-none focus:ring-1 w-full invalid:border-red-500
                invalid:focus:border-red-500 invalid:focus:ring-red-500
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-sky-500 focus:ring-sky-500 border-zinc-200"
                }`}
          ref={inputRef}
        />
      ) : (
        <textarea
          cols={20}
          rows={6}
          name={name}
          id={id}
          onChange={handleChange}
          disabled={disabled}
          className={`border px-4 py-4 rounded-md font-lg
                placeholder-zinc-400 disabled:opacity-50 dark:disabled:opacity-80 focus:outline-none focus:ring-1 w-full resize-none invalid:border-red-500 finvalid:ocus:border-red-500 invalid:focus:ring-red-500 ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-sky-500 focus:ring-sky-500 border-zinc-200"
                }`}
          ref={textareaRef}
        ></textarea>
      )}
    </>
  );
}

export default Input;
