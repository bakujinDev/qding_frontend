import styles from "./editAnswer.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Seo from "../../../../../components/Seo";
import TextEditor from "../../../../../components/common/TextEditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUploadURL,
  IGetUploadURL,
  IUploadImageVariables,
  IUploadURLResponse,
  uploadImage,
} from "../../../../../api/fileUpload";
import { base64toFile } from "../../../../../lib/textEditor";
import { extractContent } from "../../../../../lib/forum";
import { useRouter } from "next/router";
import U_spinner from "../../../../../asset/util/U_spinner.svg";
import { useSelector } from "react-redux";
import { AppState } from "../../../../../store/store";
import { toast } from "react-toastify";
import { editAnswer, getAnswer, IAnswerForm } from "../../../../../api/qna/answer";

export default function EditPost() {
  const router = useRouter();

  const { answerId } = router.query;
  const user = useSelector((state: AppState) => state.common.userInfo);

  const [contentObj, setContentObj] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IAnswerForm>();

  const postQuery = useQuery(["answer", `${answerId}`], getAnswer, {
    retry: false,
    onSuccess: (res) => {
      console.log(res);

      // 작성자만 수정할 수 있는 현재방식에서만 쓰임
      if (res.creator?.id !== user?.pk) {
        toast("작성자만 수정할 수 있습니다");
        router.push("/");
      }

      setValue("content", res.content);
    },
  });

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
      content = content.replace(props.editorSrc || "", uploadSrc);
      setValue("content", content);
    },
  });

  const editAnswerMutation = useMutation(editAnswer, {
    onSuccess: (res) => {
      router.push(`/qna/${res?.question}?ansewr=${answerId}`);
    },
  });

  async function uploadImgFile() {
    if (!(contentObj && contentObj.ops)) return;

    let ops = contentObj.ops;

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

  async function onSubmit({ content }: IAnswerForm) {
    await uploadImgFile();
    content = watch("content");

    if (!answerId) return;
    editAnswerMutation.mutate({ answerId, content });
  }

  useEffect(() => {
    if (!register) return;

    register("content", {
      required: "답변 내용을 입력해주세요",
      validate: {
        chkLength: (v) =>
          extractContent(v).length >= 20 || "20자 이상 입력해주세요",
      },
    });
  }, []);

  return (
    <>
      <Seo title="답변 수정" />

      <main className={styles.ask}>
        <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
          <section className={`${styles.contSec} ${styles.focus}`}>
            <article className={styles.contArea}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>내용</h1>

                <p className={styles.explain}>
                  답변 내용을 작성해 주세요 (20자 이상)
                </p>
              </div>

              <div className={styles.valueBox}>
                <TextEditor
                  styles={styles}
                  value={watch("content")}
                  setValue={(
                    value: string,
                    delta: any,
                    source: any,
                    editor: any
                  ) => {
                    setValue("content", value);
                    setContentObj(editor.getContents());
                  }}
                  error={errors.content?.message}
                />

                {errors.content?.message ? (
                  <p className={styles.errorMsg}>{errors.content?.message}</p>
                ) : null}
              </div>
            </article>

            <article className={styles.tipArea}>
              <h3 className={styles.key}>질문 내용 잘 쓰는법</h3>

              <div className={styles.valueBox}>
                <ul className={styles.valueList}>
                  <li>질문의 내용을 정확하게 이해하고 분석하기</li>
                  <li>코드와 예제 포함하기</li>
                  <li>문제 해결에 대한 접근방식 설명하기</li>
                </ul>
              </div>
            </article>
          </section>

          <section className={styles.btnSec}>
            <article className={styles.noticeArea}>
              <div className={styles.keyBox}>
                <h3 className={styles.key}>질문 시 이런 점을 주의해 주세요!</h3>

                <p className={styles.explain}>
                  본 게시판은 개발에 관련된 문제 해결을 위한 정보교류 커뮤니티
                  입니다.
                  <br />
                  해당 게시판에는 다음과 같은 규칙이 있습니다.
                </p>
              </div>

              <div className={styles.valueBox}>
                <ol className={styles.valueList}>
                  <li>프로그램 추천은 지양해주세요</li>
                  <li>게시물에 대한 평가는 추천기능을 활용해주세요</li>
                  <li>게시판은 타인에 대한 존중과 예의가 중요해요.</li>
                </ol>
              </div>
            </article>

            <article className={styles.btnArea}>
              <button
                className={styles.postBtn}
                disabled={editAnswerMutation.isLoading}
              >
                <p>수정하기</p>

                {editAnswerMutation.isLoading ? (
                  <U_spinner className={styles.spinner} />
                ) : null}
              </button>
            </article>
          </section>
        </form>
      </main>
    </>
  );
}
