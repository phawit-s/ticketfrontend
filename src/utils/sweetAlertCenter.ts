import Swal, { SweetAlertIcon } from 'sweetalert2'

export function SwalCenter(
   status: SweetAlertIcon, title: string, text?: string, onCloseFn?: () => any, timer?: number
): void {
   const time = timer ? timer : 2 //second
   const Toast = Swal.mixin({
      // toast: true,
      // position: "top-end",
      showConfirmButton: false,
      timer: status === 'error' ? undefined : time * 1000,
      timerProgressBar: true,
   })

   Toast.fire({
      title: title,
      text: text,
      icon: status,
   }).then(() => {
      if (onCloseFn) onCloseFn()
   })
}
