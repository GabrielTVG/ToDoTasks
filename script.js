const API_BASE = "https://deployfinalgccc2.azurewebsites.net/api";

const form = document.getElementById("data-form");
const titleInput = document.getElementById("title");
const ownerInput = document.getElementById("owner");
const descriptionInput = document.getElementById("description");
const entityList = document.getElementById("data-list");

let entitiesData = [];
let editMode = false;
let editId = null;

async function loadData() {
  try {
    const res = await fetch(`${API_BASE}/getentries`);
    if (!res.ok) throw new Error("Failed to fetch entries");
    entitiesData = await res.json();
    displayData();
  } catch (err) {
    entityList.innerHTML = `<p style='color:red;'>Could not load data. Error: ${err}.</p>`;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const owner = ownerInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !owner || !description) return;

  try {
    if (editMode) {
      await fetch(`${API_BASE}/updateentry`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({rowKey: editId, title, owner, description}),
      });
      editMode = false;
      editId = null;
    } else {
      await fetch(`${API_BASE}/addentry`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, owner, description}),
      });
    }

    form.reset();
    currentPage = 1;
    try {
      await loadData();
    } catch (err) {
      alert("Something went wrong while refreshing the list.");
    }
  } catch (err) {
    alert("Failed to save entry.");
  }
});

let currentPage = 1;
const entriesPerPage = 5;

function displayData() {
  entityList.innerHTML = "";

  if (entitiesData.length === 0) {
    entityList.innerHTML = "<p>No data available.</p>";
    return;
  }

  const start = (currentPage - 1) * entriesPerPage;
  const end = start + entriesPerPage;
  const pageEntries = entitiesData.slice(start, end);

  pageEntries.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <div class="entry-header">
        <div class="entry-title-owner">
          <strong>${entry.title}</strong> create by ${entry.owner}
        </div>
        <div class="entry-timestamp">
          <small>
            ${entry.updatedAt ? `Updated: ${new Date(entry.updatedAt).toLocaleString()}` : `Created: ${new Date(entry.createdAt).toLocaleString()}`}
          </small>
        </div>
      </div>
      <p class="entry-text">${entry.description}</p>
      <div class="entry-actions">
        <button class="edit-btn" data-id="${entry.rowKey}">Edit</button>
        <button class="delete-btn" data-id="${entry.rowKey}">Delete</button>
      </div>
    `;

    entityList.appendChild(div);
  });

  const totalPages = Math.ceil(entitiesData.length / entriesPerPage);
  if (totalPages > 1) {
    const pagination = document.createElement("div");
    pagination.className = "pagination";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.addEventListener("click", () => {
        currentPage = i;
        displayData();
      });
      pagination.appendChild(btn);
    }

    entityList.appendChild(pagination);
  }

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const entry = entitiesData.find((item) => item.rowKey === id);
      titleInput.value = entry.title;
      ownerInput.value = entry.owner;
      descriptionInput.value = entry.description;
      editMode = true;
      editId = id;
      window.scrollTo({top: 0, behavior: "smooth"});
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Delete this entry?")) return;
      try {
        await fetch(`${API_BASE}/deleteentry?rowKey=${id}`, {method: "DELETE"});
        currentPage = 1;
        await loadData();
      } catch (err) {
        alert("Failed to delete entry.");
      }
    });
  });
}

loadData();