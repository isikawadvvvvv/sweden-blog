document.addEventListener('DOMContentLoaded', async () => {
    // === グローバル変数 ===
    let posts = [];
    // カテゴリをスウェーデン留学のテーマに変更
    const categories = { 
        'all': 'すべて', 
        'student-life': '学生生活', 
        'fika-culture': 'フィーカ文化', 
        'travel': '国内旅行', 
        'swedish-food': 'スウェーデン料理' 
    };
    let currentCategory = 'all';
    let currentSearchTerm = '';

    // === DOM要素の取得 ===
    const app = document.getElementById('app');
    const mainNav = document.getElementById('mainNav');
    const logo = document.getElementById('logo');

    // === 初期化処理 ===
    await fetchPosts();
    renderHomePage(); // 最初にホームページを表示
    document.getElementById('year').textContent = new Date().getFullYear();

    // === データ取得関数 ===
    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts'); // サーバーにデータをリクエスト
            if (!response.ok) throw new Error('Network response was not ok');
            posts = await response.json();
        } catch (error) {
            console.error('記事の取得に失敗しました:', error);
            app.innerHTML = '<p class="text-center text-red-500 py-20">記事の読み込みに失敗しました。サーバーが起動しているか確認してください。</p>';
        }
    }

    // === ページをレンダリング（描画）する関数群 ===
    function renderHomePage() {
        // ★★★ 状態をリセットする処理 ★★★
        currentCategory = 'all';
        currentSearchTerm = '';

        app.innerHTML = `
            <div id="homePage" class="page active">
                <section class="hero-bg h-[50vh] bg-cover bg-center flex items-center justify-center text-white text-center px-4">
                    <div class="bg-black/20 p-8 rounded-lg">
                        <h2 class="text-4xl md:text-6xl font-bold mb-4">元留学生が語る、スウェーデンの魅力</h2>
                    </div>
                </section>
                <section class="py-12 bg-white/50">
                    <div class="container mx-auto px-6">
                        <div class="relative mb-8 max-w-lg mx-auto">
                            <input type="text" id="searchInput" placeholder="記事を検索..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow">
                            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div id="categoryFilters" class="flex flex-wrap justify-center gap-3"></div>
                    </div>
                </section>
                <section class="py-16 sm:py-24">
                    <div class="container mx-auto px-6">
                        <div id="postGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
                        <div id="noResults" class="text-center text-gray-500 hidden"><p class="text-xl">該当する記事が見つかりませんでした。</p></div>
                    </div>
                </section>
            </div>
        `;
        document.getElementById('searchInput').addEventListener('input', e => {
            currentSearchTerm = e.target.value.toLowerCase();
            filterAndRenderPosts();
        });
        renderCategoryButtons();
        filterAndRenderPosts();
        updateNav('home');
    }

    function renderPostDetailPage(postId) {
        const post = posts.find(p => p.id === postId);
        if (!post) { renderHomePage(); return; }
        app.innerHTML = `
            <div class="page active">
                <article class="container mx-auto px-6 py-16 max-w-4xl">
                    <button id="backButton" class="mb-8 text-blue-800 hover:underline">&larr; 記事一覧に戻る</button>
                    <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">${categories[post.category]}</span>
                    <h1 class="text-4xl md:text-5xl font-bold my-4">${post.title}</h1>
                    <p class="text-sm text-gray-500 mb-8">投稿日: ${new Date(post.date).toLocaleDateString('ja-JP')}</p>
                    <img src="${post.image}" alt="${post.title}" class="w-full h-auto rounded-lg shadow-lg mb-12">
                    <div class="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed">${post.content}</div>
                </article>
            </div>
        `;
        document.getElementById('backButton').addEventListener('click', renderHomePage);
        updateNav('postDetail');
    }

    function renderContactPage() {
        app.innerHTML = `
            <div class="page active">
                <section class="py-16 sm:py-24"><div class="container mx-auto px-6 max-w-xl"><h2 class="text-3xl font-bold text-center mb-4">お問い合わせ</h2><p class="text-center text-gray-600 mb-12">留学に関するご質問など、お気軽にご連絡ください。</p><form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST"><div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-gray-700">お名前</label><input type="text" name="name" id="name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></div><div><label for="email" class="block text-sm font-medium text-gray-700">メールアドレス</label><input type="email" name="email" id="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></div><div><label for="message" class="block text-sm font-medium text-gray-700">お問い合わせ内容</label><textarea name="message" id="message" rows="6" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea></div><div><button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">送信する</button></div></div></form><p id="formStatus" class="text-center mt-6"></p></div></section>
            </div>
        `;
        document.getElementById('contactForm').addEventListener("submit", handleFormSubmit);
        updateNav('contact');
    }

    // === 補助関数群 ===
    function filterAndRenderPosts() {
        const postGrid = document.getElementById('postGrid');
        const noResults = document.getElementById('noResults');
        let filtered = [...posts];
        if (currentCategory !== 'all') { filtered = filtered.filter(p => p.category === currentCategory); }
        if (currentSearchTerm) { filtered = filtered.filter(p => p.title.toLowerCase().includes(currentSearchTerm) || p.content.toLowerCase().includes(currentSearchTerm)); }
        
        postGrid.innerHTML = '';
        noResults.classList.toggle('hidden', filtered.length > 0);
        
        filtered.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(post => {
            const card = document.createElement('article');
            card.className = 'bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer';
            card.innerHTML = `<div class="relative"><img src="${post.image.replace('1200x600', '400x250')}" alt="${post.title}" class="w-full h-56 object-cover"><span class="absolute top-4 left-4 bg-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-full">${categories[post.category]}</span></div><div class="p-6"><p class="text-sm text-gray-500 mb-2">${new Date(post.date).toLocaleDateString('ja-JP')}</p><h4 class="text-xl font-bold mb-3 h-14">${post.title}</h4></div>`;
            card.addEventListener('click', () => renderPostDetailPage(post.id));
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
            // アクティブなボタンの色をテーマカラーに合わせる
            btn.classList.toggle('bg-blue-800', is_active);
            btn.classList.toggle('text-white', is_active);
            btn.classList.toggle('shadow', is_active);
            btn.classList.toggle('bg-gray-200', !is_active);
            btn.classList.toggle('text-gray-700', !is_active);
        });
    }

    function updateNav(currentPage) {
        window.scrollTo(0, 0);
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            const is_active = link.dataset.page === currentPage;
             // アクティブなリンクの色をテーマカラーに合わせる
            link.classList.toggle('text-blue-800', is_active);
            link.classList.toggle('font-bold', is_active);
            link.classList.toggle('text-gray-600', !is_active);
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target, status = document.getElementById('formStatus');
        status.textContent = '送信中...';
        try {
            const res = await fetch(form.action, { method: form.method, body: new FormData(form), headers: {'Accept': 'application/json'} });
            if (res.ok) {
                status.textContent = "お問い合わせありがとうございます。正常に送信されました。";
                status.className = "text-center mt-6 text-green-600";
                form.reset();
            } else {
                status.textContent = "メッセージの送信に失敗しました。";
                status.className = "text-center mt-6 text-red-600";
            }
        } catch (error) {
            status.textContent = "エラーが発生しました。";
            status.className = "text-center mt-6 text-red-600";
        }
    }

    // === ナビゲーションイベントリスナー ===
    mainNav.addEventListener('click', e => {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            if (pageId === 'home') renderHomePage();
            else if (pageId === 'contact') renderContactPage();
        }
    });
    logo.addEventListener('click', renderHomePage);
});