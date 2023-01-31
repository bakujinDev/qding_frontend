import styles from "@/styles/components/header/defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";
import { useState } from "react";
import PopupBg from "../common/PopupBg";
import JoinPopup from "./JoinPopup";
import LoginPopup from "./LoginPopup";
import useUser from "@/lib/useUser";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuPopup from "./MenuPopup";
import Image from "next/image";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  const [loginPopup, setLoginPopup] = useState<Boolean>(false);
  const [joinPopup, setJoinPopup] = useState<Boolean>(false);
  const [menuPopup, setMenuPopup] = useState<Boolean>(false);

  const { userLoading, user, isLoggedIn } = useUser();

  console.log(user);

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
              <span className={styles.avatarBox}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setMenuPopup(true)}
                >
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="profile img"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <AccountCircleIcon fontSize="inherit" />
                  )}
                </button>

                {menuPopup ? (
                  <>
                    <MenuPopup off={() => setMenuPopup(false)} />
                    <PopupBg off={() => setMenuPopup(false)} />
                  </>
                ) : null}
              </span>
            </div>
          ) : (
            <div className={styles.authBox}>
              <button
                className={styles.signInBtn}
                onClick={() => setJoinPopup(true)}
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
      F
      {joinPopup ? (
        <>
          <JoinPopup off={() => setJoinPopup(false)} />
          <PopupBg bg off={() => setJoinPopup(false)} />
        </>
      ) : null}
      {loginPopup ? (
        <>
          <LoginPopup off={() => setLoginPopup(false)} />
          <PopupBg bg off={() => setLoginPopup(false)} />
        </>
      ) : null}
    </>
  );
}
