import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Pagenation.module.scss";

interface IProps {
  total: number;
}

export default function PageNation({ total }: IProps) {
  const router = useRouter();

  const limit = 10;
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>();

  useEffect(() => {
    const _totalPage = Math.floor(total / limit + 1);
    setTotalPage(_totalPage);
  }, [total]);

  useEffect(() => {
    setCurrentPage(Number(router.query.page) || 1);
  }, [router]);

  return (
    <div className={styles.pageNationBox}>
      <ul className={styles.pageList}>
        {currentPage ? (
          <>
            {currentPage > 3 ? (
              <li onClick={() => router.push(`/qna?page=1`)}>1</li>
            ) : null}

            {new Array(5).fill("").map((v, i: number) =>
              currentPage + i >= 3 && currentPage + i - 2 <= totalPage ? (
                <li
                  key={i}
                  className={`${i === 2 ? styles.on : ""}`}
                  onClick={() =>
                    router.push(`/qna?page=${currentPage + i - 2}`)
                  }
                >
                  {currentPage + i - 2}
                </li>
              ) : null
            )}

            {currentPage < totalPage - 2 ? (
              <li onClick={() => router.push(`/qna?page=${totalPage}`)}>
                {totalPage}
              </li>
            ) : null}
          </>
        ) : (
          <li>1</li>
        )}
      </ul>
    </div>
  );
}
