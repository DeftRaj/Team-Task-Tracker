import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { User } from "../../types/user";

interface ProfileMenuProps {
  user: User;
  avatarUrl: string;
  onAvatarChange: (avatarUrl: string) => void;
  onLogout: () => void;
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function ProfileMenu({
  user,
  avatarUrl,
  onAvatarChange,
  onLogout,
}: ProfileMenuProps) {
  const dialogRef =
    useRef<HTMLDialogElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [uploadError, setUploadError] =
    useState("");

  const userInitial =
    user.name.charAt(0).toUpperCase();

  function openProfile() {
    setUploadError("");
    dialogRef.current?.showModal();
  }

  function closeProfile() {
    dialogRef.current?.close();
    setUploadError("");
  }

  function handleAvatarButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError(
        "Please choose a JPG, PNG, or WebP image.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setUploadError(
        "Profile picture must be smaller than 2 MB.",
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setUploadError(
          "Unable to read that image. Please try again.",
        );
        return;
      }

      onAvatarChange(reader.result);
      setUploadError("");
    };

    reader.onerror = () => {
      setUploadError(
        "Unable to read that image. Please try again.",
      );
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleLogout() {
    closeProfile();
    onLogout();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        dialogRef.current?.open
      ) {
        closeProfile();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="profile-trigger"
        aria-label={`Open profile for ${user.name}`}
        aria-haspopup="dialog"
        onClick={openProfile}
      >
        <span className="app-header-user-name">
          {user.name}
        </span>

        <span className="avatar">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
            />
          ) : (
            userInitial
          )}
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="profile-dialog"
        aria-labelledby="profile-dialog-title"
        onCancel={closeProfile}
      >
        <div className="profile-dialog-content">
          <div className="profile-dialog-header">
            <div>
              <p className="profile-dialog-eyebrow">
                Account
              </p>

              <h2 id="profile-dialog-title">
                Your profile
              </h2>
            </div>

            <button
              type="button"
              className="profile-dialog-close"
              aria-label="Close profile"
              onClick={closeProfile}
              autoFocus
            >
              ×
            </button>
          </div>

          <div className="profile-details">
            <div className="profile-avatar-large">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${user.name}'s profile`}
                />
              ) : (
                userInitial
              )}
            </div>

            <div className="profile-identity">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="visually-hidden"
              onChange={handleFileChange}
              aria-label="Choose profile picture"
            />

            <button
              type="button"
              className="profile-action-button"
              onClick={handleAvatarButtonClick}
            >
              {avatarUrl
                ? "Change profile picture"
                : "Upload profile picture"}
            </button>

            {uploadError && (
              <p
                className="profile-upload-error"
                role="alert"
              >
                {uploadError}
              </p>
            )}

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}