import { Edit, LogOut, Settings, Crown, Activity, ArrowRight, Check, Brain, Target, Sparkles, Users, Mail, ShieldCheck, Monitor, Moon, Sun, UsersRound, BarChart3, Flame } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../config";
import useStore from "../store/useStore";

export default function Profile({ onLogout, setCurrentPage }) {
  const { userProfile, setUserProfile, updateProfile, fetchUserProfile, isPro, setShowPricingModal, teams, currentWorkspace, darkMode } = useStore();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: userProfile.username });
  const [emailForm, setEmailForm] = useState({ email: userProfile.email || "" });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpgrade = () => {
    setShowPricingModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const toastId = toast.loading("Uploading photo...");
    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload-profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");

      const data = await res.json();
      setUserProfile({ profilePhoto: data.profilePhoto });
      localStorage.setItem("profilePhoto", data.profilePhoto);
      toast.success("Profile photo updated!", { id: toastId });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Cloud upload failed.", { id: toastId });
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim()) {
      return toast.error("Username cannot be empty");
    }

    setIsSaving(true);
    const result = await updateProfile({ username: editForm.username });
    setIsSaving(false);

    if (result.success) {
      await fetchUserProfile();
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error(result.message || "Update failed");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ username: userProfile.username });
    setIsEditing(false);
  };

  const handleSaveEmail = async () => {
    const email = emailForm.email.trim();
    if (!email) {
      return toast.error("Email cannot be empty");
    }

    setIsSavingEmail(true);
    const result = await updateProfile({ email });
    setIsSavingEmail(false);

    if (result.success) {
      await fetchUserProfile();
      toast.success("Email updated!");
      setIsEditingEmail(false);
      setEmailForm({ email: email.toLowerCase() });
    } else {
      toast.error(result.message || "Failed to update email");
    }
  };

  const handleCancelEmailEdit = () => {
    setEmailForm({ email: userProfile.email || "" });
    setIsEditingEmail(false);
  };

  const workspaceLabel = useMemo(() => {
    if (currentWorkspace === "personal") return "Personal Workspace";
    return teams.find((team) => team._id === currentWorkspace)?.name || "Team Workspace";
  }, [currentWorkspace, teams]);

  const accountDetails = useMemo(() => {
    return [
      {
        label: "Plan",
        value: isPro ? "Pro Member" : "Free Member",
        icon: <ShieldCheck size={16} className={isPro ? "text-amber-500" : "text-emerald-500"} />
      },
      {
        label: "Theme",
        value: darkMode ? "Dark" : "Light",
        icon: darkMode ? <Moon size={16} className="text-indigo-500" /> : <Sun size={16} className="text-yellow-500" />
      },
      {
        label: "Current Workspace",
        value: workspaceLabel,
        icon: <Monitor size={16} className="text-purple-500" />
      }
    ];
  }, [isPro, darkMode, workspaceLabel]);

  const ProFeaturesCard = () => {
    if (isPro) return null;

    const features = [
      {
        icon: <Brain size={18} />,
        title: "Mind Sweep AI",
        desc: "Dump your thoughts. AI builds your schedule.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
      },
      {
        icon: <Target size={18} />,
        title: "Frog Eater Mode",
        desc: "Un-pausable forced timer to crush your dreaded tasks.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      },
      {
        icon: <Sparkles size={18} />,
        title: "Auto-Scheduler",
        desc: "Smart algorithm auto-blocks time based on your peak hours.",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
      },
      {
        icon: <Flame size={18} />,
        title: "Burnout Predictor",
        desc: "Prevents overworking by analyzing your task velocity.",
        color: "text-red-500",
        bg: "bg-red-500/10"
      },
      {
        icon: <Users size={18} />,
        title: "Unlimited Collaboration",
        desc: "Free users get 2 teams (5 members each). Pro gets unlimited workspaces and members.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
      },
      {
        icon: <Activity size={18} />,
        title: "Deep Insights",
        desc: "90-day heatmap, PDF exports, and theme engine.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      }
    ];

    return (
      <div className="bg-(--card-bg) p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-(--border)/60 shadow-2xl relative overflow-hidden mb-12 animate-in zoom-in-95 fade-in duration-700">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 mb-6 border border-orange-500/20">
               <Crown size={14} className="fill-orange-500/20" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Unlimited Growth</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Unlock the <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Full Power</span> of TaskFlow
            </h2>
          </div>
          <button 
            onClick={handleUpgrade}
            className="px-8 py-4 bg-linear-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center gap-2 group/btn"
          >
            Get Pro Now
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
          {features.map((f, i) => (
            <div key={i} className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-(--bg)/50 border border-(--border)/40 hover:border-orange-500/30 transition-all hover:shadow-lg group/item">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${f.bg} ${f.color} flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform shadow-sm`}>
                  {f.icon}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="font-bold text-[10px] sm:text-sm leading-tight">{f.title}</h4>
                  <p className="text-[9px] sm:text-[11px] font-medium opacity-60 leading-tight sm:leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2 justify-center opacity-40">
          <Check size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-(--text-primary)">Secure Checkout</span>
          <span className="mx-2 text-(--text-primary)">•</span>
          <Check size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-(--text-primary)">Instant Activation</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full pb-30 md:pb-6 transition-colors duration-300">

      {/* Avatar Card */}
      <div className="flex items-center justify-between bg-(--card-bg) p-6 rounded-3xl mb-8 shadow-sm border border-(--border)/60 hover:shadow-md transition-shadow relative overflow-hidden group z-10">
        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-(--gradient-start)/5 rounded-full blur-[40px] pointer-events-none transition-all group-hover:bg-(--gradient-start)/10"></div>

        <div className="flex items-center gap-5 relative z-10 w-full mr-4">
          <div 
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br from-(--gradient-start) to-(--gradient-end) text-white text-2xl font-semibold shadow-lg shadow-(--gradient-start)/20 ring-4 ring-(--gradient-start)/10 overflow-hidden relative group/avatar cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {userProfile.profilePhoto ? (
              <img src={userProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userProfile.username?.charAt(0).toUpperCase() || "U"
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
              <Activity size={18} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="text-xl font-black bg-transparent border-b-2 border-(--accent) focus:outline-none w-full py-1 text-(--text-primary)"
                autoFocus
              />
            ) : (
              <div className="flex flex-col">
                <h2 className="text-2xl font-black tracking-tight">{userProfile.username}</h2>
                <p className="text-xs font-bold text-(--accent) tracking-widest uppercase opacity-80">
                  {isPro ? "Pro Member" : "Free Member"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 relative z-10">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors focus:outline-none"
                title="Save Changes"
              >
                <Check size={18} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors focus:outline-none"
                title="Cancel"
              >
                <ArrowRight className="rotate-180" size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--card-bg) border border-(--border) hover:bg-(--border)/50 transition-colors text-(--text-secondary) hover:text-(--accent) focus:outline-none"
            >
              <Edit size={18} />
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
      </div>

      <ProFeaturesCard />

      {/* Account details */}
      <div className="bg-(--card-bg) rounded-3xl border border-(--border)/60 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] opacity-50">Account Overview</h3>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Profile</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-(--border)/50 bg-(--bg)/35 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Mail size={16} className="text-sky-500" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Email</p>
            </div>
            {isEditingEmail ? (
              <div className="space-y-2">
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full text-sm font-medium bg-(--card-bg) border border-(--border)/60 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent)/30"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEmail}
                    disabled={isSavingEmail}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEmailEdit}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-(--border)/40 hover:bg-(--border)/70"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold truncate">
                  {userProfile.email || "Not set"}
                </p>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-(--border)/40 hover:bg-(--border)/70"
                >
                  {userProfile.email ? "Edit" : "Set Email"}
                </button>
              </div>
            )}
          </div>

          {accountDetails.map((item) => (
            <div key={item.label} className="rounded-2xl border border-(--border)/50 bg-(--bg)/35 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{item.label}</p>
              </div>
              <p className="text-sm font-bold truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCurrentPage("teams")}
          className="bg-(--card-bg) border border-(--border)/60 rounded-3xl p-5 text-left hover:bg-(--border)/40 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <UsersRound size={18} />
            </div>
            <ArrowRight size={16} className="opacity-50" />
          </div>
          <p className="font-black">Manage Teams</p>
          <p className="text-xs opacity-60 mt-1">{teams.length} workspace{teams.length === 1 ? "" : "s"} available</p>
        </button>

        <button
          onClick={() => setCurrentPage("insights")}
          className="bg-(--card-bg) border border-(--border)/60 rounded-3xl p-5 text-left hover:bg-(--border)/40 transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <ArrowRight size={16} className="opacity-50" />
          </div>
          <p className="font-black">Open Insights</p>
          <p className="text-xs opacity-60 mt-1">See streaks, efficiency, and trends</p>
        </button>
      </div>


      {/* Actions */}
      <div className="space-y-4 pt-4 border-t border-(--border)/40 relative z-10">
        <button
          onClick={() => setCurrentPage("settings")}
          className="w-full bg-(--card-bg) hover:bg-(--border)/50 text-(--text-primary) font-bold py-4 rounded-3xl flex items-center justify-center gap-2 transition-colors border border-(--border)/60 shadow-sm focus:outline-none focus:ring-4 focus:ring-(--accent)/20"
        >
          <Settings size={20} />
          Account Settings
        </button>

        <button
          onClick={onLogout}
          className="w-full bg-(--card-bg) hover:bg-red-500/10 text-(--text-primary) hover:text-red-500 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 transition-colors border border-(--border)/60 hover:border-red-500/30 shadow-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"
        >
          <LogOut size={20} />
          Sign Out Workspace
        </button>
      </div>

    </div>
  );
}