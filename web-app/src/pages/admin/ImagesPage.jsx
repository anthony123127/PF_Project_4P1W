import { useEffect, useState } from "react";
import {
    getImages,
    uploadImage,
    getTags,
    addTagToImage,
    removeTagFromImage,
} from "../../api/cmsApi";

export default function ImagesPage() {
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [file, setFile] = useState(null);

    const loadData = async () => {
        const imgRes = await getImages();
        const tagRes = await getTags();
        setImages(imgRes.data);
        setTags(tagRes.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        await uploadImage(file);
        setFile(null);
        loadData();
    };

    const handleAddTag = async (imageId, tagId) => {
        await addTagToImage(imageId, tagId);
        loadData();
    };

    const handleRemoveTag = async (imageId, tagId) => {
        await removeTagFromImage(imageId, tagId);
        loadData();
    };

    return (
        <div>
            <h2>Images</h2>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {images.map((img) => (
                    <div key={img.id} style={{ border: "1px solid gray", padding: "10px" }}>
                        <img
                            src={`https://localhost:5001${img.url}`}
                            alt=""
                            width="150"
                        />

                        <div>
                            <strong>Tags:</strong>
                            {img.tags.map((t) => (
                                <span key={t.id} style={{ margin: "5px" }}>
                                    {t.name}
                                    <button onClick={() => handleRemoveTag(img.id, t.id)}>x</button>
                                </span>
                            ))}
                        </div>

                        <select onChange={(e) => handleAddTag(img.id, e.target.value)}>
                            <option value="">Add Tag</option>
                            {tags.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}