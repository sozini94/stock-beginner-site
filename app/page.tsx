"use client";

import { useEffect, useState } from "react";
import StockChart from "./components/StockChart";

const stockTerms = [
  {
    title: "PER",
    description: "주가가 회사의 이익에 비해 비싼지 보는 지표예요.",
    example: "PER이 낮다고 무조건 좋은 건 아니에요.",
  },
  {
    title: "PBR",
    description: "주가가 회사의 자산가치에 비해 어느 정도인지 보여줘요.",
    example: "자산주를 볼 때 자주 사용돼요.",
  },
  {
    title: "배당",
    description: "회사가 번 돈 일부를 주주에게 나눠주는 것이에요.",
    example: "배당주는 꾸준한 현금흐름을 원하는 투자자가 봐요.",
  },
  {
    title: "ETF",
    description: "여러 종목을 한 바구니에 담아 거래하는 상품이에요.",
    example: "초보자는 개별주보다 ETF로 시작하기도 해요.",
  },
];

const beginnerSteps = [
  "주식은 회사의 일부를 사는 것이라는 개념부터 이해하기",
  "PER, PBR, 매출, 영업이익 같은 기본 용어 익히기",
  "관심 있는 회사의 사업 모델과 수익 구조 살펴보기",
  "소액으로 시작하고, 한 종목에 몰빵하지 않기",
];

const chartPoints = [
  {
    title: "장기 우상향 여부",
    description:
      "S&P500 ETF는 단기 등락보다 장기 추세를 보는 것이 중요해요.",
  },
  {
    title: "고점과 저점",
    description:
      "최근 고점과 저점을 비교하면 가격이 상승 흐름인지, 조정 중인지 볼 수 있어요.",
  },
  {
    title: "거래량",
    description:
      "가격이 크게 움직일 때 거래량이 함께 늘면 시장 관심이 커졌다는 의미일 수 있어요.",
  },
];
type EtfAnalysis = {
  name: string;
  ticker: string;
  close: number;
  change: number;
  changeRate: number;
  ma5: number;
  ma20: number;
  high120: number;
  low120: number;
  positionPercent: number;
  trend: string;
  positionText: string;
  summary: string;
  caution: string;
  support: number;
  resistance: number;
  distanceToSupport: number;
  distanceToResistance: number;
  supportResistanceAnalysis: string;
  chartData: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ma5: number | null;
    ma20: number | null;
  }[];
};
export default function Home() {
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://stock-beginner-site.onrender.com")
      .then((res) => res.json())
      .then((data) => setStocks(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
          주린이를 위한 쉬운 주식 공부
        </span>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          어려운 주식 용어,
          <br />
          이제 쉽게 이해해보세요
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          PER, PBR, 배당, ETF처럼 처음 보면 어려운 개념을 초보자 눈높이에
          맞춰 쉽게 설명하는 주식 교육 웹사이트입니다.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#terms"
            className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            용어부터 배우기
          </a>
          <a
            href="#chart"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            차트 예시 보기
          </a>
        </div>
      </section>

      {/* Stock Terms Cards */}
      <section id="terms" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold text-emerald-300">STOCK TERMS</p>
          <h2 className="mt-2 text-3xl font-bold">주식 용어 카드</h2>
          <p className="mt-3 text-slate-400">
            자주 나오는 용어를 아주 쉽게 풀어봤어요.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stockTerms.map((term) => (
            <article
              key={term.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-2xl font-bold text-emerald-300">
                {term.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {term.description}
              </p>
              <p className="mt-5 rounded-xl bg-slate-900 p-3 text-xs text-slate-400">
                {term.example}
              </p>
            </article>
          ))}
        </div>
      </section>


      {/* Chart Education Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold text-emerald-300">
            LIVE STOCK ANALYSIS
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            실시간 한국 주식 차트 분석
          </h2>

          <p className="mt-3 text-slate-400">
            실제 한국 주식 데이터를 기반으로 차트와 이동평균선을 분석해요.
          </p>
        </div>

        <div className="space-y-16">
          {stocks.map((stock) => (
            <div
              key={stock.ticker}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-3xl font-bold">
                    {stock.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    종목코드 {stock.ticker}
                  </p>
                </div>

                <div className="rounded-full bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-300">
                  {stock.trend}
                </div>
              </div>

              <StockChart
                data={stock.chartData}
                support={stock.support}
                resistance={stock.resistance}
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">현재가</p>

                  <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                    {stock.close.toLocaleString()}원
                  </h4>

                  <p className="mt-3 text-sm text-slate-400">
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toLocaleString()}원 ({stock.changeRate}%)
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">5일선</p>

                  <h4 className="mt-2 text-2xl font-bold text-emerald-300">
                    {stock.ma5.toLocaleString()}원
                  </h4>

                  <p className="mt-3 text-sm text-slate-400">
                    초록색 선은 최근 5일 평균 가격이에요.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">20일선</p>

                  <h4 className="mt-2 text-2xl font-bold text-sky-300">
                    {stock.ma20.toLocaleString()}원
                  </h4>

                  <p className="mt-3 text-sm text-slate-400">
                    파란색 선은 최근 20일 평균 가격이에요.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900/80 p-6">
                <h4 className="text-lg font-bold">
                  현재 차트 해석
                </h4>

                <p className="mt-3 leading-7 text-slate-300">
                  {stock.summary}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <p className="text-sm font-semibold text-red-300">
                  최근 캔들 흐름 분석
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {stock.candleAnalysis}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <p className="text-sm font-semibold text-yellow-300">
                  지지선 / 저항선 자동 분석
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-950/60 p-4">
                    <p className="text-xs text-slate-400">최근 지지선</p>
                    <p className="mt-2 text-xl font-bold text-sky-300">
                      {stock.support.toLocaleString()}원
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      현재가와 약 {stock.distanceToSupport}% 차이
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 p-4">
                    <p className="text-xs text-slate-400">최근 저항선</p>
                    <p className="mt-2 text-xl font-bold text-red-300">
                      {stock.resistance.toLocaleString()}원
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      현재가와 약 {stock.distanceToResistance}% 차이
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  {stock.supportResistanceAnalysis}
                </p>
              </div>

              {/* 선 설명 */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <p className="text-sm font-semibold text-emerald-300">
                    초록색 선: 5일선
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    최근 5거래일 평균 가격을 이은 선이에요. 단기 흐름을 보여줘요.
                    가격이 5일선 위에 있으면 최근 매수세가 강하다고 볼 수 있어요.
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-5">
                  <p className="text-sm font-semibold text-sky-300">
                    파란색 선: 20일선
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    최근 20거래일 평균 가격을 이은 선이에요. 약 한 달 정도의 흐름을
                    보여줘요. 20일선이 위로 향하면 중기 상승 흐름으로 해석할 수 있어요.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">
                    {stock.name} 현재 차트 해석
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    현재 5일선은 {stock.ma5.toLocaleString()}원, 20일선은{" "}
                    {stock.ma20.toLocaleString()}원입니다. 현재가가 5일선과 20일선 위에
                    있으면 상승세가 강한 구간으로 볼 수 있고, 반대로 두 선 아래로 내려가면
                    하락 압력이 커졌다고 해석할 수 있어요.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}