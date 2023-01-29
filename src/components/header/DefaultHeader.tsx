import styles from "@/styles/components/header/defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";
import { useState } from "react";
import PopupBg from "../common/PopupBg";
import SignInPopup from "./SignInPopup";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  const [signInPopup, setSignInPopup] = useState<Boolean>(false);

  return (
    <>
      <header className={styles.defaultHeader}>
        <article className={styles.leftArea}>
          <Link className={`${styles.logo} ${itim.className}`} href="/">
            <h1>Qding</h1>
          </Link>
        </article>

        <article className={styles.rightArea}>
          <div className={styles.authBox}>
            <button
              className={styles.signInBtn}
              onClick={() => setSignInPopup(true)}
            >
              회원가입
            </button>

            <button className={styles.loginBtn} onClick={() => {}}>
              로그인
            </button>
          </div>
        </article>
      </header>

      {signInPopup ? (
        <>
          <SignInPopup />
          <PopupBg bg off={() => setSignInPopup(false)} />
        </>
      ) : null}
    </>
  );
}
