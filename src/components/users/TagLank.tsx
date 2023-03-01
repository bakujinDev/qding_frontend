import styles from "./TagLank.module.scss";
import { getUserTagLank } from "../../api/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function TagLank() {
  const router = useRouter();

  const { id } = router.query;

  const query = useQuery(["tag_lank", id], getUserTagLank, {
    retry: false,
    onSuccess: (res) => console.log(res),
  });

  return (
    <article className={styles.tagLank}>
      <h1 className={styles.contTitle}>주요 활동 분야</h1>

      <div className={styles.valueBox}>
        <ul className={styles.tagList}>
          {query.data
            ? query.data.map((v: any, i: number) => (
                <li key={i}>
                  <p className={styles.key}>{v.name}</p>
                  <p className={styles.value}>{v.count}</p>
                </li>
              ))
            : null}
        </ul>
      </div>
    </article>
  );
}
