'use strict';
// REWIRE's urge map: where in the body an urge is felt. While you surf an urge you tap where it sits (the first surf
// prompt asks you to notice it); the entry keeps those places (body: ['chest', ...]) and the Where urges sit card lights
// up the body by how often each place comes up.
//
// The body outline is from react-body-highlighter (github.com/GV79/react-body-highlighter), used under its licence:
/*
MIT License

Copyright (c) 2020 GV79

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
window.UBM=(()=>{
  // the front of the body: [region, polygons] on a 100 × 220 grid
  const BODY=[["chest",["51.8 41.6 51 55.1 58 58 67.8 55.5 70.6 47.3 62 41.6","29.8 46.5 31.4 55.5 40.8 58 48.2 55.1 47.8 42 37.6 42"]],["obliques",["68.6 63.3 67.3 57.1 58.8 59.6 60 64.1 60.4 83.3 65.7 78.8 66.5 69.8","33.9 78.4 33.1 71.8 31 63.3 32.2 57.1 40.8 59.2 39.2 63.3 39.2 83.7"]],["abs",["56.3 59.2 58 64.1 58.4 78 58.4 92.7 56.3 98.4 55.1 104.1 51.4 107.8 51 84.5 50.6 67.3 51 57.1","43.7 58.8 48.6 57.1 49 67.3 48.6 84.5 48.2 107.3 44.5 103.7 40.8 91.4 40.8 78.4 41.2 64.5"]],["biceps",["16.7 68.2 18 71.4 22.9 66.1 29 53.9 27.8 49.4 20.4 55.9","71.4 49.4 70.2 54.7 76.3 66.1 81.6 71.8 82.9 69 78.8 55.5"]],["triceps",["69.4 55.5 69.4 61.6 75.9 72.7 77.6 70.2 75.5 67.3","22.4 69.4 29.8 55.5 29.8 60.8 22.9 73.1"]],["neck",["55.5 23.7 50.6 33.5 50.6 39.2 61.6 40 70.6 44.9 69.4 36.7 63.3 35.1 58.4 30.6","29 44.9 30.2 37.1 36.3 35.1 41.2 30.2 44.5 24.5 49 33.9 48.6 39.2 38 39.6"]],["front-deltoids",["78.4 53.1 79.6 47.8 79.2 41.2 75.9 38 71 36.3 72.2 42.9 71.4 47.3","28.2 47.3 21.2 53.1 20 47.8 20.4 40.8 24.5 37.1 28.6 37.1 26.9 43.3"]],["head",["42.4 2.9 40 11.8 42 19.6 46.1 23.3 49.8 25.3 54.7 22.4 57.6 19.2 59.2 10.2 57.1 2.4 49.8 0"]],["abductors",["52.7 110.2 54.3 124.9 60 110.2 62 100 64.9 94.3 60 92.7 56.7 104.5","47.8 110.6 44.9 125.3 42 115.9 40.4 113.1 39.6 107.3 38 102.4 34.7 93.9 39.6 92.2 41.6 99.2 43.7 105.3"]],["quadriceps",["34.7 98.8 37.1 108.2 37.1 127.8 34.3 137.1 31 132.7 29.4 120 28.2 111.4 29.4 100.8 32.2 94.7","63.3 105.7 64.5 100 66.9 94.7 70.2 101.2 71 111.8 68.2 133.1 65.3 137.6 62.4 128.6 62 111.4","38.8 129.4 38.4 112.2 41.2 118.4 44.5 129.4 42.9 135.1 40 146.1 36.3 146.5 35.5 140","59.6 145.7 55.5 129 60.8 113.9 61.2 130.2 64.1 139.6 62.9 146.5","32.7 138.4 26.5 145.7 25.7 136.7 25.7 127.3 26.9 114.3 29.4 133.5","71.8 113.1 73.9 124.1 73.9 140.4 72.7 145.7 66.5 138.4 70.2 133.5"]],["knees",["33.9 140 34.7 143.3 35.5 147.3 36.3 151 35.1 156.7 29.8 156.7 27.3 152.7 27.3 147.3 30.2 144.1","65.7 140 72.2 147.8 72.2 152.2 69.8 157.1 64.9 156.7 62.9 151"]],["calves",["71.4 160.4 73.5 153.5 76.7 161.2 79.6 167.8 78.4 187.8 79.6 195.5 74.7 195.5","24.9 194.7 27.8 164.9 28.2 160.4 26.1 154.3 24.9 157.6 22.4 161.6 20.8 167.8 22 188.2 20.8 195.5","72.7 195.1 69.8 159.2 65.3 158.4 64.1 162.4 64.1 165.3 65.7 177.1","35.5 158.4 35.9 162.4 35.9 166.9 35.1 172.2 35.1 176.7 32.2 182 30.6 187.3 26.9 194.7 27.3 187.8 28.2 180.4 28.6 175.5 29 169.8 29.8 164.1 30.2 158.8"]],["forearm",["6.1 88.6 10.2 75.1 14.7 70.2 16.3 74.3 19.2 73.5 4.5 97.6 0 100","84.5 69.8 83.3 73.5 80 73.1 95.1 98.4 100 100.4 93.5 89.4 89.8 76.3","77.6 72.2 77.6 77.6 80.4 84.1 85.3 89.8 92.2 101.2 94.7 99.6","6.9 101.2 13.5 90.6 18.8 84.1 21.6 77.1 21.2 71.8 4.9 98.8"]]];
  // the places you can mark: [key, name, short name for the buttons, the outline's regions]
  const REG=[['head','Head','Head',['head']],['throat','Throat & jaw','Throat',['neck']],['shoulders','Shoulders','Shoulders',['front-deltoids']],
    ['chest','Chest','Chest',['chest']],['stomach','Stomach','Stomach',['abs','obliques']],['hands','Arms & hands','Hands',['biceps','triceps','forearm']],
    ['legs','Legs','Legs',['quadriceps','abductors','calves','knees']]];
  const OF={};REG.forEach(([k,,,rs])=>rs.forEach(r=>OF[r]=k));
  const name=k=>REG.find(r=>r[0]===k)?.[1]||k;
  // a list of places, as words: "chest and stomach"
  const words=ks=>{const n=(ks||[]).filter(k=>REG.some(r=>r[0]===k)).map(k=>name(k).toLowerCase());return n.length>1?n.slice(0,-1).join(', ')+' and '+n.at(-1):n[0]||''};
  // the body: p places solid, s places light. tap: each polygon carries its place, to be tapped
  const fig=(p=[],s=[],tap)=>`<svg class="ub-fig" viewBox="0 0 100 220" aria-hidden="true">${BODY.map(([r,ps])=>{const k=OF[r];
    const c=p.includes(k)?'ub-p':s.includes(k)?'ub-s':'';
    return ps.map(pt=>`<polygon${c?` class="${c}"`:''}${tap&&k?` data-ub="${k}"`:''} points="${pt}"/>`).join('')}).join('')}</svg>`;
  // TODAY's plan art (isionxxx ARCHITECTURE.md, 2h): a picture as a small SVG in the shared plan-art classes (pa-*), which
  // TODAY colours with the palette, light or dark, so it shows without this app's CSS. M: class here → [pa classes, attributes]
  const toArt=(svg,M)=>{try{const r=new DOMParser().parseFromString(svg,'image/svg+xml').documentElement;if(r.nodeName!=='svg')return '';
    [r,...r.querySelectorAll('*')].forEach(e=>{const k=[];(e.getAttribute('class')||'').split(/\s+/).forEach(c=>{const m=M[c];if(!m)return;if(m[0])k.push(m[0]);for(const a in m[1]||{})e.setAttribute(a,m[1][a])});
      e.removeAttribute('class');e.removeAttribute('style');e.removeAttribute('aria-hidden');if(k.length)e.setAttribute('class',k.join(' '))});
    return new XMLSerializer().serializeToString(r)}catch(e){return ''}};
  // TODAY's plan: where your urges sit, beside the danger hour
  const art=(p,s)=>toArt(fig(p,s),{'ub-p':['pa-p'],'ub-s':['pa-s']});
  return {REG,name,words,fig,art};
})();
