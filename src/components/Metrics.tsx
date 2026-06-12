import { Helmet } from 'react-helmet-async';

const faqData = [
  {
    q: 'WAR・ISO・FIPは独自に作られた指標ですか？',
    a: 'いいえ。WAR・ISO・FIPは、もともと野球のデータ分析手法であるセイバーメトリクスで使われている指標です。RakScoutでは、それぞれの考え方を商品分析に応用しています。'
  },
  {
    q: 'なぜ野球の指標を商品分析に使うのですか？',
    a: 'セイバーメトリクスは、表面的な数字だけでは見えない価値を発見するために発展した分析手法です。RakScoutでは、その考え方を参考に、商品の強みやリスクを多角的に分析しています。'
  },
  {
    q: 'FIPは数値が高いほど良いのですか？',
    a: 'いいえ。FIPは数値が低いほど、ショップ対応や配送の安定性が高いことを示します。'
  },
  {
    q: 'WARが高い商品は必ずおすすめですか？',
    a: 'WARは総合的なコストパフォーマンス指標ですが、個人のニーズや好みは異なります。複数の指標を組み合わせて判断することをおすすめします。'
  },
  {
    q: 'セイバーメトリクスとは何ですか？',
    a: 'セイバーメトリクスは、野球の統計データを用いて選手の価値を客観的に評価する分析手法です。従来の成績表では見えにくい本質的な能力を数値化することを目指しています。'
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

export default function Metrics() {
  return (
    <>
      <Helmet>
        <title>RakScout独自指標（WAR・ISO・FIP）とは？ - RakScout</title>
        <meta name="description" content="RakScoutのWAR・ISO・FIP指標の解説。セイバーメトリクスの考え方を商品選びに応用し、価格・レビュー・ショップ品質などの公開データから商品の特徴を可視化します。" />
        <link rel="canonical" href="https://ay-dx.github.io/RakScout/#/metrics" />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      <div className="p-5 pb-10">
        <section className="mb-10">
          <h1 className="text-2xl font-black italic tracking-tighter text-stone-800 mb-4">
            RakScout独自指標（WAR・ISO・FIP）とは？
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            RakScoutでは、野球のデータ分析手法「セイバーメトリクス」の考え方を参考に、
            楽天市場の商品を多角的に分析しています。
          </p>

          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            WAR・ISO・FIPは、もともとプロ野球やMLBで選手の価値を評価するために使われている代表的な指標です。
            RakScoutでは、それぞれの指標が持つ考え方を商品選びに応用し、
            価格・レビュー・ショップ品質などの公開データから商品の特徴を可視化しています。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3">
            WAR（総合コストパフォーマンス）
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            WARは「総合的な貢献度」を表すセイバーメトリクス指標です。
            RakScoutでは、価格・評価・レビュー品質などを総合的に分析し、
            商品全体のコストパフォーマンスを評価しています。
          </p>

          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-black shrink-0">●</span>
              <span>高WAR：価格以上の価値が期待できる商品</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 font-black shrink-0">●</span>
              <span>低WAR：平均的、または価格とのバランスに課題がある商品</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3">
            ISO（商品の個性・インパクト）
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            ISOは本来、野球における「長打力」を表す指標です。
            RakScoutでは、レビュー件数だけでは見えない商品の個性や存在感を評価するために活用しています。
          </p>

          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-black shrink-0">●</span>
              <span>高ISO：特徴や魅力が際立つ商品</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 font-black shrink-0">●</span>
              <span>低ISO：標準的で安定した商品</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3">
            FIP（ショップの安定性）
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            FIPは、守備や運の影響を除いて投手本来の実力を評価するセイバーメトリクス指標です。
            RakScoutではこの考え方を応用し、商品そのものではなく、
            ショップ対応や配送面など購入体験の安定性を評価しています。
          </p>

          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-black shrink-0">●</span>
              <span>低FIP：配送や対応が安定しているショップ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 font-black shrink-0">●</span>
              <span>高FIP：ショップごとの差が出やすい商品</span>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-3">
            なぜセイバーメトリクスを参考にしているのか？
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            セイバーメトリクスは、表面的な数字だけでは見えない価値を発見するために発展してきた分析手法です。
          </p>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            打球速度や打ち出し角度から将来の長打力を予測する「バレルゾーン」の考え方と同様に、
            RakScoutでは限られた公開データをもとに、表面上は見えにくい商品の強みやリスクを推定しています。
          </p>

          <p className="text-sm text-stone-600 leading-relaxed mb-2">
            そのため、
          </p>

          <ul className="space-y-2 text-sm text-stone-600 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-stone-400 font-black shrink-0">•</span>
              <span>商品自体の評価は高いが、ショップの安定性に課題がある</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400 font-black shrink-0">•</span>
              <span>知名度は低いが、満足度の高い隠れた名品である</span>
            </li>
          </ul>

          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            といった、通常のランキングやレビュー件数だけでは気付きにくい特徴も把握できます。
          </p>

          <p className="text-sm text-stone-600 leading-relaxed">
            RakScoutは、セイバーメトリクスの思想を商品選びに応用し、
            数字の裏側にある価値を分かりやすく可視化することを目指しています。
          </p>
        </section>

        {/* FAQアコーディオン */}
        <section className="mb-6">
          <h2 className="text-xl font-black italic tracking-tighter text-stone-800 mb-4">
            よくある質問
          </h2>

          <div className="space-y-2">
            {faqData.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none focus:outline-none focus:ring-2 focus:ring-stone-400 rounded-xl">
                  <span className="text-sm font-black text-stone-700 pr-4">
                    {item.q}
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
        </section>
      </div>
    </>
  );
}
