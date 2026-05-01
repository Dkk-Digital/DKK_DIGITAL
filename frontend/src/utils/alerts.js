import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const baseOptions = {
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#64748b',
  background: '#ffffff',
  color: '#0f172a',
  buttonsStyling: true,
};

export const successAlert = (message, title = 'Success') =>
  Swal.fire({
    ...baseOptions,
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'OK',
  });

export const errorAlert = (message, title = 'Error') =>
  Swal.fire({
    ...baseOptions,
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Close',
  });

export const confirmAlert = async (title, text = 'This action cannot be undone.') => {
  const result = await Swal.fire({
    ...baseOptions,
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Yes, continue',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result.isConfirmed;
};