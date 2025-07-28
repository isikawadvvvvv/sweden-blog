// 必要な部品を読み込む
const express = require('express');
const path = require('path');

// Expressアプリを作成
const app = express();
const port = 3000;

// ===============================================================
// ==  記事データベース (スウェーデン留学記) ==
// ===============================================================
const posts = [
    {
        id: 1,
        title: "FIKAなしでは始まらない！スウェーデン流コーヒーブレイク",
        excerpt: "ただの休憩じゃない、大切なコミュニケーションの時間。おすすめのシナモンロールとコーヒーの組み合わせも紹介します…",
        content: `
            <p class="mb-6 text-lg">スウェーデンでの生活を語る上で欠かせないのが「FIKA（フィーカ）」という文化。これは、同僚や友人、家族とコーヒーを飲みながら甘いもの（フィーカブレッド）を食べて休憩する、スウェーデンの大切な社会的習慣です。</p>
            <h3 class="text-2xl font-bold mb-4 border-l-4 border-yellow-400 pl-4">フィーカは義務？</h3>
            <p class="mb-6">多くの職場では、午前と午後にフィーカの時間が設けられています。これは単なるコーヒーブレイクではなく、仕事の合間にリラックスし、雑談を交わすことでチーム内のコミュニケーションを円滑にする重要な役割を担っています。参加は強制ではありませんが、現地の輪に入る絶好の機会です。</p>
            <h3 class="text-2xl font-bold mb-4 border-l-4 border-yellow-400 pl-4">おすすめのフィーカブレッド</h3>
            <p class="mb-6">フィーカに欠かせないのが甘いお菓子。代表的なものをいくつか紹介します。</p>
            <ul class="list-disc list-inside mb-6 pl-4 space-y-2">
                <li><strong>カネールブッレ (Kanelbulle):</strong> 日本でもおなじみのシナモンロール。カルダモンが効いているのがスウェーデン流です。</li>
                <li><strong>プリンセストータ (Prinsesstårta):</strong> 緑色のマジパンで覆われた、見た目も可愛いドーム型のケーキ。中にはスポンジ、カスタード、生クリームが詰まっています。</li>
                <li><strong>セムラ (Semla):</strong> 本来はイースター前に食べる季節のお菓子ですが、最近では冬になるとカフェに並びます。カルダモンを練り込んだパンにアーモンドペーストとたっぷりのクリームを挟んだ、高カロリーながらも病みつきになる一品です。</li>
            </ul>
            <p class="mb-8">友人とカフェで何時間もおしゃべりするのも、一人で窓の外を眺めながら考え事をするのも、すべてがフィーカ。この「少し立ち止まる時間」こそが、スウェーデンでの生活を豊かにしてくれた気がします。</p>
        `,
        image: "https://placehold.co/1200x600/6B8E23/FFFFFF?text=Fika+Time",
        date: "2025-06-12",
        category: "fika-culture"
    },
    {
        id: 2,
        title: "ルンド大学のキャンパスライフ！授業と課題のリアル",
        excerpt: "実際に通ってみて分かった、スウェーデンの大学の雰囲気や勉強スタイルについて。日本の大学との違いは…？",
        content: "<p>教授をファーストネームで呼ぶ文化、グループワークの多さ、そして膨大な量のリーディング課題。日本の大学とは全く異なる環境での学びは、刺激的であると同時に大変なことも多くありました。</p>",
        image: "https://placehold.co/1200x600/4682B4/FFFFFF?text=Lund+University",
        date: "2025-06-10",
        category: "student-life"
    },
    {
        id: 3,
        title: "週末は北極圏へ！オーロラを追いかけたキルナ旅行記",
        excerpt: "ストックホルムから寝台列車で向かう冬の冒険。犬ぞり、アイスホテル、そして夜空を舞う光のカーテン…",
        content: "<p>冬のスウェーデンでしか体験できない特別な旅。マイナス20度の世界で見たオーロラは、一生忘れられない思い出です。寒さ対策は万全に！</p>",
        image: "https://placehold.co/1200x600/00008B/FFFFFF?text=Northern+Lights",
        date: "2025-05-28",
        category: "travel"
    },
    {
        id: 4,
        title: "衝撃の味？ザリガニパーティーとミッドサマーの食卓",
        excerpt: "スウェーデンの伝統的な夏のイベントで食べられるユニークな料理たち。ニシンの酢漬けは必須アイテム…？",
        content: "<p>夏至を祝う「ミッドサマー」や、夏の終わりの「ザリガニパーティー」は、スウェーデン人にとって大切なイベント。そこには、日本ではなかなかお目にかかれない料理がたくさん並びます。</p>",
        image: "https://placehold.co/1200x600/B22222/FFFFFF?text=Swedish+Crayfish+Party",
        date: "2025-05-15",
        category: "swedish-food"
    }
];

// 'public' フォルダの中身を、Webサイトのファイルとして提供する
app.use(express.static(path.join(__dirname, 'public')));

// APIエンドポイントの作成: '/api/posts' にアクセスが来たら、記事データをJSON形式で返す
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// その他のすべてのアクセスに対しては、index.htmlを返す (SPAの挙動)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// サーバーを指定したポートで起動する
app.listen(port, () => {
    console.log(`ブログサーバーが http://localhost:${port} で起動しました`);
});