import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "/src/css/Skill.css";

const Skill = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [tool, setTool] = useState("");
  const [editingSkillId, setEditingSkillId] = useState(null);

  const authToken = localStorage.getItem("auth");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    // Check if we're editing a skill (either from URL state or localStorage)
    const editId = location.state?.skillId || localStorage.getItem("editSkillId");
    
    if (editId) {
      setEditingSkillId(editId);
      fetchSkillDetails(editId);
      // Clear localStorage after retrieving the ID
      localStorage.removeItem("editSkillId");
    }
  }, [authToken, navigate, location]);

  // Fetch skill details when editing
  const fetchSkillDetails = async (skillId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/skills/${skillId}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const skill = await response.json();
      setTitle(skill.title);
      setDescription(skill.description);
      setTool(skill.tool || "");
      // Note: We don't set the image here because it's typically not included in the fetch
      // and we don't want to overwrite any new image the user might upload
    } catch (error) {
      console.error("Error fetching skill details:", error);
    }
  };

  const handleCreateOrUpdateSkill = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("likes", 0);
    if (tool) formData.append("tool", tool);
    if (image) formData.append("file", image);
  
    try {
      const url = editingSkillId
        ? `http://localhost:8080/api/skills/update/${editingSkillId}`
        : "http://localhost:8080/api/skills/create";
  
      const response = await fetch(url, {
        method: editingSkillId ? "PUT" : "POST",
        headers: {
          Authorization: `Basic ${authToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
  
      // Reset form
      setEditingSkillId(null);
      setTitle("");
      setDescription("");
      setImage(null);
      setTool("");
      
      // Show success message
      alert(editingSkillId ? "Skill updated successfully!" : "Skill created successfully!");
      
      // Navigate back to profile
      navigate("/profile");
    } catch (error) {
      console.error("Error saving skill:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {editingSkillId ? "Update Skill" : "Create New Skill"}
      </h1>

      <form onSubmit={handleCreateOrUpdateSkill} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Tool (Optional)</label>
          <input
            type="text"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
          {editingSkillId && !image && (
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to keep the existing image, or select a new one to replace it.
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingSkillId ? "Update Skill" : "Create Skill"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Skill;