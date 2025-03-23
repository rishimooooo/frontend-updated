import { useEffect, useState } from "react";

export default function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserStories = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://story-backend-1.onrender.com/api/stories/user/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch user stories");

        const data = await res.json();
        setStories(data);
      } catch (error) {
        console.error("Error fetching user stories:", error);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStories();
  }, []);

  if (loading) return <p>Loading your stories...</p>;
  if (error) return <p>{error}</p>;
  if (!stories.length) return <p>No stories found.</p>;

  return (
    <ul>
      {stories.map((story) => (
        <li key={story._id}>
          <h2>{story.title}</h2>
          <p>{story.content}</p>
        </li>
      ))}
    </ul>
  );
}
