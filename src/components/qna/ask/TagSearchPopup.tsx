import { getTagList } from "@/api/qna";
import { useQuery } from "@tanstack/react-query";
import styles from "./tagSearchPopup.module.scss";

interface IProps {
  search: string;
  value: Array<any>;
  setValue: Function;
  off: Function;
}

export default function TagSearchPopup({
  search,
  value,
  setValue,
  off,
}: IProps) {
  const tagList = useQuery(["tagList", search], getTagList, {
    retry: false,
  });

  function onClickTag(tag: any) {
    if (value.length > 4) return;
    
    if (value.find((e) => e?.pk === tag?.pk)) {
      off();
      return;
    }

    setValue([...value, tag]);
    off();
  }

  return (
    <section className={styles.searchPopup}>
      <ul className={styles.valueList}>
        {tagList.data?.map((v: any, i: number) => (
          <li key={i} onClick={() => onClickTag(v)}>
            <p className={styles.name}>{v.name}</p>
            <p className={styles.desc}>{v.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
