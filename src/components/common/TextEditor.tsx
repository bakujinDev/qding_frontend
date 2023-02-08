import React, { useMemo } from "react";
import dynamic from "next/dynamic";

export default function TextEditor({ value, setValue, ...props }: IProps) {
  const quillRef = React.useRef<any>(false);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    }),
    []
  );

  return (
    <ReactQuill
      theme="snow"
      forwardedRef={quillRef}
      formats={formats}
      modules={modules}
      value={value}
      onChange={setValue}
      {...props}
    />
  );
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  }
);

interface IProps {
  value: any;
  setValue: Function;
}

const formats = [
  "header",
  "bold",
  "italic",
  "code-block",
  "image",
  "link",
  "list",
  "bullet",
];
