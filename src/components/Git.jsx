import React, { useEffect, useState } from 'react';

function Git({username="PANDURANGZURE"}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const [repos, setRepos] = useState([]);

  useEffect(() => {

    //basic 
    fetch('https://api.github.com/users/PANDURANGZURE')
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });   
  }, []); 


  useEffect(()=>{
     fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=5`)
      .then(response => response.json())
      .then(data => {
        setRepos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching repos:', error);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <>
    <div>
      <h2>{user.name} ({user.login})</h2>
      <img src={user.avatar_url} alt="avatar" width={100} />
      <p>Followers: {user.followers}</p>
      <p>Public Repos: {user.public_repos}</p>
      <a href={user.html_url} target="_blank" rel="noopener noreferrer">View Profile</a>
    </div>

    <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a> – ⭐ {repo.stargazers_count}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Git;
