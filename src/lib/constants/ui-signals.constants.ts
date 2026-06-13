// sessionStorage keys used to signal "open this modal" across a client-side
// navigation (e.g. sidebar shortcut -> target page), without putting the
// intent in the URL. Keeping it out of the URL avoids a visible flash of a
// query param in the address bar that then immediately gets stripped.
//
// This same string doubles as a CustomEvent name. The sessionStorage flag
// alone isn't enough: if the target page is already mounted (e.g. you're
// already on /admin/users and click the sidebar's "Create User" shortcut),
// Next.js doesn't remount the page for a same-URL navigation, so a
// mount-only effect reading sessionStorage would never re-fire. The
// CustomEvent covers that "already there" case; sessionStorage covers the
// "navigating in from elsewhere" case where the page mounts fresh.
export const OPEN_ADD_USER_SIGNAL = "medivance:open-add-user";
export const OPEN_ADD_PATIENT_SIGNAL = "medivance:open-add-patient";
