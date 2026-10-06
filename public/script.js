(() => {
  'use strict';

  const USER = 'ypleong02';
  const API_URL = `https://api.github.com/users/${USER}/repos?sort=updated&per_page=12`;
  // Only these repos are shown; add an entry here to list another one.
  // The description is the fallback used when the GitHub API is unavailable.
  const SHOWN_REPOS = [{ name: 'yiphang-portfolio', description: 'Personal portfolio' }];

  const list = document.getElementById('repo-list');
  const status = document.getElementById('repos-status');
  if (!list || !status) return;

  const showMessage = (text) => {
    status.textContent = text;
    status.hidden = false;
  };

  // Built with textContent only, so repo names and descriptions can never inject markup.
  // Language and stars are added only when the data came from the API (live).
  const repoCard = (repo, live) => {
    const card = document.createElement('li');
    card.className = 'card';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = `https://github.com/${USER}/${encodeURIComponent(repo.name)}`;
    link.textContent = repo.name;
    title.append(link);

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description provided.';

    card.append(title, description);

    if (live) {
      const meta = document.createElement('p');
      meta.className = 'card-meta';
      const language = document.createElement('span');
      language.textContent = repo.language || 'Other';
      const stars = document.createElement('span');
      const count = Number(repo.stargazers_count) || 0;
      stars.textContent = `★ ${count}`;
      stars.setAttribute('aria-label', `${count} ${count === 1 ? 'star' : 'stars'}`);
      meta.append(language, stars);
      card.append(meta);
    }

    return card;
  };

  // One unauthenticated request per page load (limit is roughly 60 per hour per visitor IP).
  const loadRepos = async () => {
    showMessage('Loading repositories…');
    try {
      const response = await fetch(API_URL, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);

      const data = await response.json();
      const repos = Array.isArray(data)
        ? data.filter((repo) => SHOWN_REPOS.some((shown) => shown.name === repo.name))
        : [];
      if (repos.length === 0) {
        showMessage('No public repositories to show yet.');
        return;
      }

      list.append(...repos.map((repo) => repoCard(repo, true)));
      status.hidden = true;
    } catch (error) {
      console.error(error);
      // Rate limit or network failure: still show the repos, without language and stars.
      list.append(...SHOWN_REPOS.map((repo) => repoCard(repo, false)));
      showMessage('Live details from GitHub are unavailable right now. Please try again later.');
    }
  };

  loadRepos();
})();
