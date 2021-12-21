import { useCallback, useState } from "react";

export default function usePaginate(pageSize, initial = false) {
  const [moreToLoad, setMoreToLoad] = useState(initial);
  const checkLoadMore = useCallback(
    (items) => {
      if (items.length >= pageSize) {
        setMoreToLoad(true);
      } else {
        setMoreToLoad(false);
      }
    },
    [pageSize]
  );
  return { moreToLoad, checkLoadMore };
}
