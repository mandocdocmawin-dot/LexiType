import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className={`bg-surface-container rounded-xl p-8 md:p-12 space-y-10 ${className}`}>
            <div className="space-y-1">
                <h2 className="font-headline text-xl font-semibold text-primary">Update Password</h2>
                <p className="text-sm text-on-surface-variant">Ensure your account is using a long, random password to stay secure.</p>
            </div>

            <form onSubmit={updatePassword} className="space-y-8">
                {/* Current Password Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="current_password">Current Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">lock</span>
                        </div>
                        <input 
                            id="current_password" 
                            ref={currentPasswordInput}
                            type="password" 
                            value={data.current_password} 
                            onChange={e => setData('current_password', e.target.value)} 
                            className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body outline-none" 
                        />
                    </div>
                    {errors.current_password && <p className="text-xs text-error mt-1">{errors.current_password}</p>}
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">key</span>
                        </div>
                        <input 
                            id="password" 
                            ref={passwordInput}
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)} 
                            className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body outline-none" 
                        />
                    </div>
                    {errors.password && <p className="text-xs text-error mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password_confirmation">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">password</span>
                        </div>
                        <input 
                            id="password_confirmation" 
                            type="password" 
                            value={data.password_confirmation} 
                            onChange={e => setData('password_confirmation', e.target.value)} 
                            className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body outline-none" 
                        />
                    </div>
                    {errors.password_confirmation && <p className="text-xs text-error mt-1">{errors.password_confirmation}</p>}
                </div>

                {/* CTA Section */}
                <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full md:w-auto bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>Update Password</span>
                        <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span> Secured.
                        </p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}