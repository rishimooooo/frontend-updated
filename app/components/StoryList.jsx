import { useEffect, useState } from "react";

export default function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      setError("❌ Please log in to see your stories.");
      setLoading(false);
      return;
    }

    setUser(storedUser); // ✅ Store user info
    fetchUserStories(storedUser.id);
  }, []);

  const fetchUserStories = async (userId) => {
    try {
      const res = await fetch(
        `https://story-backend-1.onrender.com/api/stories/user/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch user stories");

      const data = await res.json();
      setStories(data);
    } catch (error) {
      setError("❌ Failed to load stories.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Loading your stories...</p>;
  if (error) return <p>{error}</p>;
  if (!stories.length) return <p>📭 No stories found.</p>;

  return (
    <div>
      <h2>📖 {user?.name}'s Stories</h2>
      <ul>
        {stories.map((story) => (
          <li key={story._id}>
            <h3>{story.title}</h3>
            <p>{story.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
