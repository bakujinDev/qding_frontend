import { getTagList } from "@/api/qna/tag";
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

  function onClickTag(tagName: any) {
    if (value.length > 4) return;

    if (value.find((e) => e === tagName)) {
      off();
      return;
    }

    setValue([...value, tagName]);
    off();
  }

  return (
    <section className={styles.searchPopup}>
      <ul className={styles.valueList}>
        {tagList.data?.map((tag: any, i: number) => (
          <li key={i} onClick={() => onClickTag(tag.name)}>
            <p className={styles.name}>{tag.name}</p>
            <p className={styles.desc}>{tag.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
