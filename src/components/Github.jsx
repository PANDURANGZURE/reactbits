import React, { useEffect, useState } from 'react';

const Github = ({ username = "PANDURANGZURE" }) => {
  const [repoCount, setRepoCount] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState({});
  const [totalStars, setTotalStars] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [recentCommits, setRecentCommits] = useState([]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user info to get repo count and followers
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        setRepoCount(userData.public_repos);
        setFollowers(userData.followers);

        // Fetch all repos (max 100 for demo)
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`
        );
        const reposData = await reposRes.json();
        setRecentRepos(
          reposData
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5)
        );

        // Calculate most used languages and total stars
        const langCount = {};
        let stars = 0;
        for (const repo of reposData) {
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
          stars += repo.stargazers_count;
        }
        setLanguages(langCount);
        setTotalStars(stars);

        // Fetch recent commits from the 3 most recently updated repos
        const commitPromises = reposData
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 3)
          .map(async (repo) => {
            const commitsRes = await fetch(
              `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`
            );
            const commitsData = await commitsRes.json();
            return commitsData.map((commit) => ({
              repo: repo.name,
              message: commit.commit.message,
              url: commit.html_url,
              date: commit.commit.author.date,
              sha: commit.sha,
            }));
          });

        const commitsArrays = await Promise.all(commitPromises);
        setRecentCommits(commitsArrays.flat());
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) return <p>Loading...</p>;

  // Get top 3 most used languages
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div>
      <h2>GitHub Info for {username}</h2>
      <p><strong>Public Repositories:</strong> {repoCount}</p>
      <p><strong>Total Stars:</strong> {totalStars}</p>
      <p><strong>Followers:</strong> {followers}</p>
      <h3>Most Used Languages:</h3>
      <ul>
        {topLanguages.length === 0 && <li>No languages found</li>}
        {topLanguages.map(([lang, count]) => (
          <li key={lang}>
            {lang} ({count} repo{count > 1 ? 's' : ''})
          </li>
        ))}
      </ul>
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
      <h3>Recent Commits:</h3>
      <ul>
        {recentCommits.length === 0 && <li>No recent commits found</li>}
        {recentCommits.map((commit) => (
          <li key={commit.sha}>
            <strong>{commit.repo}:</strong>{' '}
            <a href={commit.url} target="_blank" rel="noreferrer">
              {commit.message.length > 50
                ? commit.message.slice(0, 50) + '...'
                : commit.message}
            </a>{' '}
            <em>({new Date(commit.date).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Github;