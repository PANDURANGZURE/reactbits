import React, { useEffect, useState } from 'react';

const Github = ({ username = "PANDURANGZURE" }) => {
  const [repoCount, setRepoCount] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user info to get repo count
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        setRepoCount(userData.public_repos);

        // Fetch recent repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
        );
        const reposData = await reposRes.json();
        setRecentRepos(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>GitHub Info for {username}</h2>
      <p>Total Public Repos: {repoCount}</p>
      <h3>Recent Repositories:</h3>
      <ul>
        {recentRepos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.name}
            </a> – Updated: {new Date(repo.updated_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Github;
