import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className={`bg-surface-container rounded-xl p-8 md:p-12 space-y-10 ${className}`}>
            <div className="space-y-1">
                <h2 className="font-headline text-xl font-semibold text-primary">Identity Settings</h2>
                <p className="text-sm text-on-surface-variant">Update your public profile information.</p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                {/* Username Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="name">Username</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">alternate_email</span>
                        </div>
                        <input 
                            id="name" 
                            type="text" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)} 
                            className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body outline-none" 
                        />
                    </div>
                    {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="email">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">mail</span>
                        </div>
                        <input 
                            id="email" 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            className="w-full bg-surface-container-lowest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body outline-none" 
                        />
                    </div>
                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                </div>

                {/* Bio Textarea */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="bio">Bio</label>
                    <div className="relative">
                        <textarea 
                            id="bio" 
                            rows="4"
                            maxLength="150" 
                            value={data.bio} 
                            onChange={e => setData('bio', e.target.value)} 
                            placeholder="Tell us about your typing journey..." 
                            // Added pb-8 so the text doesn't hide behind the character counter
                            className="w-full bg-surface-container-lowest border-none rounded-lg p-4 pb-8 text-on-surface focus:ring-2 focus:ring-primary-container transition-all font-body resize-none outline-none"
                        ></textarea>
                        
                        {/* Dynamic Character Counter */}
                        <div className={`absolute bottom-3 right-4 text-xs font-bold tracking-wider ${data.bio?.length >= 150 ? 'text-error' : 'text-on-surface-variant'}`}>
                            {data.bio?.length || 0}/150
                        </div>
                    </div>
                    {errors.bio && <p className="text-xs text-error mt-1">{errors.bio}</p>}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-on-surface-variant">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-primary hover:text-primary-fixed rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container ml-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-secondary">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {/* CTA Section */}
                <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full md:w-auto bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>Save Changes</span>
                        <span className="material-symbols-outlined text-sm">save</span>
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span> Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </div>
    );
}