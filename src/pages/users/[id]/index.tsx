import styles from "./Profile.module.scss";
import { useRouter } from "next/router";
import QuestionHistory from "@/components/users/history/QuestionHistory";
import AnswerHistory from "@/components/users/history/AnswerHistory";
import TagLank from "@/components/users/TagLank";
import Profile from "@/components/users/Profile";
import Career from "@/components/users/Career";

export default function ProfileIndex() {
  const router = useRouter();

  const { id } = router.query;

  return (
    <>
      <main className={styles.profile}>
        <section className={styles.innerSec}>
          <Profile />

          <Career />

          <TagLank />

          <QuestionHistory />

          <AnswerHistory />
        </section>
      </main>
    </>
  );
}
