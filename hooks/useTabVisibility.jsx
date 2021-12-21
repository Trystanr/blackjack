import { useEffect, useState } from "react";

export default function useTabVisibility() {
  const [tabVisibility, setTabVisibility] = useState("visible");
  useEffect(() => {
    window.addEventListener("visibilitychange", function () {
      setTabVisibility(document.visibilityState);
      console.log(`Tab state : ${document.visibilityState}`);
    });
  }, []);
  return tabVisibility;
}
