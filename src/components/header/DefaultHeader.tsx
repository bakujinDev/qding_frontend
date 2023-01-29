import styles from "@/styles/components/header/defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";
import { useState } from "react";
import PopupBg from "../common/PopupBg";
import SignInPopup from "./JoinPopup";
import LoginPopup from "./LoginPopup";
import useUser, { stringAvatar } from "@/lib/useUser";
import Avatar from "@mui/material/Avatar";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  const [loginPopup, setLoginPopup] = useState<Boolean>(false);
  const [signInPopup, setSignInPopup] = useState<Boolean>(false);

  const { userLoading, user, isLoggedIn } = useUser();

  return (
    <>
      <header className={styles.defaultHeader}>
        <article className={styles.leftArea}>
          <Link className={`${styles.logo} ${itim.className}`} href="/">
            <h1>Qding</h1>
          </Link>
        </article>

        <article className={styles.rightArea}>
          {isLoggedIn ? (
            <div className={styles.profBox}>
              {user?.avatar ? (
                <Avatar alt={user?.name} src={user?.avatar} />
              ) : (
                <Avatar
                  {...stringAvatar(user?.name || user?.usernmae || "aaasdsd")}
                />
              )}
            </div>
          ) : (
            <div className={styles.authBox}>
              <button
                className={styles.signInBtn}
                onClick={() => setSignInPopup(true)}
              >
                회원가입
              </button>

              <button
                className={styles.loginBtn}
                onClick={() => setLoginPopup(true)}
              >
                로그인
              </button>
            </div>
          )}
        </article>
      </header>

      {signInPopup ? (
        <>
          <SignInPopup />
          <PopupBg bg off={() => setSignInPopup(false)} />
        </>
      ) : null}

      {loginPopup ? (
        <>
          <LoginPopup />
          <PopupBg bg off={() => setLoginPopup(false)} />
        </>
      ) : null}
    </>
  );
}
