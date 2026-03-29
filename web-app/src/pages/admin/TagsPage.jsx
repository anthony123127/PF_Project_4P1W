import { useEffect, useState } from "react";
import { getTags, createTag, deleteTag } from "../../api/cmsApi";

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const loadTags = async () => {
    const res = await getTags();
    setTags(res.data);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreate = async () => {
    if (!newTag) return;
    await createTag(newTag);
    setNewTag("");
    loadTags();
  };

  const handleDelete = async (id) => {
    await deleteTag(id);
    loadTags();
  };

  return (
    <div>
      <h2>Tags</h2>

      <input
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        placeholder="New tag"
      />
      <button onClick={handleCreate}>Add</button>

      <ul>
        {tags.map((t) => (
          <li key={t.id}>
            {t.name}
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}