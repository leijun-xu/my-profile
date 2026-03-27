'use client';

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Mail, User } from "lucide-react";
import fetchFun from "@/lib/fetch";
import { base_path } from "@/lib/const";

export default function ProfileSettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { data: session, status } = useSession();
    const getProfile = async () => {
        try {
            const data = await fetchFun("/api/profile");
            if (!data.error) {
                setProfileData({
                    firstName: data.data.firstName || "",
                    lastName: data.data.lastName || "",
                    email: data.data.email || ""
                });
            } else {
                setMessage(data.error || "Failed to fetch profile");
            }

        }
        catch (error) {
            setMessage("Error fetching profile");
            console.error(error);
        }
    };


    const handleEmailChange = async () => {
        if (!profileData.email || profileData.email === session?.user?.email) {
            setMessage("Please enter a new email address");
            return;
        }

        setLoading(true);
        try {
            const res = await fetchFun("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: profileData.email }),
            });

            if (res.error) {
                setMessage(res.error || "Failed to update email");
                setLoading(false);
                return;
            }
            setMessage("Email updated successfully!");
            setIsEditing(false);
            signOut({ callbackUrl: base_path + '/auth/signin' })

        } catch (error) {
            setMessage("Error updating email");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getProfile();
    }, []);
    if (status === "loading") {
        return (
            <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-gray-300">Loading...</div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-300 mb-4">Please sign in to view your profile</p>
                    <Link href="/auth/signin" className="text-blue-400 hover:underline">
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className=" mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/resume-auth" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Resume</span>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-gray-400">Manage your account information</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes("successfully")
                        ? "bg-green-500/10 border border-green-500 text-green-400"
                        : "bg-red-500/10 border border-red-500 text-red-400"
                        }`}>
                        {message}
                    </div>
                )}

                {/* User Info Card */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-6">
                    <div className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <User className="w-4 h-4" />
                                First Name
                            </label>
                            <div className="bg-slate-700 rounded px-3 py-2 text-gray-300">
                                {profileData?.firstName || "N/A"}
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <User className="w-4 h-4" />
                                Last Name
                            </label>
                            <div className="bg-slate-700 rounded px-3 py-2 text-gray-300">
                                {profileData?.lastName || "N/A"}
                            </div>
                        </div>

                        {/* Email (Editable) */}
                        <div>
                            <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        value={profileData?.email || ""}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="flex-1 bg-slate-700 border-slate-600 text-white"
                                        placeholder="Enter new email"
                                    />
                                    <Button
                                        onClick={handleEmailChange}
                                        disabled={loading}
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setProfileData({ ...profileData, email: session?.user?.email || "" });
                                            setMessage("");
                                        }}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-slate-700 rounded px-3 py-2">
                                    <span className="text-gray-300">{session?.user?.email || "N/A"}</span>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        size="sm"
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="text-sm text-gray-400">
                    <p>All information is protected and only used for authentication purposes.</p>
                </div>
            </div>
        </div>
    );
}
