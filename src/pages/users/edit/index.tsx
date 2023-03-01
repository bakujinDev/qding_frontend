import { editProfile, IEditProfileForm } from "../../../api/user";
import { AppState } from "../../../store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getUserProfile } from "../../../api/user";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Edit.module.scss";
import { mib2 } from "../../../lib/setting";
import {
  getUploadURL,
  IGetUploadURL,
  IUploadImageVariables,
  IUploadURLResponse,
  uploadImage,
} from "../../../api/fileUpload";
import U_spinner from "../../../asset/util/U_spinner.svg";
import useUser, { urlPattern } from "../../../lib/user";

export default function Edit() {
  useUser();
  const router = useRouter();
  const imgInputRef = useRef<any>();
  const imgRef = useRef<string>();
  const queryClient = useQueryClient();

  const [previewImg, setPreviewImg] = useState<string>();

  const user = useSelector((state: AppState) => state.common.userInfo);

  const initData = useQuery(["user", user?.pk], getUserProfile, {
    retry: false,
    onSuccess: (res) => console.log(res),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<IEditProfileForm>({});

  const editMutation = useMutation(editProfile, {
    onSuccess: (res) => {
      reset();
      queryClient.refetchQueries(["me"]);
      router.push(`/users/${user?.pk}`);
    },
  });

  const getUploadURLMutation = useMutation(getUploadURL, {
    onSuccess: async (data: IUploadURLResponse, props: IGetUploadURL) => {
      await uploadImageMutation.mutateAsync({
        file: props.file,
        uploadURL: data.uploadURL,
      });
    },
  });

  const uploadImageMutation = useMutation(uploadImage, {
    onSuccess: ({ result }: any, props: IUploadImageVariables) => {
      imgRef.current = result.variants[0];
    },
  });

  async function onSubmit({
    avatar,
    name,
    introduce,
    blog,
    github,
  }: IEditProfileForm) {
    if (avatar) {
      await getUploadURLMutation.mutateAsync({
        file: avatar,
      });
    }

    if (blog && !blog.startsWith("http")) {
      blog = "http://" + blog;
    }

    if (github && !github.startsWith("http")) {
      github = "http://" + github;
    }

    editMutation.mutate({
      avatar: imgRef.current || "",
      name,
      introduce,
      blog,
      github,
    });
  }

  function onChangeProfImg(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > mib2) {
      toast("2MiB 이하의 이미지를 사용해 주세요");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (!reader.result) return;

      setValue("avatar", file);
      setPreviewImg(`${reader.result}`);
    };
  }

  return (
    <main className={styles.editProfile}>
      <section className={styles.innerSec}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className={styles.formList}>
            <li className={styles.profileImage}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>프로필 이미지</h1>
              </div>

              <div className={styles.valueBox}>
                <button
                  type="button"
                  className={styles.editProfileBtn}
                  onClick={() => imgInputRef.current.click()}
                >
                  <img src={previewImg || initData.data?.avatar} alt="" />
                </button>

                <input
                  className={"nospace"}
                  onChange={(e) => onChangeProfImg(e)}
                  type="file"
                  accept="image/*"
                  ref={imgInputRef}
                />
              </div>
            </li>

            <li className={styles.profileImage}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>닉네임</h1>
              </div>

              <div className={styles.valueBox}>
                <div className={styles.inputBox}>
                  <input
                    {...register("name")}
                    placeholder={initData.data?.name}
                  />
                </div>
              </div>
            </li>

            <li className={styles.profileImage}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>자기소개</h1>
              </div>

              <div className={styles.valueBox}>
                <div className={styles.inputBox}>
                  <textarea
                    {...register("introduce")}
                    placeholder={initData.data?.introduce}
                  />
                </div>
              </div>
            </li>

            <li className={styles.profileImage}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>블로그</h1>
              </div>

              <div className={styles.valueBox}>
                <div className={styles.inputBox}>
                  <input
                    {...register("blog", {
                      pattern: {
                        value: urlPattern,
                        message: "주소를 다시 확인해주세요",
                      },
                    })}
                    placeholder={initData.data?.blog}
                  />
                </div>

                {errors.blog?.message ? (
                  <p className={styles.errorText}>{errors.blog?.message}</p>
                ) : null}
              </div>
            </li>

            <li className={styles.profileImage}>
              <div className={styles.keyBox}>
                <h1 className={styles.key}>깃허브</h1>
              </div>

              <div className={styles.valueBox}>
                <div className={styles.inputBox}>
                  <input
                    {...register("github")}
                    placeholder={initData.data?.github}
                  />
                </div>
              </div>
            </li>
          </ul>

          <div className={styles.submitBar}>
            {editMutation.isError ? (
              <p className={styles.errorText}>
                프로필 수정 중 에러가 발생하였습니다.
              </p>
            ) : null}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <p>수정하기</p>

              <U_spinner className={styles.spinner} />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
