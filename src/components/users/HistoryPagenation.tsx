import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./HistoryPagenation.module.scss";

interface IProps {
  page: number;
  setPage: Function;
  total: number;
}

export default function HistoryPageNation({ page, setPage, total }: IProps) {
  const router = useRouter();

  const limit = 10;
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    const _totalPage = Math.floor(total / limit + 1);
    setTotalPage(_totalPage);
  }, [total]);

  return (
    <div className={styles.pageNationBox}>
      <ul className={styles.pageList}>
        {page ? (
          <>
            {page > 3 ? <li onClick={() => setPage(1)}>1</li> : null}

            {new Array(5).fill("").map((v, i: number) =>
              page + i >= 3 && page + i - 2 <= totalPage ? (
                <li
                  key={i}
                  className={`${i === 2 ? styles.on : ""}`}
                  onClick={() => setPage(page + i - 2)}
                >
                  {page + i - 2}
                </li>
              ) : null
            )}

            {page < totalPage - 2 ? (
              <li onClick={() => setPage(totalPage)}>{totalPage}</li>
            ) : null}
          </>
        ) : (
          <li>1</li>
        )}
      </ul>
    </div>
  );
}
