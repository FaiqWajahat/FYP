"use client";
import { useState } from "react";
import { Edit, Trash, Shield, User as UserIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "@/Components/common/ConfirmationDialog";

export default function UsersTable({ users, onRefresh }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTrigger = (userId, name) => {
    setUserToDelete({ id: userId, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      toast.success("User removed successfully!");
      setDeleteDialogOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to remove user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <Users className="w-12 h-12 text-base-content/20" />
        <p className="text-[10px] uppercase font-black tracking-widest text-base-content/40">No Users Found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
      <table className="table w-full table-md">
        <thead className="text-xs font-semibold text-base-content/70 bg-base-200 uppercase tracking-wide">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th className="hidden md:table-cell">Joined At</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-base-200/40 transition">
              {/* User (Avatar + Info) */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-base-300 ring-offset-1 bg-base-200">
                      <Image
                        src={user.profile_image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                        alt={user.full_name || "User"}
                        width={50}
                        height={50}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium text-xs text-base-content">{user.full_name || "New User"}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      <span className="text-[9px] font-medium text-base-content/40 uppercase tracking-tight">Active</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td>
                <div className="text-xs font-medium text-base-content/70">{user.email || "No Email"}</div>
              </td>

              <td>
                <span className={`badge badge-outline rounded-lg text-[9px] font-black uppercase tracking-widest ${user.role === 'admin'
                    ? "badge-primary text-primary"
                    : "badge-ghost opacity-60"
                  }`}>
                  {user.role || 'User'}
                </span>
              </td>

              {/* Joined At */}
              <td className="hidden md:table-cell text-[10px] text-base-content/50 font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </td>

              {/* Actions */}
              <td>
                <div className="flex justify-end items-center gap-1">
                  <Link
                    href={`/admin/Users/Edit/${user.id}`}
                    className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteTrigger(user.id, user.full_name)}
                    className="btn btn-ghost btn-circle btn-xs hover:bg-base-300 hover:text-error p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      
    <ConfirmationDialog
      isOpen={deleteDialogOpen}
      onClose={() => setDeleteDialogOpen(false)}
      onConfirm={handleConfirmDelete}
      title="Remove User"
      message={`Are you sure you want to permanently remove "${userToDelete?.name}"? All associated data will be lost.`}
      confirmText="Confirm Delete"
      isLoading={isDeleting}
    />
    </>
  );
}
