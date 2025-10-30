import './style.css'

class AnimeFactsApp {
    constructor() {
        this.factsContainer = document.getElementById('factsContainer')
        this.loadingElement = document.getElementById('loading')
        this.errorElement = document.getElementById('error')
        this.loadButton = document.getElementById('loadFacts')
        this.clearButton = document.getElementById('clearFacts')
        this.factCountSelect = document.getElementById('factCount')
        this.animeSelect = document.getElementById('animeSelect')
        this.animes = []

        if (this.loadButton) {
            this.initEventListeners()
            this.loadAnimeList()
        }
    }

    initEventListeners() {
        this.loadButton.addEventListener('click', () => this.loadAnimeFacts())
        this.clearButton.addEventListener('click', () => this.clearData())
    }

    async loadAnimeList() {
        this.showLoading()

        try {
            const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=20')

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.data) {
                this.animes = data.data
                this.populateAnimeSelect()
            } else {
                throw new Error('Invalid API response format')
            }
        } catch (error) {
            console.error('Error loading anime list:', error)
            this.showError('Failed to load anime list. Please try again later.')
        } finally {
            this.hideLoading()
        }
    }

    async loadAnimeFacts() {
        const selectedAnime = this.animeSelect.value
        const factCount = this.factCountSelect.value

        if (!selectedAnime) {
            this.showError('Please select an anime first!')
            return
        }

        this.showLoading()
        this.hideError()

        try {
            const selectedAnimeData = this.animes.find(a => a.mal_id == selectedAnime)

            if (!selectedAnimeData) {
                throw new Error('Selected anime not found')
            }

            const response = await fetch(`https://api.jikan.moe/v4/anime/${selectedAnime}`)

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`)
            }

            const data = await response.json()
            this.displayAnimeInfo(data.data, selectedAnimeData, factCount)

        } catch (error) {
            console.error('Error loading anime facts:', error)
            this.showError('Failed to load anime information. Please try again.')
        } finally {
            this.hideLoading()
        }
    }

    populateAnimeSelect() {
        this.animeSelect.innerHTML = '<option value="">Select an anime...</option>'
        this.animes.forEach(anime => {
            const option = document.createElement('option')
            option.value = anime.mal_id
            option.textContent = anime.title
            this.animeSelect.appendChild(option)
        })
    }

    displayAnimeInfo(animeDetail, animeBasic, factCount) {
        this.factsContainer.innerHTML = ''

        const facts = this.generateFactsFromData(animeDetail, factCount)

        const headerCard = document.createElement('div')
        headerCard.className = 'fact-card'
        headerCard.style.textAlign = 'center'
        headerCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        headerCard.style.color = 'white'

        headerCard.innerHTML = `
            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${animeBasic.title}</h3>
            ${animeBasic.images?.jpg?.image_url ?
                `<img src="${animeBasic.images.jpg.image_url}" alt="${animeBasic.title}" 
                      style="max-width: 200px; border-radius: 8px; margin-bottom: 1rem; border: 3px solid white;">` : ''}
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                ${animeDetail.score ? `<span>⭐ ${animeDetail.score}/10</span>` : ''}
                ${animeDetail.episodes ? `<span>🎬 ${animeDetail.episodes} eps</span>` : ''}
                ${animeDetail.status ? `<span>📊 ${animeDetail.status}</span>` : ''}
            </div>
        `
        this.factsContainer.appendChild(headerCard)

        facts.forEach((fact, index) => {
            const factCard = this.createFactCard(fact, index + 1)
            this.factsContainer.appendChild(factCard)
        })
    }

    generateFactsFromData(anime, count) {
        const facts = []

        if (anime.synopsis) {
            facts.push({
                fact_id: 1,
                fact: `Synopsis: ${anime.synopsis.substring(0, 200)}...`
            })
        }

        if (anime.background) {
            facts.push({
                fact_id: 2,
                fact: `Background: ${anime.background.substring(0, 150)}...`
            })
        }

        if (anime.aired?.from) {
            const date = new Date(anime.aired.from).getFullYear()
            facts.push({
                fact_id: 3,
                fact: `First aired in ${date}`
            })
        }

        if (anime.genres?.length > 0) {
            const genres = anime.genres.map(g => g.name).join(', ')
            facts.push({
                fact_id: 4,
                fact: `Genres: ${genres}`
            })
        }

        if (anime.studios?.length > 0) {
            const studios = anime.studios.map(s => s.name).join(', ')
            facts.push({
                fact_id: 5,
                fact: `Studio: ${studios}`
            })
        }

        if (anime.rating) {
            facts.push({
                fact_id: 6,
                fact: `Rating: ${anime.rating}`
            })
        }

        if (anime.themes?.length > 0) {
            const themes = anime.themes.map(t => t.name).join(', ')
            facts.push({
                fact_id: 7,
                fact: `Themes: ${themes}`
            })
        }

        if (anime.demographics?.length > 0) {
            const demographics = anime.demographics.map(d => d.name).join(', ')
            facts.push({
                fact_id: 8,
                fact: `Demographic: ${demographics}`
            })
        }

        return facts.slice(0, count)
    }

    createFactCard(fact, number) {
        const card = document.createElement('div')
        card.className = 'fact-card'

        card.innerHTML = `
            <div class="fact-number">Fact #${number}</div>
            <div class="fact-text">${fact.fact}</div>
        `

        return card
    }

    clearData() {
        this.factsContainer.innerHTML = ''
        this.hideError()
    }

    showLoading() {
        this.loadingElement.classList.remove('hidden')
        this.loadButton.disabled = true
        this.animeSelect.disabled = true
    }

    hideLoading() {
        this.loadingElement.classList.add('hidden')
        this.loadButton.disabled = false
        this.animeSelect.disabled = false
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
    new AnimeFactsApp()
})