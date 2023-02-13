import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { mib2 } from "@/lib/setting";
import "react-quill/dist/quill.snow.css";
import { I_codeFile } from "@/lib/textEditor";

export default function TextEditor({ value, setValue, styles }: IProps) {
  const quillRef = React.useRef<any>(false);

  function imgHandler() {
    const quill = quillRef.current.getEditor();
    let fileInput = quill.root.querySelector("input.ql-image[type=file]");

    if (fileInput === null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("accept", "image/*");
      fileInput.classList.add("ql-image");

      fileInput.addEventListener("change", () => {
        const files = fileInput.files;
        const range = quill.getSelection(true);

        if (!files || !files.length) {
          console.log("No files selected");
          return;
        }

        if (files[0].size > mib2) {
          toast("2MiB 이하의 이미지를 사용해 주세요");
          return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = () => {
          quill.insertEmbed(range.index, "image", reader.result);
          quill.setSelection(range.index + 1);
          fileInput.value = "";
        };
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
          ["blockquote", "code", "code-block"],
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
      className={styles.quill}
      theme="snow"
      forwardedRef={quillRef}
      formats={formats}
      modules={modules}
      value={value}
      onChange={setValue}
    />
  );
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    let icons = RQ.Quill.import("ui/icons");
    icons["code-block"] = I_codeFile;

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
  styles: { readonly [key: string]: string };
}

const formats = [
  "size",
  "bold",
  "italic",
  "strike",
  "blockquote",
  "code",
  "code-block",
  "image",
  "link",
  "list",
  "bullet",
];


