import { getUserTagLank } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function TagLank() {
  const router = useRouter();

  const { id } = router.query;

  const query: any = useQuery(["tag_lank", id], getUserTagLank, {
    retry: false,
    onSuccess: (res) => console.log(res),
  });

  return (
    <article
    // className={styles.tagLank}
    >
      d
    </article>
  );
}
