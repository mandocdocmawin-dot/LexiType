import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className={`bg-error-container/10 border border-error/10 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}>
            <div className="space-y-1 text-center md:text-left">
                <h3 className="font-headline text-lg font-semibold text-error">Deactivate Account</h3>
                <p className="text-sm text-on-surface-variant max-w-sm">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            
            <button 
                onClick={confirmUserDeletion}
                className="bg-transparent border border-error text-error px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-error hover:text-on-error transition-all"
            >
                Delete
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="bg-surface-container-high p-8 border border-white/5 shadow-2xl relative">
                    <form onSubmit={deleteUser}>
                        <h2 className="text-lg font-headline font-bold text-error">
                            Are you sure you want to delete your account?
                        </h2>

                        <p className="mt-2 text-sm text-on-surface-variant font-body">
                            Once your account is deleted, all of your resources and data will be permanently deleted. Please
                            enter your password to confirm you would like to permanently delete your account.
                        </p>

                        <div className="mt-6 space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-error transition-colors">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-error/20 rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-error transition-all font-body outline-none"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                        </div>

                        <div className="mt-8 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-3 rounded-lg font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                            >
                                Cancel
                            </button>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-error text-on-error px-6 py-3 rounded-lg font-headline font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}