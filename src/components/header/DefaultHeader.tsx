import styles from "./defaultHeader.module.scss";
import Link from "next/link";
import { Itim } from "@next/font/google";
import { useState } from "react";
import PopupBg from "../common/PopupBg";
import JoinPopup from "./JoinPopup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuPopup from "./MenuPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { setLoginPopup } from "@/store/reducer/commonReducer";
import useUser from "@/lib/user";

const itim = Itim({ weight: "400", preload: false });

export default function DefaultHeader() {
  const dispatch = useDispatch();

  useUser();
  const user = useSelector((state: AppState) => state.common.userInfo);

  const [joinPopup, setJoinPopup] = useState<Boolean>(false);
  const [menuPopup, setMenuPopup] = useState<Boolean>(false);

  return (
    <>
      <header className={styles.defaultHeader}>
        <article className={styles.leftArea}>
          <Link className={`${styles.logo} ${itim.className}`} href="/">
            <h1>Qding</h1>
          </Link>
        </article>

        <article className={styles.rightArea}>
          {user ? (
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
                onClick={() => dispatch(setLoginPopup(true))}
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
    </>
  );
}
