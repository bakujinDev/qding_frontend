import { editQuestion, getQuestion, IPostQuestion } from "@/api/qna/question";
import styles from "./editQuestion.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import TextEditor from "@/components/common/TextEditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUploadURL,
  IGetUploadURL,
  IUploadImageVariables,
  IUploadURLResponse,
  uploadImage,
} from "@/api/fileUpload";
import CloseIcon from "@mui/icons-material/Close";
import TagSearchPopup from "@/components/qna/ask/TagSearchPopup";
import PopupBg from "@/components/common/PopupBg";
import { base64toFile } from "@/lib/textEditor";
import { extractContent } from "@/lib/forum";
import { useRouter } from "next/router";
import U_spinner from "@/asset/util/U_spinner.svg";

export default function EditPost() {
  const router = useRouter();

  const { questionId } = router.query;

  const [focus, setFocus] = useState<"title" | "content" | "tag">("title");
  const [contentObj, setContentObj] = useState<any>();
  const [tagSearch, setTagSearch] = useState<string>("");
  const [tagSearchPopup, setTagSearchPopup] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IPostQuestion>({
    defaultValues: {
      tag: [],
    },
  });

  const postQuery = useQuery(["question", `${questionId}`], getQuestion, {
    retry: false,
    onSuccess: (res) => {
      console.log(res);

      setValue("title", res.title);
      setValue("content", res.content);

      let tagList = res.tag || [];
      tagList = tagList.map((e: any) => e.name);

      setValue("tag", tagList);
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

  const editQuestionMutation = useMutation(editQuestion, {
    onSuccess: (res) => {
      router.push(`/qna/${res.pk}`);
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

  function onClickTagDelBtn(tag: object) {
    let _selTagList = watch("tag");

    setValue(
      "tag",
      _selTagList.filter((v) => v !== tag)
    );
  }

  async function onSubmit({ title, content, tag }: IPostQuestion) {
    await uploadImgFile();
    content = watch("content");

    if (!questionId) return;
    editQuestionMutation.mutate({ questionId, title, content, tag });
  }

  useEffect(() => {
    if (!register) return;

    register("content", {
      required: "질문 내용을 입력해주세요",
      validate: {
        chkLength: (v) =>
          extractContent(v).length >= 20 || "20자 이상 입력해주세요",
      },
    });

    register("tag", {
      required: "태그를 선택해주세요",
    });
  }, []);

  useEffect(() => {
    if (tagSearch) setTagSearchPopup(true);
    else setTagSearchPopup(false);
  }, [tagSearch]);

  return (
    <>
      <Seo title="질문하기" />
      <main className={styles.ask}>
        <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
          <section
            className={`${styles.contSec} ${
              focus === "title" ? styles.focus : ""
            }`}
          >
            <article
              className={styles.contArea}
              onFocus={() => setFocus("title")}
            >
              <div className={styles.keyBox}>
                <h1 className={styles.key}>제목</h1>

                <p className={styles.explain}>
                  질문의 제목을 작성해주세요 (8자 이상)
                </p>
              </div>

              <div className={styles.valueBox}>
                <div
                  className={`${styles.inputBox} ${
                    errors.title?.message ? styles.errorBox : ""
                  }`}
                >
                  <input
                    {...register("title", {
                      required: "제목을 입력해주세요",
                      minLength: { value: 8, message: "8자 이상 입력해주세요" },
                    })}
                    placeholder="예) html의 <strong>과 <em>은 어떻게 다른가요?"
                  />
                </div>

                {errors.title?.message ? (
                  <p className={styles.errorMsg}>{errors.title?.message}</p>
                ) : null}
              </div>
            </article>

            <article className={styles.tipArea}>
              <h3 className={styles.key}>제목 잘 쓰는법</h3>

              <div className={styles.valueBox}>
                <ul className={styles.valueList}>
                  <li>질문 제목에 의미가 담기도록 간결하게 작성하기</li>
                  <li>구체적인 내용의 제목 작성하기</li>
                  <li>질문의 핵심 단어를 포함하기</li>
                </ul>
              </div>
            </article>
          </section>

          <section
            className={`${styles.contSec} ${
              focus === "content" ? styles.focus : ""
            }`}
          >
            <article
              className={styles.contArea}
              onFocus={() => setFocus("content")}
            >
              <div className={styles.keyBox}>
                <h1 className={styles.key}>내용</h1>

                <p className={styles.explain}>
                  문제의 내용을 작성해 주세요 (20자 이상)
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
                  <li>개발 목표와 발생한 문제에 대해 설명하기</li>
                  <li>
                    시도한 방식과 발생한 결과, 목표와 어떻게 다른지 설명하기
                  </li>
                  <li>코드와 에러메세지를 이미지가 아닌 텍스트로 올리기</li>
                </ul>
              </div>
            </article>
          </section>

          <section
            className={`${styles.contSec} ${
              focus === "tag" ? styles.focus : ""
            }`}
          >
            <article
              className={styles.contArea}
              onFocus={() => setFocus("tag")}
            >
              <div className={styles.keyBox}>
                <h1 className={styles.key}>태그</h1>

                <p className={styles.explain}>
                  질문 유형을 선택해주세요 (최대 5개)
                </p>
              </div>

              <div className={styles.valueBox}>
                <ul className={styles.selectTagList}>
                  {watch("tag")
                    ? watch("tag").map((tag, i) => (
                        <li key={i}>
                          <p>{tag}</p>

                          <button
                            className={styles.delBtn}
                            onClick={() => onClickTagDelBtn(tag)}
                          >
                            <CloseIcon />
                          </button>
                        </li>
                      ))
                    : null}
                </ul>

                <div className={styles.tagSearchCont}>
                  <div
                    className={`${styles.inputBox} ${
                      errors.tag?.message ? styles.errorBox : ""
                    }`}
                  >
                    <input
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="예) react"
                    />
                  </div>

                  {tagSearchPopup ? (
                    <>
                      <TagSearchPopup
                        search={tagSearch}
                        value={watch("tag")}
                        setValue={(tag: Array<Object>) => setValue("tag", tag)}
                        off={() => {
                          setTagSearch("");
                          setTagSearchPopup(false);
                        }}
                      />
                      <PopupBg
                        off={() => {
                          setTagSearch("");
                          setTagSearchPopup(false);
                        }}
                      />
                    </>
                  ) : null}
                </div>

                {errors.tag?.message ? (
                  <p className={styles.errorMsg}>{errors.tag?.message}</p>
                ) : null}
              </div>
            </article>

            <article className={styles.tipArea}>
              <h3 className={styles.key}>좋은 태그 선택하는 법</h3>

              <div className={styles.valueBox}>
                <ul className={styles.valueList}>
                  <li>
                    태그는 해당 분야에 대해 관심, 지식이 있는 사람에게
                    노출되어요
                  </li>
                  <li>많은 태그는 사람들에게 발견되기 쉽게 만들어요</li>
                  <li>
                    사용 언어, 프레임워크, 라이브러리 등 다양한 태그를
                    사용해보세요
                  </li>
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
                  <li>
                    기존 답변 검색: 질문을 게시하기 전, 게시판에 검색하여 이미
                    질문과 답변이 올라와져 있는지 확인해주세요.
                  </li>
                  <li>
                    구체적인 질문: 다양하게 해석될 수 있는 모호한 질문은
                    피해주세요.
                  </li>
                  <li>
                    시도한 내용 기재: 문제를 해결하기 위해 했던 시도를
                    적어주세요.
                  </li>
                  <li>
                    타인에 대한 존중: 게시판은 타인에 대한 존중과 예의가
                    중요해요.
                  </li>
                </ol>
              </div>
            </article>

            <article className={styles.btnArea}>
              <button
                className={styles.postBtn}
                disabled={editQuestionMutation.isLoading}
              >
                <p>수정하기</p>

                {editQuestionMutation.isLoading ? (
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
