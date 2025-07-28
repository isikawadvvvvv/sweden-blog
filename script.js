document.addEventListener('DOMContentLoaded', () => {
    // === 記事データ (サーバーの代わり) ===
    const posts = [
        { id: 1, title: "FIKAなしでは始まらない！スウェーデン流コーヒーブレイク", excerpt: "ただの休憩じゃない、大切なコミュニケーションの時間。おすすめのシナモンロールとコーヒーの組み合わせも紹介します…", image: "https://placehold.co/1200x600/6B8E23/FFFFFF?text=Fika+Time", date: "2025-06-12", category: "fika-culture" },
        { id: 2, title: "ルンド大学のキャンパスライフ！授業と課題のリアル", excerpt: "実際に通ってみて分かった、スウェーデンの大学の雰囲気や勉強スタイルについて。日本の大学との違いは…？", image: "https://placehold.co/1200x600/4682B4/FFFFFF?text=Lund+University", date: "2025-06-10", category: "student-life" },
        { id: 3, title: "週末は北極圏へ！オーロラを追いかけたキルナ旅行記", excerpt: "ストックホルムから寝台列車で向かう冬の冒険。犬ぞり、アイスホテル、そして夜空を舞う光のカーテン…", image: "https://placehold.co/1200x600/00008B/FFFFFF?text=Northern+Lights", date: "2025-05-28", category: "travel" },
        { id: 4, title: "衝撃の味？ザリガニパーティーとミッドサマーの食卓", excerpt: "スウェーデンの伝統的な夏のイベントで食べられるユニークな料理たち。ニシンの酢漬けは必須アイテム…？", image: "https://placehold.co/1200x600/B22222/FFFFFF?text=Swedish+Crayfish+Party", date: "2025-05-15", category: "swedish-food" }
    ];

    // === グローバル変数 ===
    const categories = { 'all': 'すべて', 'student-life': '学生生活', 'fika-culture': 'フィーカ文化', 'travel': '国内旅行', 'swedish-food': 'スウェーデン料理' };
    let currentCategory = 'all';
    let currentSearchTerm = '';

    // === DOM要素の取得 ===
    const app = document.getElementById('app');

    // === 初期化処理 ===
    if (app) { // トップページのみ実行
        renderHomePageContent();
    }
    document.getElementById('year').textContent = new Date().getFullYear();

    // === ページコンポーネントのレンダリング ===
    function renderHomePageContent() {
        app.innerHTML = `
            <div id="homePage" class="page active">
                <section class="hero-bg h-[50vh] bg-cover bg-center flex items-center justify-center text-white text-center px-4">
                    <div class="bg-black/20 p-8 rounded-lg"><h2 class="text-4xl md:text-6xl font-bold mb-4">元留学生が語る、スウェーデンの魅力</h2></div>
                </section>
                <section class="py-12 bg-white/50"><div class="container mx-auto px-6"><div class="relative mb-8 max-w-lg mx-auto"><input type="text" id="searchInput" placeholder="記事を検索..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"><i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i></div><div id="categoryFilters" class="flex flex-wrap justify-center gap-3"></div></div></section>
                <section class="py-16 sm:py-24"><div class="container mx-auto px-6"><div id="postGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div><div id="noResults" class="text-center text-gray-500 hidden"><p class="text-xl">該当する記事が見つかりませんでした。</p></div></div></section>
            </div>`;
        
        document.getElementById('searchInput').addEventListener('input', e => {
            currentSearchTerm = e.target.value.toLowerCase();
            filterAndRenderPosts();
        });
        renderCategoryButtons();
        filterAndRenderPosts();
    }

    // === 補助関数 ===
    function filterAndRenderPosts() {
        const postGrid = document.getElementById('postGrid');
        const noResults = document.getElementById('noResults');
        let filtered = [...posts];
        if (currentCategory !== 'all') { filtered = filtered.filter(p => p.category === currentCategory); }
        if (currentSearchTerm) { filtered = filtered.filter(p => p.title.toLowerCase().includes(currentSearchTerm)); }
        
        postGrid.innerHTML = '';
        noResults.classList.toggle('hidden', filtered.length > 0);
        
        filtered.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(post => {
            const card = document.createElement('article');
            card.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300';
            // 記事カード全体をリンクにする
            card.innerHTML = `
                <a href="posts/${post.id}.html" class="block w-full h-full">
                    <div class="relative"><img src="${post.image.replace('1200x600', '400x250')}" alt="${post.title}" class="w-full h-56 object-cover"><span class="absolute top-4 left-4 bg-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-full">${categories[post.category]}</span></div>
                    <div class="p-6"><p class="text-sm text-gray-500 mb-2">${new Date(post.date).toLocaleDateString('ja-JP')}</p><h4 class="text-xl font-bold mb-3 h-14">${post.title}</h4></div>
                </a>`;
            postGrid.appendChild(card);
        });
        updateCategoryButtons();
    }
    
    function renderCategoryButtons() {
        const filters = document.getElementById('categoryFilters');
        filters.innerHTML = Object.keys(categories).map(key => 
            `<button data-category="${key}" class="category-btn px-4 py-2 text-sm font-semibold rounded-full transition-colors">${categories[key]}</button>`
        ).join('');
        filters.querySelectorAll('.category-btn').forEach(btn => btn.addEventListener('click', e => {
            currentCategory = e.target.dataset.category;
            filterAndRenderPosts();
        }));
    }
    
    function updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            const is_active = btn.dataset.category === currentCategory;
            btn.classList.toggle('bg-blue-800', is_active);
            btn.classList.toggle('text-white', is_active);
            btn.classList.toggle('shadow', is_active);
            btn.classList.toggle('bg-gray-200', !is_active);
            btn.classList.toggle('text-gray-700', !is_active);
        });
    }
});