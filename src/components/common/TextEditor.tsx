import React, { useMemo } from "react";
import dynamic from "next/dynamic";

export default function TextEditor({ value, onChange, ...props }: IProps) {
  const quillRef = React.useRef<any>(false);

  function imgHandler() {
    const quill = quillRef.current.getEditor();
    let fileInput = quill.root.querySelector("input.ql-image[type=file]");

    if (fileInput === null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute(
        "accept",
        "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
      );
      fileInput.classList.add("ql-image");

      fileInput.addEventListener("change", () => {
        const files = fileInput.files;
        const range = quill.getSelection(true);

        if (!files || !files.length) {
          console.log("No files selected");
          return;
        }

        quill.insertEmbed(range.index, "image", files);
        quill.setSelection(range.index + 1);
        fileInput.value = "";
      });
      quill.root.appendChild(fileInput);
    }
    fileInput.click();
  }

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
        handlers: { image: imgHandler },
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
      onChange={onChange}
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
  onChange: any;
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
