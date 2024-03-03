import { toast } from 'react-toastify';

export function showsuccess (message) {
    toast.success(message, {
        closeOnClick: true,
        toastId: 'success'
    });
}

export function showerror (message) {
    toast.error(message,  {
        closeOnClick: true,
        toastId: 'error'
    });
}

export function showinfo (message) {
    toast.info(message,
        {
            closeOnClick: true,
            toastId: 'info'
        });
}
