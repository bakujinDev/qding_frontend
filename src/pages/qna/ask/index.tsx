import { getTagList, IPostQuestion } from "@/api/qna";
import styles from "./ask.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import "react-quill/dist/quill.snow.css";
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

export default function Ask() {
  const [content, setContent] = useState<any>();
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

  useEffect(() => {
    register("content", { required: true, minLength: 20 });
  }, [register]);

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

  async function onSubmit({ title, content, tag }: IPostQuestion) {
    await uploadImgFile();

    content = watch("content");
  }

  function onClickTagDelBtn(tag: object) {
    let _selTagList = watch("tag");

    setValue(
      "tag",
      _selTagList.filter((v) => v !== tag)
    );
  }

  useEffect(() => {
    if (tagSearch) setTagSearchPopup(true);
    else setTagSearchPopup(false);
  }, [tagSearch]);

  return (
    <>
      <Seo title="질문하기" />
      <main className={styles.ask}>
        <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.contSec}>
            <article className={styles.contArea}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>제목</h1>

                <p className={styles.explain}>
                  질문의 제목을 작성해주세요 (8자 이상)
                </p>
              </div>

              <div className={styles.valueBox}>
                <div className={styles.inputBox}>
                  <input
                    {...register("title", {
                      required: "제목을 입력해주세요",
                      minLength: { value: 8, message: "8자 이상 입력해주세요" },
                    })}
                    placeholder="예) html의 <strong>과 <em>은 어떻게 다른가요?"
                  />
                </div>
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

          <section className={styles.contSec}>
            <article className={styles.contArea}>
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
                    setContent(editor.getContents());
                  }}
                />
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

          <section className={styles.contSec}>
            <article className={styles.contArea}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>태그</h1>

                <p className={styles.explain}>
                  질문 유형을 선택해주세요 (최대 5개)
                </p>
              </div>

              <div className={styles.valueBox}>
                <ul className={styles.selectTagList}>
                  {watch("tag")
                    ? watch("tag").map((v, i) => (
                        <li key={i}>
                          <p>{v.name}</p>

                          <button
                            className={styles.delBtn}
                            onClick={() => onClickTagDelBtn(v)}
                          >
                            <CloseIcon />
                          </button>
                        </li>
                      ))
                    : null}
                </ul>

                <div className={styles.tagSearchCont}>
                  <div className={styles.inputBox}>
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
                  <li>사용 언어, 프레임워크, 라이브러리 등 다양한 태그를 사용해보세요</li>
                </ul>
              </div>
            </article>
          </section>

          <section className={styles.btnSec}>
            <article className={styles.noticeArea}>
              <h3 className={styles.key}>질문 시 이런 점을 주의해 주세요!</h3>

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

            <article className={styles.btnArea}>
              <button className={styles.postBtn}>작성하기</button>
            </article>
          </section>
        </form>
      </main>
    </>
  );
}

function base64toFile(base_data: any, filename: string) {
  var arr = base_data.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
