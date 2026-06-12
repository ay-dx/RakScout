import { Helmet } from 'react-helmet-async';

const faqData = [
  {
    q: 'RakScoutはどんなサービスですか？',
    a: 'RakScoutは、楽天市場とふるさと納税サイトから「お宝」商品を発見する検索ツールです。野球のデータ分析手法「セイバーメトリクス」の考え方を参考に、WAR・ISO・FIPの3つの独自指標で商品を評価しています。'
  },
  {
    q: 'WAR・ISO・FIPは独自に作られた指標ですか？',
    a: 'いいえ。WAR・ISO・FIPは、もともと野球のデータ分析手法であるセイバーメトリクスで使われている指標です。RakScoutでは、それぞれの考え方を商品分析に応用しています。'
  },
  {
    q: 'なぜ野球の指標を商品分析に使うのですか？',
    a: 'セイバーメトリクスは、表面的な数字だけでは見えない価値を発見するために発展した分析手法です。RakScoutでは、その考え方を参考に、商品の強みやリスクを多角的に分析しています。'
  },
  {
    q: 'WARが高い商品は必ずおすすめですか？',
    a: 'WARは総合的なコストパフォーマンス指標ですが、個人のニーズや好みは異なります。複数の指標を組み合わせて判断することをおすすめします。'
  },
  {
    q: 'FIPは数値が高いほど良いのですか？',
    a: 'いいえ。FIPは数値が低いほど、ショップ対応や配送の安定性が高いことを示します。'
  },
  {
    q: 'ふるさと納税の返礼品も検索できますか？',
    a: 'はい。トップページの「ふるさと納税」タブを選択して検索すると、ふるさと納税の返礼品を対象に検索できます。'
  },
  {
    q: '検索結果はどのようにソートされますか？',
    a: 'デフォルトではWAR（総合コストパフォーマンス）の高い順に表示されます。ISOモード、FIPモードに切り替えることで、それぞれの指標でソートできます。'
  },
  {
    q: '商品のデータはどこから取得していますか？',
    a: '楽天市場の公開API（楽天商品検索API）から取得しています。リアルタイムの価格や在庫状況とは異なる場合があります。'
  }
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a
    }
  }))
};

export default function Faq() {
  return (
    <>
      <Helmet>
        <title>よくある質問 - RakScout</title>
        <meta name="description" content="RakScoutに関するよくある質問と回答。WAR・ISO・FIP指標の意味や、ふるさと納税検索、ソート方法などを解説しています。" />
        <link rel="canonical" href="https://ay-dx.github.io/RakScout/#/faq" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <div className="p-5 pb-10">
        <h1 className="text-2xl font-black italic tracking-tighter text-stone-800 mb-2">
          よくある質問
        </h1>
        <p className="text-sm text-stone-500 mb-6">
          RakScoutに関するよくある質問と回答です
        </p>

        <div className="space-y-2">
          {faqData.map((item, i) => (
            <details
              key={i}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden group"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none focus:outline-none focus:ring-2 focus:ring-stone-400 rounded-xl">
                <span className="text-sm font-black text-stone-700 pr-4">
                  Q. {item.q}
                </span>
                <span className="text-stone-400 text-lg font-black shrink-0 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-stone-600 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
