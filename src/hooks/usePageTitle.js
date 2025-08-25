import { useEffect } from "react";

const BASE_TITLE = "Register System";

export function usePageTitle(suffix) {
  useEffect(() => {
    document.title = `${BASE_TITLE} - ${suffix}`;
  }, [suffix]);
}
