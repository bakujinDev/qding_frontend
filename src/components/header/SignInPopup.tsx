import styles from "@/styles/components/header/signInPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function LoginPopup() {
  return (
    <section className={`${styles.loginPopup} defaultPopup`}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>로그인</h1>
        <CloseIcon />
      </article>

      <article className={styles.contArea}>
        <div className={styles.formBox}>
          <form onSubmit={() => {}}>
            <ul className={styles.inputList}>
              <li>
                <p className={styles.key}>아이디</p>
                <div className={styles.inputBox}>
                  <input
                    // value={}
                    // onChange={e=>set(e.target.value)}
                    placeholder=""
                  />
                </div>
              </li>

              <li>
                <p className={styles.key}>비밀번호</p>
                <div className={styles.inputBox}>
                  <input
                    // value={}
                    // onChange={e=>set(e.target.value)}
                    placeholder=""
                  />
                </div>
              </li>

              <li>
                <p className={styles.key}>비밀번호 확인</p>
                <div className={styles.inputBox}>
                  <input
                    // value={}
                    // onChange={e=>set(e.target.value)}
                    placeholder=""
                  />
                </div>
              </li>
            </ul>

            <button className={styles.signupBtn} onClick={() => {}}>
              회원가입
            </button>
          </form>
        </div>

        <div className={styles.hrBox}>
          <hr />
          <p>또는</p>
          <hr />
        </div>

        <div className={styles.socialBox}>
          <ul className={styles.socialList}>
            <li className={styles.kakao}>
              <I_kakao />
              카카오 로그인
            </li>

            <li className={styles.github}>
              <GitHubIcon />
              깃허브 로그인
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}
