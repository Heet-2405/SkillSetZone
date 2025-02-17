import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import "/src/css/Skill.css";

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [tool, setTool] = useState("");
  const [editingSkillId, setEditingSkillId] = useState(null);

  const authToken = localStorage.getItem("auth"); // Retrieve auth from local storage
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  // Fetch skills from the server
  const fetchSkills = async () => {
    const headers = {
      Authorization: `Basic ${authToken}`, // Pass the token in the format expected by the server
    };

    try {
      const response = await fetch("http://localhost:8080/api/skills/all", {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      if (error.message.includes("401")) {
        navigate("/login"); // Redirect to login page if unauthorized
      }
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if the user is not authenticated
    } else {
      fetchSkills();
    }
  }, [authToken, navigate]);

  // Create or update skill
  const handleCreateOrUpdateSkill = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (tool) formData.append("tool", tool); // Append only if tool is not empty
    if (image) formData.append("file", image);

    const headers = {
      Authorization: `Basic ${authToken}`,
    };

    try {
      if (editingSkillId) {
        // Update existing skill
        const response = await fetch(
          `http://localhost:8080/api/skills/update/${editingSkillId}`,
          {
            method: "PUT",
            headers: headers,
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEditingSkillId(null);
      } else {
        // Create new skill
        const response = await fetch("http://localhost:8080/api/skills/create", {
          method: "POST",
          headers: headers,
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setImage(null);
      setTool("");
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (id) => {
    const headers = {
      Authorization: `Basic ${authToken}`,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/skills/delete/${id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  // Edit skill
  const handleEditSkill = (skill) => {
    setEditingSkillId(skill.id);
    setTitle(skill.title);
    setTool(skill.tool || ""); // Ensure empty tool field if not present
    setDescription(skill.description);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Skill Management</h1>

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
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingSkillId ? "Update Skill" : "Create Skill"}
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Your Skills</h2>
      <ul className="space-y-4">
        {skills.map((skill) => (
          <li key={skill.id} className="p-4 border rounded">
            <h3 className="text-lg font-bold">{skill.title}</h3>
            {/* Only show tool if it exists */}
            {skill.tool && <h3 className="tool-text">{skill.tool}</h3>}

            <p>{skill.description}</p>
            {skill.image && (
              <img
                src={`data:image/jpeg;base64,${skill.image}`}
                alt="Skill"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEditSkill(skill)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skill;
