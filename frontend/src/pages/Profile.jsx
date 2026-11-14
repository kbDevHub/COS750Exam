import { useState } from "react";
import defaultAvatar from "../assets/user.png";
import { useBadges } from "../utils/useBadges";
import BadgeModal from "../components/BadgeModal";

export default function Profile() {
    const { units, earnedIds } = useBadges();
    const [openId, setOpenId] = useState(null);
    const open = units.find((u) => u.id === openId);

    return (
        <div className="mx-auto max-w-4xl space-y-8 text-gray-700">
            <header className="flex items-center gap-5 ">
                <img
                    src={defaultAvatar}
                    alt="Your profile picture"
                    className="h-20 w-20 rounded-full border-2 border-gray-300 object-cover"
                />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Name</h1>
                    <p className="text-gray-500">u12345678 · Student</p>
                    <p className="mt-1 text-sm font-semibold text-blue-700">
                        {earnedIds.length} of {units.length} badges earned
                    </p>
                </div>
            </header>

            <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">My badges</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                    {units.map((u) => (
                        <li key={u.id}>
                            <button
                                onClick={() => setOpenId(u.id)}
                                aria-haspopup="dialog"
                                className={
                                    "w-full rounded-xl border p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md " +
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
                                    (u.earned ? "border-amber-300 bg-amber-50 shadow-sm" : "border-gray-300 bg-gray-50")
                                }
                            >
                                <img
                                    src={u.img}
                                    alt=""
                                    className={"mx-auto mb-3 h-28 w-28 object-contain " + (u.earned ? "" : "opacity-30 grayscale")}
                                />
                                <p className={"font-semibold " + (u.earned ? "text-gray-900" : "text-gray-500")}>{u.title}</p>
                                <p className="mt-1 text-xs text-gray-600">{u.desc}</p>
                                <p className="mt-2 text-xs font-semibold">
                                    {u.earned ? (
                                        <span className="text-emerald-700">✓ Earned</span>
                                    ) : (
                                        <span className="text-gray-500">{u.done} of {u.total} sections complete</span>
                                    )}
                                </p>
                                <p className="mt-2 text-[11px] text-blue-600">Click for info</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {open && <BadgeModal badge={open} onClose={() => setOpenId(null)} />}
        </div>
    );
}