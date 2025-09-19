import Swal, { SweetAlertIcon } from "sweetalert2";

export const SweetAlertConfirm = async (
  title: string,
  text?: string,
  confirmColor?: string,
  cancelButtonColor?: string
) => {
  return Swal.fire({
    title: title,
    text: text || "",
    icon: "question" as SweetAlertIcon,
    showCancelButton: true,
    confirmButtonColor: confirmColor || "#f00",
    cancelButtonColor: cancelButtonColor || "#3085d6",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });
};
