import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */class d{constructor(){this.rankingsContainer=document.getElementById("rankingsContainer"),this.loadingElement=document.getElementById("loading"),this.errorElement=document.getElementById("error"),this.loadButton=document.getElementById("loadRankings"),this.clearButton=document.getElementById("clearRankings"),this.rankingTypeSelect=document.getElementById("rankingType"),this.heroStats=[],this.loadButton&&this.initEventListeners()}initEventListeners(){this.loadButton.addEventListener("click",()=>this.loadRankings()),this.clearButton.addEventListener("click",()=>this.clearData())}async loadRankings(){const e=this.rankingTypeSelect.value;this.showLoading(),this.hideError();try{await this.loadHeroesRanking(e)}catch(t){console.error("Error loading rankings:",t),this.showError("Failed to load rankings. Please try again.")}finally{this.hideLoading()}}async loadHeroesRanking(e){try{const t=await fetch("https://api.opendota.com/api/heroStats");if(!t.ok)throw new Error("Failed to load hero stats");this.heroStats=await t.json(),this.displayHeroesRanking(e)}catch(t){throw console.error("Error loading heroes ranking:",t),t}}displayHeroesRanking(e){this.rankingsContainer.innerHTML="";let t=[...this.heroStats];switch(e){case"popularity":t.sort((i,a)=>a.pro_pick+a.pro_ban-(i.pro_pick+i.pro_ban));break;case"winrate":t.sort((i,a)=>{const n=i.pro_win/i.pro_pick||0;return(a.pro_win/a.pro_pick||0)-n});break;case"matches":t.sort((i,a)=>a.pro_pick-i.pro_pick);break}const s=t.slice(0,10);if(s.length===0){this.showError("No ranking data available");return}const r=document.createElement("div");r.className="fact-card",r.innerHTML=`
            <h3 style="color: #586069; margin: 0.5rem 0 0 0;">
                ${this.getRankingDescription(e)}
            </h3>
        `,this.rankingsContainer.appendChild(r),s.forEach((i,a)=>{const n=this.createHeroRankingCard(i,a+1,e);this.rankingsContainer.appendChild(n)})}createHeroRankingCard(e,t,s){var l,c;const r=document.createElement("div");r.className=`fact-card ${t<=3?`rank-${t}`:""}`;const i=e.pro_pick>0?(e.pro_win/e.pro_pick*100).toFixed(1):"0.0",a=(e.pro_pick+e.pro_ban).toLocaleString();let n="";switch(s){case"popularity":n=`Popularity: ${a} games`;break;case"winrate":n=`Win Rate: ${i}%`;break;case"matches":n=`Matches: ${e.pro_pick.toLocaleString()}`;break}const o=this.getHeroImageUrl(e);return r.innerHTML=`
            <div class="fact-number" style="color: ${this.getRankColor(t)}; border-left-color: ${this.getRankColor(t)}">
                ${this.getRankIcon(t)} Rank #${t}
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${o}" alt="${e.localized_name}" 
                     style="width: 60px; height: 60px; border-radius: 8px; border: 2px solid ${this.getRankColor(t)};"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="hero-avatar" style="
                    display: none;
                    width: 60px; 
                    height: 60px; 
                    border-radius: 8px; 
                    border: 2px solid ${this.getRankColor(t)};
                    background: linear-gradient(45deg, #0366d6, #764ba2);
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                "></div>
                <div style="flex: 1;">
                    <h3 class="repo-name">${e.localized_name}</h3>
                    <p class="repo-description">${n}</p>
                    <div class="repo-stats">
                        <span class="stat">📊 ${i}% win rate</span>
                        <span class="stat">🎯 ${((l=e.pro_pick)==null?void 0:l.toLocaleString())||0} picks</span>
                        <span class="stat">🚫 ${((c=e.pro_ban)==null?void 0:c.toLocaleString())||0} bans</span>
                    </div>
                </div>
            </div>
        `,r}getHeroImageUrl(e){if(e.name)return`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${e.name.replace("npc_dota_hero_","")}.png`}getRankingTitle(e){return{popularity:"Most Popular Heroes",winrate:"Highest Win Rate Heroes",matches:"Most Played Heroes"}[e]||"Hero Rankings"}getRankingDescription(e){return{popularity:"Based on total picks and bans in professional Dota 2 matches",winrate:"Heroes with the highest win rate in professional matches",matches:"Heroes played in the most professional matches"}[e]||"Professional Dota 2 statistics"}getRankColor(e){return e===1?"#f1c40f":e===2?"#bdc3c7":e===3?"#cd7f32":"#0366d6"}getRankIcon(e){return e===1?"🥇":e===2?"🥈":e===3?"🥉":"🏆"}clearData(){this.rankingsContainer.innerHTML="",this.hideError()}showLoading(){this.loadingElement.classList.remove("hidden"),this.loadButton.disabled=!0,this.rankingTypeSelect.disabled=!0}hideLoading(){this.loadingElement.classList.add("hidden"),this.loadButton.disabled=!1,this.rankingTypeSelect.disabled=!1}showError(e){this.errorElement.innerHTML=`<p>${e}</p>`,this.errorElement.classList.remove("hidden")}hideError(){this.errorElement.classList.add("hidden")}}document.addEventListener("DOMContentLoaded",()=>{new d});
