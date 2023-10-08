type LabelProps = {
  text: string
  htmlFor: string
};

function Label({ htmlFor, text }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-base font-semibold dark:text-zinc-100"
    >
      {text} <span className="text-red-600 dark:text-red-400">*</span>
    </label>
  );
}

export default Label;
