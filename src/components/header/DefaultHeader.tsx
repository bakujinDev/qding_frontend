import styles from "@/styles/components/header/defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";
import { useState } from "react";
import PopupBg from "../common/PopupBg";
import JoinPopup from "./JoinPopup";
import LoginPopup from "./LoginPopup";
import useUser from "@/lib/user";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuPopup from "./MenuPopup";
import EmailAuthPopup from "./EmailAuthPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { setEmailAuthPopup } from "@/store/reducer/commonReducer";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  const dispatch = useDispatch();
  const emailAuthPopup = useSelector(
    (state: AppState) => state.common.emailAuthPopup
  );
  const { user, isLoggedIn } = useUser();

  const [loginPopup, setLoginPopup] = useState<Boolean>(false);
  const [joinPopup, setJoinPopup] = useState<Boolean>(false);
  const [menuPopup, setMenuPopup] = useState<Boolean>(false);

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
                    <img
                      className={styles.profImg}
                      src={user.avatar}
                      alt="profile img"
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

      {emailAuthPopup ? (
        <>
          <EmailAuthPopup off={() => dispatch(setEmailAuthPopup(false))} />
          <PopupBg bg off={() => dispatch(setEmailAuthPopup(false))} />
        </>
      ) : null}
    </>
  );
}
