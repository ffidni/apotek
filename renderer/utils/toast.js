import { toast } from "react-toastify";

export function show(text, error = false) {
  if (error) toast.error(text);
  else toast.success(text);
}
