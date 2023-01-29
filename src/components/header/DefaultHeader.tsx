import styles from "@/styles/components/header/defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  
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
          <button className={styles.signInBtn} onClick={() => {}}>
            회원가입
          </button>

          <button className={styles.loginBtn} onClick={() => {}}>
            로그인
          </button>
        </div>
      </article>
    </header>


    </>
  );
}

// nter.className
