import { editProfile, IEditProfile } from "@/api/user";
import { AppState } from "@/store/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getUserProfile } from "@/api/user";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Edit.module.scss";
import { mib2 } from "@/lib/setting";

export default function Edit() {
  const router = useRouter();
  const imgRef = useRef<any>();

  const [previewImg, setPreviewImg] = useState<string>();

  const user = useSelector((state: AppState) => state.common.userInfo);

  const initData = useQuery(["user", user?.pk], getUserProfile, {
    onSuccess: (res) => console.log(res),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IEditProfile>({});

  const mutation = useMutation(editProfile, {
    onSuccess: (res) => {
      reset();
      router.push(`/users/${user?.pk}`);
    },
  });

  const onSubmit = ({
    avatar,
    name,
    introduce,
    blog,
    github,
  }: IEditProfile) => {
    mutation.mutate({
      avatar,
      name,
      introduce,
      blog,
      github,
    });
  };

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
                  onClick={() => imgRef.current.click()}
                >
                  <img src={previewImg || initData.data?.avatar} alt="" />
                </button>

                <input
                  className={"nospace"}
                  onChange={(e) => onChangeProfImg(e)}
                  type="file"
                  accept="image/*"
                  ref={imgRef}
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
                    {...register("blog")}
                    placeholder={initData.data?.blog}
                  />
                </div>
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
            {mutation.isError ? (
              <p className={styles.errorText}>
                프로필 수정 중 에러가 발생하였습니다.
              </p>
            ) : null}

            <button className={styles.submitBtn} type="submit">
              수정
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
