const API = "https://ai-ka-backend.onrender.com";
async function handleResponse(response, defaultMessage) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
}


// GET ALL NOTES
export async function getAllNotes() {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/all`);

  return handleResponse(response, "Failed to fetch notes");
}


// ADD NOTE
export async function addNote(note) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return handleResponse(response, "Failed to add note");
}


// GET ONE NOTE
export async function getNoteById(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/${id}`);

  return handleResponse(response, "Failed to fetch note");
}


// UPDATE NOTE
export async function updateNote(id, note) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return handleResponse(response, "Failed to update note");
}


// TOGGLE FAVORITE
export async function toggleFavorite(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/favorite/${id}`, {
    method: "PATCH",
  });

  return handleResponse(response, "Failed to update favorite");
}


// TOGGLE PIN
export async function togglePin(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/pin/${id}`, {
    method: "PATCH",
  });

  return handleResponse(response, "Failed to update pin");
}


// TOGGLE ARCHIVE
export async function toggleArchive(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/archive/${id}`, {
    method: "PATCH",
  });

  return handleResponse(response, "Failed to update archive");
}


// DUPLICATE NOTE
export async function duplicateNote(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/duplicate/${id}`, {
    method: "POST",
  });

  return handleResponse(response, "Failed to duplicate note");
}


// INCREASE VIEW COUNT
export async function increaseViewCount(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/view/${id}`, {
    method: "PATCH",
  });

  return handleResponse(response, "Failed to update view count");
}


// BULK ARCHIVE
export async function bulkArchiveNotes(ids) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/bulk/archive`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids,
    }),
  });

  return handleResponse(response, "Failed to archive notes");
}


// BULK DELETE
export async function bulkDeleteNotes(ids) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/bulk/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids,
    }),
  });

  return handleResponse(response, "Failed to delete notes");
}


// DELETE NOTE
export async function deleteNote(id) {
  const response = await fetch(`${"https://ai-ka-backend.onrender.com"}/delete/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response, "Failed to delete note");
}