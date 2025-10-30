import './style.css'

class DotaRankingsApp {
    constructor() {
        this.rankingsContainer = document.getElementById('rankingsContainer')
        this.loadingElement = document.getElementById('loading')
        this.errorElement = document.getElementById('error')
        this.loadButton = document.getElementById('loadRankings')
        this.clearButton = document.getElementById('clearRankings')
        this.rankingTypeSelect = document.getElementById('rankingType')
        
        this.heroStats = []

        if (this.loadButton) {
            this.initEventListeners()
        }
    }

    initEventListeners() {
        this.loadButton.addEventListener('click', () => this.loadRankings())
        this.clearButton.addEventListener('click', () => this.clearData())
    }

    async loadRankings() {
        const rankingType = this.rankingTypeSelect.value

        this.showLoading()
        this.hideError()

        try {
            await this.loadHeroesRanking(rankingType)

        } catch (error) {
            console.error('Error loading rankings:', error)
            this.showError('Failed to load rankings. Please try again.')
        } finally {
            this.hideLoading()
        }
    }

    async loadHeroesRanking(rankingType) {
        try {
            const response = await fetch('https://api.opendota.com/api/heroStats')
            
            if (!response.ok) {
                throw new Error('Failed to load hero stats')
            }

            this.heroStats = await response.json()
            this.displayHeroesRanking(rankingType)

        } catch (error) {
            console.error('Error loading heroes ranking:', error)
            throw error
        }
    }

    displayHeroesRanking(rankingType) {
        this.rankingsContainer.innerHTML = ''

        let sortedHeroes = [...this.heroStats]
        
        switch (rankingType) {
            case 'popularity':
                sortedHeroes.sort((a, b) => (b.pro_pick + b.pro_ban) - (a.pro_pick + a.pro_ban))
                break
            case 'winrate':
                sortedHeroes.sort((a, b) => {
                    const aWinrate = (a.pro_win / a.pro_pick) || 0
                    const bWinrate = (b.pro_win / b.pro_pick) || 0
                    return bWinrate - aWinrate
                })
                break
            case 'matches':
                sortedHeroes.sort((a, b) => b.pro_pick - a.pro_pick)
                break
        }

        const topHeroes = sortedHeroes.slice(0, 10)
        
        if (topHeroes.length === 0) {
            this.showError('No ranking data available')
            return
        }

        const titleCard = document.createElement('div')
        titleCard.className = 'fact-card'
        titleCard.innerHTML = `
            <h3 style="color: #586069; margin: 0.5rem 0 0 0;">
                ${this.getRankingDescription(rankingType)}
            </h3>
        `
        this.rankingsContainer.appendChild(titleCard)

        topHeroes.forEach((hero, index) => {
            const heroCard = this.createHeroRankingCard(hero, index + 1, rankingType)
            this.rankingsContainer.appendChild(heroCard)
        })
    }

    createHeroRankingCard(hero, rank, rankingType) {
        const card = document.createElement('div')
        card.className = `fact-card ${rank <= 3 ? `rank-${rank}` : ''}`
        
        const winrate = hero.pro_pick > 0 ? ((hero.pro_win / hero.pro_pick) * 100).toFixed(1) : '0.0'
        const totalGames = (hero.pro_pick + hero.pro_ban).toLocaleString()
        
        let mainStat = ''
        
        switch (rankingType) {
            case 'popularity':
                mainStat = `Popularity: ${totalGames} games`
                break
            case 'winrate':
                mainStat = `Win Rate: ${winrate}%`
                break
            case 'matches':
                mainStat = `Matches: ${hero.pro_pick.toLocaleString()}`
                break
        }

        const heroImageUrl = this.getHeroImageUrl(hero)

        card.innerHTML = `
            <div class="fact-number" style="color: ${this.getRankColor(rank)}; border-left-color: ${this.getRankColor(rank)}">
                ${this.getRankIcon(rank)} Rank #${rank}
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${heroImageUrl}" alt="${hero.localized_name}" 
                     style="width: 60px; height: 60px; border-radius: 8px; border: 2px solid ${this.getRankColor(rank)};"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hero-avatar" style="
                    display: none;
                    width: 60px; 
                    height: 60px; 
                    border-radius: 8px; 
                    border: 2px solid ${this.getRankColor(rank)};
                    background: linear-gradient(45deg, #0366d6, #764ba2);
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                "></div>
                <div style="flex: 1;">
                    <h3 class="repo-name">${hero.localized_name}</h3>
                    <p class="repo-description">${mainStat}</p>
                    <div class="repo-stats">
                        <span class="stat">📊 ${winrate}% win rate</span>
                        <span class="stat">🎯 ${hero.pro_pick?.toLocaleString() || 0} picks</span>
                        <span class="stat">🚫 ${hero.pro_ban?.toLocaleString() || 0} bans</span>
                    </div>
                </div>
            </div>
        `

        return card
    }

    getHeroImageUrl(hero) {
        if (hero.name) {
            const heroName = hero.name.replace('npc_dota_hero_', '')
            return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`
        }
    }

    getRankingTitle(rankingType) {
        const titles = {
            'popularity': 'Most Popular Heroes',
            'winrate': 'Highest Win Rate Heroes', 
            'matches': 'Most Played Heroes'
        }
        return titles[rankingType] || 'Hero Rankings'
    }

    getRankingDescription(rankingType) {
        const descriptions = {
            'popularity': 'Based on total picks and bans in professional Dota 2 matches',
            'winrate': 'Heroes with the highest win rate in professional matches',
            'matches': 'Heroes played in the most professional matches'
        }
        return descriptions[rankingType] || 'Professional Dota 2 statistics'
    }

    getRankColor(rank) {
        if (rank === 1) return '#f1c40f'
        if (rank === 2) return '#bdc3c7' 
        if (rank === 3) return '#cd7f32'
        return '#0366d6'
    }

    getRankIcon(rank) {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return '🏆'
    }

    clearData() {
        this.rankingsContainer.innerHTML = ''
        this.hideError()
    }

    showLoading() {
        this.loadingElement.classList.remove('hidden')
        this.loadButton.disabled = true
        this.rankingTypeSelect.disabled = true
    }

    hideLoading() {
        this.loadingElement.classList.add('hidden')
        this.loadButton.disabled = false
        this.rankingTypeSelect.disabled = false
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
    new DotaRankingsApp()
})