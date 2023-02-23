import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import styles from "./Career.module.scss";
import WorkIcon from "@mui/icons-material/Work";
import { getUserCareer } from "@/api/Career";
import { timeDifferences, timeFormat } from "@/lib/time";

export default function Career() {
  const router = useRouter();

  const { id } = router.query;

  const query = useQuery(["career", id], getUserCareer, {
    retry: false,
    onSuccess: (res) => console.log(res),
  });

  return (
    <article className={styles.careerArticle}>
      <ul className={styles.careerList}>
        {query.data
          ? query.data?.map((v: any, i: number) => (
              <li key={i}>
                <WorkIcon />

                <span className={styles.textBox}>
                  <span className={styles.companyBox}>
                    <p className={styles.companyName}>{v.company}</p>

                    <p className={styles.position}>{v.position}</p>
                  </span>

                  <hr />

                  <span className={styles.termsBox}>
                    <p className={styles.time}>
                      {timeFormat({
                        time: v.first_day,
                        type: "day",
                      })}{" "}
                      ~{" "}
                      {timeFormat({
                        time: v.last_day,
                        type: "day",
                      })}
                    </p>

                    <p className={styles.terms}>
                      - {timeDifferences(v.first_day, v.last_day)}
                    </p>
                  </span>
                </span>
              </li>
            ))
          : null}
      </ul>
    </article>
  );
}
