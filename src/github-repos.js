import './style.css'

class GitHubApp {
  constructor() {
    this.reposContainer = document.getElementById('reposContainer')
    this.loadingElement = document.getElementById('loading')
    this.errorElement = document.getElementById('error')
    this.loadButton = document.getElementById('loadRepos')
    this.clearButton = document.getElementById('clearRepos')
    this.repoCountSelect = document.getElementById('repoCount')
    
    if (this.loadButton) {
      this.initEventListeners()
    }
  }

  initEventListeners() {
    this.loadButton.addEventListener('click', () => this.loadGitHubData())
    this.clearButton.addEventListener('click', () => this.clearData())
  }

  async loadGitHubData() {
    const count = this.repoCountSelect.value
    this.showLoading()
    this.hideError()

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=${count}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error! status: ${response.status}`)
      }

      const data = await response.json()
      this.displayRepositories(data.items)
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
      this.showError('Failed to load GitHub data. Please try again.')
    } finally {
      this.hideLoading()
    }
  }

  displayRepositories(repos) {
    this.reposContainer.innerHTML = ''
    
    if (!repos || repos.length === 0) {
      this.showError('No repositories found')
      return
    }
    
    repos.forEach((repo, index) => {
      const repoCard = this.createRepoCard(repo, index + 1)
      this.reposContainer.appendChild(repoCard)
    })
  }

  createRepoCard(repo, number) {
    const card = document.createElement('div')
    card.className = 'fact-card'
    
    const stars = repo.stargazers_count?.toLocaleString() || '0'
    const forks = repo.forks_count?.toLocaleString() || '0'
    const language = repo.language || 'Not specified'
    
    card.innerHTML = `
      <div class="fact-number">Repository #${number}</div>
      <h3 class="repo-name">${repo.name}</h3>
      <p class="repo-description">${repo.description || 'No description available'}</p>
      <div class="repo-stats">
        <span class="stat">⭐ ${stars} stars</span>
        <span class="stat"> ${forks} forks</span>
        <span class="stat"> ${language}</span>
      </div>
      <a href="${repo.html_url}" target="_blank" class="repo-link">View on GitHub</a>
    `
    
    return card
  }

  clearData() {
    this.reposContainer.innerHTML = ''
    this.hideError()
  }

  showLoading() {
    this.loadingElement.classList.remove('hidden')
    this.loadButton.disabled = true
  }

  hideLoading() {
    this.loadingElement.classList.add('hidden')
    this.loadButton.disabled = false
  }

  showError(message) {
    this.errorElement.innerHTML = `<p>${message}</p>`
    this.errorElement.classList.remove('hidden')
  }

  hideError() {
    this.errorElement.classList.add('hidden')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GitHubApp()
})