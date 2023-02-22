import {
  getUploadURL,
  IGetUploadURL,
  IUploadImageVariables,
  IUploadURLResponse,
  uploadImage,
} from "@/api/fileUpload";
import { postAnswer } from "@/api/qna";
import TextEditor from "@/components/common/TextEditor";
import { base64toFile } from "@/lib/textEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddAnswerSec.module.scss";

interface IProps {
  questionId: string;
}

export default function AddAnswerSec({ questionId }: IProps) {
  const queryClient = useQueryClient();

  const [content, setContent] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const getUploadURLMutation = useMutation(getUploadURL, {
    onSuccess: async (data: IUploadURLResponse, props: IGetUploadURL) => {
      await uploadImageMutation.mutateAsync({
        file: props.file,
        uploadURL: data.uploadURL,
        editorSrc: props.editorSrc,
      });
    },
  });

  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: ({ result }: any, props: IUploadImageVariables) => {
      const uploadSrc = result.variants[0];

      let content = watch("content");
      content = content.replace(props.editorSrc, uploadSrc);
      setValue("content", content);
    },
  });

  const postAnswerMutation = useMutation(postAnswer, {
    onSuccess: (res) => {
      console.log(res);
      reset;
      queryClient.refetchQueries(["postQuery", `${questionId}`]);
    },
  });

  async function uploadImgFile() {
    if (!(content && content.ops)) return;

    let ops = content.ops;

    await Promise.all(
      ops?.map(async (v: any, i: number) => {
        if (!(v.insert && v.insert.image)) return;
        const editorSrc = v.insert.image;

        if (editorSrc.startsWith("data:image/")) {
          const file = base64toFile(editorSrc, `${i}`);
          await getUploadURLMutation.mutateAsync({ file, editorSrc });
        }
      })
    );
  }

  async function onSubmit() {
    await uploadImgFile();
    let content = watch("content");
    postAnswerMutation.mutate({ questionId: `${questionId}`, content });
  }

  useEffect(() => {
    if (!register) return;

    register("content", { required: true, minLength: 20 });
  }, [register]);

  return (
    <section className={styles.addAnswerSec}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>답변 남기기</h1>
      </article>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextEditor
          styles={styles}
          value={watch("content")}
          setValue={(value: string, delta: any, source: any, editor: any) => {
            setValue("content", value);
            setContent(editor.getContents());
          }}
        />

        <button className={styles.postBtn}>답변 남기기</button>
      </form>
    </section>
  );
}
